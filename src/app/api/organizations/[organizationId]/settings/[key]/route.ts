import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { complianceSettings } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { z } from 'zod';

const updateSettingSchema = z.object({
  value: z.string().min(1),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { organizationId: string; key: string } }
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
    const key = params.key;
    const body = await request.json();
    const validatedData = updateSettingSchema.parse(body);

    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(complianceSettings)
      .where(
        and(
          eq(complianceSettings.organizationId, organizationId),
          eq(complianceSettings.key, key)
        )
      );

    if (existingSetting.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Setting not found' },
        { status: 404 }
      );
    }

    // Update setting
    const [updatedSetting] = await db
      .update(complianceSettings)
      .set({
        value: validatedData.value,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(complianceSettings.organizationId, organizationId),
          eq(complianceSettings.key, key)
        )
      )
      .returning();

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'UPDATE',
      entityType: 'SETTING',
      entityId: updatedSetting.id,
      details: {
        key,
        oldValue: existingSetting[0].value,
        newValue: validatedData.value,
      },
    });

    return NextResponse.json({ success: true, data: updatedSetting });
  } catch (error) {
    console.error('Error updating setting:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; key: string } }
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
    const key = params.key;

    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(complianceSettings)
      .where(
        and(
          eq(complianceSettings.organizationId, organizationId),
          eq(complianceSettings.key, key)
        )
      );

    if (existingSetting.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Setting not found' },
        { status: 404 }
      );
    }

    // Delete setting
    await db
      .delete(complianceSettings)
      .where(
        and(
          eq(complianceSettings.organizationId, organizationId),
          eq(complianceSettings.key, key)
        )
      );

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'DELETE',
      entityType: 'SETTING',
      entityId: existingSetting[0].id,
      details: {
        key,
        value: existingSetting[0].value,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
} 