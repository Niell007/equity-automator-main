import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/services/audit';
import { getServerSession } from 'next-auth';

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

    const searchParams = request.nextUrl.searchParams;
    const filters = {
      entityType: searchParams.get('entityType') || undefined,
      action: searchParams.get('action') || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
    };

    const csv = await AuditService.exportAuditLogs(
      parseInt(params.organizationId),
      filters
    );

    // Log the export action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'EXPORT',
      entityType: 'audit_logs',
      entityId: 'all',
      details: {
        filters,
        exportType: 'csv',
      },
    });

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set(
      'Content-Disposition',
      'attachment; filename=audit_logs_export.csv'
    );

    return new NextResponse(csv, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export audit logs',
      },
      { status: 500 }
    );
  }
} 