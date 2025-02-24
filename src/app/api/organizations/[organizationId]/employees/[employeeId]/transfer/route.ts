import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees, departments } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { z } from 'zod';

const transferSchema = z.object({
  departmentId: z.number(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { organizationId: string; employeeId: string } }
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
    const employeeId = parseInt(params.employeeId);

    const body = await request.json();
    const validatedData = transferSchema.parse(body);

    // Verify the target department exists and belongs to the organization
    const targetDepartment = await db
      .select()
      .from(departments)
      .where(
        and(
          eq(departments.id, validatedData.departmentId),
          eq(departments.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!targetDepartment.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid target department' },
        { status: 400 }
      );
    }

    // Get the employee's current department for logging
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    if (!employee.length) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Update the employee's department
    await db
      .update(employees)
      .set({ departmentId: validatedData.departmentId })
      .where(
        and(
          eq(employees.id, employeeId),
          eq(employees.organizationId, organizationId)
        )
      );

    // Log the transfer action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'TRANSFER',
      entityType: 'EMPLOYEE',
      entityId: employeeId.toString(),
      details: {
        fromDepartmentId: employee[0].departmentId,
        toDepartmentId: validatedData.departmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee transferred successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    console.error('Error transferring employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to transfer employee' },
      { status: 500 }
    );
  }
} 