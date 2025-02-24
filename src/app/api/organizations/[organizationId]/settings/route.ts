import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { complianceSettings } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { z } from 'zod';

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
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

    const settings = await db
      .select()
      .from(complianceSettings)
      .where(eq(complianceSettings.organizationId, organizationId));

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'SETTINGS',
      details: { count: settings.length },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
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
    const validatedData = settingSchema.parse(body);

    // Check if setting already exists
    const existingSetting = await db
      .select()
      .from(complianceSettings)
      .where(
        and(
          eq(complianceSettings.organizationId, organizationId),
          eq(complianceSettings.key, validatedData.key)
        )
      );

    if (existingSetting.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Setting already exists' },
        { status: 400 }
      );
    }

    // Create new setting
    const [newSetting] = await db
      .insert(complianceSettings)
      .values({
        organizationId,
        ...validatedData,
      })
      .returning();

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'CREATE',
      entityType: 'SETTING',
      entityId: newSetting.id,
      details: {
        key: validatedData.key,
        value: validatedData.value,
      },
    });

    return NextResponse.json({ success: true, data: newSetting });
  } catch (error) {
    console.error('Error creating setting:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create setting' },
      { status: 500 }
    );
  }
} 