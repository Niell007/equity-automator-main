import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and, desc } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { z } from 'zod';

const markAsReadSchema = z.object({
  notificationIds: z.array(z.number()),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = parseInt(params.organizationId);
    const searchParams = new URL(request.url).searchParams;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const query = db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.organizationId, organizationId),
          eq(notifications.userId, session.user.id)
        )
      )
      .orderBy(desc(notifications.createdAt));

    if (unreadOnly) {
      query.where(eq(notifications.isRead, false));
    }

    const notificationList = await query;

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'NOTIFICATIONS',
      details: { count: notificationList.length },
    });

    return NextResponse.json({ success: true, data: notificationList });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = parseInt(params.organizationId);
    const body = await request.json();
    const { notificationIds } = markAsReadSchema.parse(body);

    await db
      .update(notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(
        and(
          eq(notifications.organizationId, organizationId),
          eq(notifications.userId, session.user.id),
          notifications.id.in(notificationIds)
        )
      );

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'UPDATE',
      entityType: 'NOTIFICATIONS',
      details: { notificationIds, status: 'READ' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
} 