import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { departments, employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and, sql } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';

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

    // Fetch departments with employee counts
    const departmentsWithCounts = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
        description: departments.description,
        managerId: departments.managerId,
        parentDepartmentId: departments.parentDepartmentId,
        status: departments.status,
        employeeCount: sql<number>`COUNT(DISTINCT ${employees.id})`,
      })
      .from(departments)
      .leftJoin(
        employees,
        and(
          eq(employees.departmentId, departments.id),
          eq(employees.status, 'ACTIVE')
        )
      )
      .where(eq(departments.organizationId, organizationId))
      .groupBy(departments.id);

    // Fetch manager details
    const managerDetails = await db
      .select({
        id: employees.id,
        firstName: employees.firstName,
        lastName: employees.lastName,
        email: employees.email,
      })
      .from(employees)
      .innerJoin(departments, eq(departments.managerId, employees.id))
      .where(eq(departments.organizationId, organizationId));

    // Create a map of manager details by ID
    const managerMap = new Map(
      managerDetails.map(manager => [manager.id, manager])
    );

    // Combine department data with manager details
    const enrichedDepartments = departmentsWithCounts.map(dept => ({
      ...dept,
      manager: dept.managerId ? managerMap.get(dept.managerId) : null,
    }));

    // Log the view action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'DEPARTMENT_HIERARCHY',
      details: { departmentCount: enrichedDepartments.length },
    });

    return NextResponse.json({
      success: true,
      data: enrichedDepartments,
    });
  } catch (error) {
    console.error('Error fetching department hierarchy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch department hierarchy' },
      { status: 500 }
    );
  }
} 