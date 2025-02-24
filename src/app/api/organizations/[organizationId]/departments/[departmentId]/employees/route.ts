import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';

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

    const organizationId = parseInt(params.organizationId);
    const departmentId = parseInt(params.departmentId);

    const departmentEmployees = await db
      .select()
      .from(employees)
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(employees.departmentId, departmentId)
        )
      );

    // Log the view action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'DEPARTMENT_EMPLOYEES',
      entityId: departmentId.toString(),
      details: { employeeCount: departmentEmployees.length },
    });

    return NextResponse.json({
      success: true,
      data: departmentEmployees,
    });
  } catch (error) {
    console.error('Error fetching department employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch department employees' },
      { status: 500 }
    );
  }
} 