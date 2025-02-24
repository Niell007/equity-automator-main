import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { departments, employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { AuditService } from '@/services/audit';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const departmentUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  code: z.string().min(1).max(20).optional(),
  description: z.string().optional(),
  managerId: z.number().optional(),
  parentDepartmentId: z.number().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; departmentId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [department] = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
        description: departments.description,
        managerId: departments.managerId,
        parentDepartmentId: departments.parentDepartmentId,
        status: departments.status,
        createdAt: departments.createdAt,
        updatedAt: departments.updatedAt,
      })
      .from(departments)
      .where(
        and(
          eq(departments.id, parseInt(params.departmentId)),
          eq(departments.organizationId, parseInt(params.organizationId))
        )
      );

    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    // Get employees in the department
    const departmentEmployees = await db
      .select({
        id: employees.id,
        employeeId: employees.employeeId,
        firstName: employees.firstName,
        lastName: employees.lastName,
        position: employees.position,
        status: employees.status,
      })
      .from(employees)
      .where(
        and(
          eq(employees.departmentId, parseInt(params.departmentId)),
          eq(employees.organizationId, parseInt(params.organizationId))
        )
      );

    // Log the view action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'VIEW',
      entityType: 'DEPARTMENT',
      entityId: department.id.toString(),
      details: {
        name: department.name,
        code: department.code,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...department,
        employees: departmentEmployees,
      },
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch department',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { organizationId: string; departmentId: string } }
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
    const validatedData = departmentUpdateSchema.parse(body);

    if (validatedData.code) {
      // Check if department code is unique within the organization
      const existingDepartment = await db
        .select({ id: departments.id })
        .from(departments)
        .where(
          and(
            eq(departments.organizationId, parseInt(params.organizationId)),
            eq(departments.code, validatedData.code),
            eq(departments.id, parseInt(params.departmentId), true)
          )
        )
        .limit(1);

      if (existingDepartment.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Department code must be unique within the organization',
          },
          { status: 400 }
        );
      }
    }

    const [department] = await db
      .update(departments)
      .set(validatedData)
      .where(
        and(
          eq(departments.id, parseInt(params.departmentId)),
          eq(departments.organizationId, parseInt(params.organizationId))
        )
      )
      .returning();

    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    // Log the update action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'UPDATE',
      entityType: 'DEPARTMENT',
      entityId: department.id.toString(),
      details: {
        name: department.name,
        code: department.code,
        changes: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error('Error updating department:', error);
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
        error: 'Failed to update department',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; departmentId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if department has employees
    const employeeCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(
        and(
          eq(employees.departmentId, parseInt(params.departmentId)),
          eq(employees.organizationId, parseInt(params.organizationId))
        )
      );

    if (employeeCount[0].count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete department with active employees',
        },
        { status: 400 }
      );
    }

    // Check if department has child departments
    const childCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(
        and(
          eq(departments.parentDepartmentId, parseInt(params.departmentId)),
          eq(departments.organizationId, parseInt(params.organizationId))
        )
      );

    if (childCount[0].count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete department with child departments',
        },
        { status: 400 }
      );
    }

    const [department] = await db
      .delete(departments)
      .where(
        and(
          eq(departments.id, parseInt(params.departmentId)),
          eq(departments.organizationId, parseInt(params.organizationId))
        )
      )
      .returning();

    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    // Log the delete action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'DELETE',
      entityType: 'DEPARTMENT',
      entityId: department.id.toString(),
      details: {
        name: department.name,
        code: department.code,
      },
    });

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete department',
      },
      { status: 500 }
    );
  }
} 