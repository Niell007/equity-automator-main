import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import PDFDocument from 'pdfkit';

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; reportId: string } }
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
    const reportId = parseInt(params.reportId);

    // Fetch report data
    const [report] = await db
      .select()
      .from(reports)
      .where(
        and(
          eq(reports.id, reportId),
          eq(reports.organizationId, organizationId)
        )
      );

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Report is not ready for download' },
        { status: 400 }
      );
    }

    // Generate PDF
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      return new Response(result, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="report-${reportId}.pdf"`,
        },
      });
    });

    // Add content to PDF
    doc
      .fontSize(25)
      .text('Employment Equity Compliance Report', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Report Type: ${report.type}`)
      .text(`Generated At: ${report.generatedAt}`)
      .text(`Period: ${report.periodStart} to ${report.periodEnd}`)
      .text(`Compliance Score: ${report.score}%`)
      .moveDown();

    // Add sections based on report data
    const data = report.data as any;

    // Employee Statistics
    doc
      .fontSize(16)
      .text('Employee Statistics')
      .moveDown()
      .fontSize(12)
      .text(`Total Employees: ${data.employeeStats.total}`)
      .text(`Active Employees: ${data.employeeStats.active}`)
      .text(`New Hires: ${data.employeeStats.new}`)
      .moveDown();

    // Gender Distribution
    doc
      .fontSize(16)
      .text('Gender Distribution')
      .moveDown()
      .fontSize(12);

    data.genderDistribution.forEach((item: any) => {
      doc.text(`${item.gender}: ${item.count} employees`);
    });
    doc.moveDown();

    // Ethnicity Distribution
    doc
      .fontSize(16)
      .text('Ethnicity Distribution')
      .moveDown()
      .fontSize(12);

    data.ethnicityDistribution.forEach((item: any) => {
      doc.text(`${item.ethnicity}: ${item.count} employees`);
    });
    doc.moveDown();

    // Salary Statistics
    doc
      .fontSize(16)
      .text('Salary Statistics')
      .moveDown()
      .fontSize(12);

    data.salaryStats.forEach((stat: any) => {
      doc
        .text(`${stat.gender} - ${stat.ethnicity}:`)
        .text(`  Average: $${stat.avgSalary.toFixed(2)}`)
        .text(`  Range: $${stat.minSalary} - $${stat.maxSalary}`)
        .moveDown();
    });

    doc.end();

    // Log the download
    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'DOWNLOAD',
      entityType: 'REPORT',
      entityId: reportId,
      details: {
        reportType: report.type,
        generatedAt: report.generatedAt,
      },
    });

    return new Response(Buffer.concat(chunks), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${reportId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download report' },
      { status: 500 }
    );
  }
} 