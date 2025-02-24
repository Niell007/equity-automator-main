import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { AuditService } from '@/services/audit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const employeeUpdateSchema = z.object({
  employeeId: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  gender: z.string().min(1).optional(),
  ethnicity: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'TERMINATED', 'ON_LEAVE']).optional(),
  salary: z.number().min(0).optional(),
});

export async function GET(
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

    const [employee] = await db
      .select()
      .from(employees)
      .where(
        and(
          eq(employees.id, parseInt(params.employeeId)),
          eq(employees.organizationId, parseInt(params.organizationId))
        )
      );

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Log the view action
    await AuditService.logEmployeeAction({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'VIEW',
      entityId: employee.id.toString(),
      details: {
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch employee',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const validatedData = employeeUpdateSchema.parse(body);

    if (validatedData.startDate) {
      validatedData.startDate = new Date(validatedData.startDate).toISOString();
    }

    const [employee] = await db
      .update(employees)
      .set(validatedData)
      .where(
        and(
          eq(employees.id, parseInt(params.employeeId)),
          eq(employees.organizationId, parseInt(params.organizationId))
        )
      )
      .returning();

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Log the update action
    await AuditService.logEmployeeAction({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'UPDATE',
      entityId: employee.id.toString(),
      details: {
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        changes: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update employee',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const [employee] = await db
      .delete(employees)
      .where(
        and(
          eq(employees.id, parseInt(params.employeeId)),
          eq(employees.organizationId, parseInt(params.organizationId))
        )
      )
      .returning();

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Log the delete action
    await AuditService.logEmployeeAction({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'DELETE',
      entityId: employee.id.toString(),
      details: {
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete employee',
      },
      { status: 500 }
    );
  }
} 