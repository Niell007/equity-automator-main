import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth/next';
import { AuditService } from '@/services/audit';
import { eq } from 'drizzle-orm/expressions';
import Papa from 'papaparse';

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

    const employeeData = await db
      .select()
      .from(employees)
      .where(eq(employees.organizationId, parseInt(params.organizationId)));

    const csvData = employeeData.map((employee) => ({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      gender: employee.gender,
      ethnicity: employee.ethnicity,
      position: employee.position,
      department: employee.department,
      startDate: employee.startDate.toISOString(),
      status: employee.status,
      salary: employee.salary,
    }));

    const csv = Papa.unparse(csvData);

    // Log the export action
    await AuditService.logEmployeeAction({
      userId: session.user.id, // Use the user's ID instead of email
      organizationId: parseInt(params.organizationId),
      action: 'EXPORT',
      entityId: 'BULK',
      details: {
        count: csvData.length,
      },
    });

    // Create response with CSV file
    const response = new NextResponse(csv);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="employees-${new Date().toISOString().split('T')[0]}.csv"`
    );

    return response;
  } catch (error) {
    console.error('Error exporting employees:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export employees',
      },
      { status: 500 }
    );
  }
} 