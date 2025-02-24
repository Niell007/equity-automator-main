import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { departments } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { AuditService } from '@/services/audit';
import { eq, and, like, isNull } from 'drizzle-orm';
import { z } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
  description: z.string().optional(),
  managerId: z.number().optional(),
  parentDepartmentId: z.number().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
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
      .where(eq(departments.organizationId, parseInt(params.organizationId)));

    // Apply filters
    if (searchParams.has('search')) {
      const search = `%${searchParams.get('search')}%`;
      query = query.where(
        or(
          like(departments.name, search),
          like(departments.code, search)
        )
      );
    }

    if (searchParams.has('status')) {
      query = query.where(eq(departments.status, searchParams.get('status')! as any));
    }

    // Filter by parent department
    if (searchParams.has('parentDepartmentId')) {
      const parentId = searchParams.get('parentDepartmentId');
      if (parentId === 'null') {
        query = query.where(isNull(departments.parentDepartmentId));
      } else {
        query = query.where(eq(departments.parentDepartmentId, parseInt(parentId!)));
      }
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch departments',
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
    const validatedData = departmentSchema.parse(body);

    // Check if department code is unique within the organization
    const existingDepartment = await db
      .select({ id: departments.id })
      .from(departments)
      .where(
        and(
          eq(departments.organizationId, parseInt(params.organizationId)),
          eq(departments.code, validatedData.code)
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

    const [department] = await db
      .insert(departments)
      .values({
        ...validatedData,
        organizationId: parseInt(params.organizationId),
      })
      .returning();

    // Log the action
    await AuditService.createLog({
      userId: session.user.id,
      organizationId: parseInt(params.organizationId),
      action: 'CREATE',
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
    console.error('Error creating department:', error);
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
        error: 'Failed to create department',
      },
      { status: 500 }
    );
  }
} 