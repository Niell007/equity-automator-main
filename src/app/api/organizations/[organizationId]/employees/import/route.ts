import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { AuditService } from '@/services/audit';
import { z } from 'zod';
import Papa from 'papaparse';

const employeeImportSchema = z.object({
  employeeId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  gender: z.string().min(1),
  ethnicity: z.string().min(1),
  position: z.string().min(1),
  department: z.string().min(1),
  startDate: z.string().datetime(),
  status: z.enum(['ACTIVE', 'TERMINATED', 'ON_LEAVE']),
  salary: z.string().transform((val) => parseFloat(val)),
});

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

    const validatedEmployees = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const validated = employeeImportSchema.parse(data[i]);
        validatedEmployees.push({
          ...validated,
          organizationId: parseInt(params.organizationId),
          startDate: new Date(validated.startDate),
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push({
            row: i + 2, // Adding 2 to account for 0-based index and header row
            errors: error.errors,
          });
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation errors in CSV file',
          details: errors,
        },
        { status: 400 }
      );
    }

    const importedEmployees = await db
      .insert(employees)
      .values(validatedEmployees)
      .returning();

    // Log the import action
    await AuditService.logEmployeeAction({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'IMPORT',
      entityId: 'BULK',
      details: {
        count: importedEmployees.length,
        fileName: file.name,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        imported: importedEmployees.length,
      },
    });
  } catch (error) {
    console.error('Error importing employees:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import employees',
      },
      { status: 500 }
    );
  }
} 