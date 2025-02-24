import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports, employees, reportFindings } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and, desc, sql } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { z } from 'zod';

const generateReportSchema = z.object({
  type: z.enum(['QUARTERLY', 'ANNUAL', 'AUDIT']),
  period: z.array(z.string()).length(2),
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

    const reportsList = await db
      .select({
        id: reports.id,
        type: reports.type,
        status: reports.status,
        generatedAt: reports.generatedAt,
        generatedBy: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
        score: reports.score,
        findings: reports.findings,
        recommendations: reports.recommendations,
      })
      .from(reports)
      .innerJoin(employees, eq(employees.id, reports.generatedBy))
      .where(eq(reports.organizationId, organizationId))
      .orderBy(desc(reports.generatedAt));

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'REPORTS',
      details: { count: reportsList.length },
    });

    return NextResponse.json({ success: true, data: reportsList });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
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
    
    const validatedData = generateReportSchema.parse(body);
    const [startDate, endDate] = validatedData.period;

    // Create the report record
    const [newReport] = await db
      .insert(reports)
      .values({
        organizationId,
        type: validatedData.type,
        generatedBy: session.user.id,
        periodStart: new Date(startDate),
        periodEnd: new Date(endDate),
      })
      .returning();

    // Log the report generation
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'CREATE',
      entityType: 'REPORT',
      entityId: newReport.id,
      details: {
        type: validatedData.type,
        periodStart: startDate,
        periodEnd: endDate,
      },
    });

    // Start the report generation process
    // This should be handled by a background job in production
    generateReport(newReport.id, organizationId, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: { reportId: newReport.id },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function generateReport(
  reportId: number,
  organizationId: number,
  startDate: string,
  endDate: string
) {
  try {
    // Update report status to processing
    await db
      .update(reports)
      .set({ status: 'PROCESSING' })
      .where(eq(reports.id, reportId));

    // Fetch required data for the report
    const [
      employeeStats,
      genderDistribution,
      ethnicityDistribution,
      salaryStats,
    ] = await Promise.all([
      // Employee statistics
      db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`count(*) filter (where ${employees.status} = 'ACTIVE')`,
          new: sql<number>`count(*) filter (where ${employees.startDate} >= ${startDate}::timestamp)`,
        })
        .from(employees)
        .where(eq(employees.organizationId, organizationId)),

      // Gender distribution
      db
        .select({
          gender: employees.gender,
          count: sql<number>`count(*)`,
        })
        .from(employees)
        .where(eq(employees.organizationId, organizationId))
        .groupBy(employees.gender),

      // Ethnicity distribution
      db
        .select({
          ethnicity: employees.ethnicity,
          count: sql<number>`count(*)`,
        })
        .from(employees)
        .where(eq(employees.organizationId, organizationId))
        .groupBy(employees.ethnicity),

      // Salary statistics by gender and ethnicity
      db
        .select({
          gender: employees.gender,
          ethnicity: employees.ethnicity,
          avgSalary: sql<number>`avg(${employees.salary})`,
          minSalary: sql<number>`min(${employees.salary})`,
          maxSalary: sql<number>`max(${employees.salary})`,
        })
        .from(employees)
        .where(eq(employees.organizationId, organizationId))
        .groupBy(employees.gender, employees.ethnicity),
    ]);

    // Calculate compliance score and generate findings
    const findings = [];
    let score = 100;

    // Example finding generation (this should be more sophisticated in production)
    const genderRatios = calculateGenderRatios(genderDistribution[0]);
    if (Math.abs(genderRatios.female - 50) > 10) {
      score -= 10;
      findings.push({
        type: 'ISSUE',
        category: 'GENDER_EQUITY',
        severity: 'HIGH',
        title: 'Gender Imbalance Detected',
        description: `Current gender distribution shows ${genderRatios.female}% female representation, which deviates significantly from the target of 50%.`,
        impact: 'This imbalance may indicate systemic barriers in recruitment or retention.',
        recommendation: 'Review recruitment processes and implement targeted diversity initiatives.',
      });
    }

    // Update report with findings and score
    await db.transaction(async (tx) => {
      // Insert findings
      if (findings.length > 0) {
        await tx
          .insert(reportFindings)
          .values(
            findings.map((finding) => ({
              reportId,
              ...finding,
            }))
          );
      }

      // Update report status and metrics
      await tx
        .update(reports)
        .set({
          status: 'COMPLETED',
          score,
          findings: findings.length,
          recommendations: findings.filter((f) => f.type === 'RECOMMENDATION').length,
          data: {
            employeeStats,
            genderDistribution,
            ethnicityDistribution,
            salaryStats,
          },
        })
        .where(eq(reports.id, reportId));
    });
  } catch (error) {
    console.error('Error generating report:', error);
    await db
      .update(reports)
      .set({ status: 'FAILED' })
      .where(eq(reports.id, reportId));
  }
}

function calculateGenderRatios(stats: any) {
  const total = Object.values(stats).reduce((sum: any, count: any) => sum + count, 0);
  return {
    female: ((stats.female || 0) / total) * 100,
    male: ((stats.male || 0) / total) * 100,
    other: ((stats.other || 0) / total) * 100,
  };
} 