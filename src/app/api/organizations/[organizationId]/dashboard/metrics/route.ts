import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees, departments, auditLogs } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and, sql, desc } from 'drizzle-orm';
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

    // Get total employees and active departments
    const [employeeCount, departmentCount] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(employees)
        .where(eq(employees.organizationId, organizationId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(departments)
        .where(
          and(
            eq(departments.organizationId, organizationId),
            eq(departments.status, 'ACTIVE')
          )
        ),
    ]);

    // Calculate gender distribution
    const genderDistribution = await db
      .select({
        gender: employees.gender,
        count: sql<number>`count(*)`,
      })
      .from(employees)
      .where(eq(employees.organizationId, organizationId))
      .groupBy(employees.gender);

    const totalEmployees = employeeCount[0].count;
    const genderStats = {
      male: 0,
      female: 0,
      other: 0,
    };

    genderDistribution.forEach(({ gender, count }) => {
      const percentage = (count / totalEmployees) * 100;
      genderStats[gender.toLowerCase() as keyof typeof genderStats] = Math.round(percentage);
    });

    // Calculate ethnicity distribution
    const ethnicityDistribution = await db
      .select({
        ethnicity: employees.ethnicity,
        count: sql<number>`count(*)`,
      })
      .from(employees)
      .where(eq(employees.organizationId, organizationId))
      .groupBy(employees.ethnicity);

    const ethnicityStats: { [key: string]: number } = {};
    ethnicityDistribution.forEach(({ ethnicity, count }) => {
      const percentage = (count / totalEmployees) * 100;
      ethnicityStats[ethnicity.toLowerCase()] = Math.round(percentage);
    });

    // Get recent activities
    const recentActivities = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        timestamp: auditLogs.createdAt,
        user: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
      })
      .from(auditLogs)
      .innerJoin(employees, eq(employees.id, auditLogs.userId))
      .where(eq(auditLogs.organizationId, organizationId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    // Calculate compliance score (example logic)
    const complianceScore = 85; // This should be calculated based on your specific requirements

    // Count pending actions (example logic)
    const pendingActions = 3; // This should be calculated based on your specific requirements

    // Log the dashboard view
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'DASHBOARD',
      details: {
        totalEmployees,
        activeDepartments: departmentCount[0].count,
        complianceScore,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalEmployees,
        activeDepartments: departmentCount[0].count,
        complianceScore,
        pendingActions,
        genderDistribution: genderStats,
        ethnicityDistribution: ethnicityStats,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
} 