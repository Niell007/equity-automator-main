import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    const documentList = await db
      .select()
      .from(documents)
      .where(eq(documents.organizationId, organizationId));

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'VIEW',
      entityType: 'DOCUMENTS',
      details: { count: documentList.length },
    });

    return NextResponse.json({ success: true, data: documentList });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds limit' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileKey = `${organizationId}/${uuidv4()}-${file.name}`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileKey,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
      })
    );

    // Create document record
    const [newDocument] = await db
      .insert(documents)
      .values({
        organizationId,
        name: file.name,
        type: file.type,
        size: file.size,
        path: fileKey,
        uploadedBy: session.user.id,
        status: 'ACTIVE',
      })
      .returning();

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'CREATE',
      entityType: 'DOCUMENT',
      entityId: newDocument.id,
      details: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ success: true, data: newDocument });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
} 