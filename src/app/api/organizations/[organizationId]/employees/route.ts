import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { AuditService } from '@/services/audit';
import { eq, and, like, between, or } from 'drizzle-orm';
import { z } from 'zod';

const employeeSchema = z.object({
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
  salary: z.number().min(0),
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

    const searchParams = request.nextUrl.searchParams;
    let query = db
      .select()
      .from(employees)
      .where(eq(employees.organizationId, parseInt(params.organizationId)));

    // Apply filters
    if (searchParams.has('search')) {
      const search = `%${searchParams.get('search')}%`;
      query = query.where(
        or(
          like(employees.firstName, search),
          like(employees.lastName, search),
          like(employees.employeeId, search)
        )
      );
    }

    if (searchParams.has('department')) {
      query = query.where(eq(employees.department, searchParams.get('department')!));
    }

    if (searchParams.has('status')) {
      query = query.where(eq(employees.status, searchParams.get('status')! as any));
    }

    if (searchParams.has('startDate') && searchParams.has('endDate')) {
      query = query.where(
        between(
          employees.startDate,
          new Date(searchParams.get('startDate')!),
          new Date(searchParams.get('endDate')!)
        )
      );
    }

    if (searchParams.has('minSalary') && searchParams.has('maxSalary')) {
      query = query.where(
        between(
          employees.salary,
          parseInt(searchParams.get('minSalary')!),
          parseInt(searchParams.get('maxSalary')!)
        )
      );
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch employees',
      },
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

    const body = await request.json();
    const validatedData = employeeSchema.parse(body);

    const [employee] = await db
      .insert(employees)
      .values({
        ...validatedData,
        organizationId: parseInt(params.organizationId),
        startDate: new Date(validatedData.startDate),
      })
      .returning();

    // Log the action
    await AuditService.logEmployeeAction({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'CREATE',
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
    console.error('Error creating employee:', error);
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
        error: 'Failed to create employee',
      },
      { status: 500 }
    );
  }
} 