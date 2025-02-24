import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { AuditService } from '@/lib/services/audit';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; documentId: string } }
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
    const documentId = parseInt(params.documentId);

    // Fetch document details
    const [document] = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.organizationId, organizationId),
          eq(documents.id, documentId)
        )
      );

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get file from S3
    const s3Response = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: document.path,
      })
    );

    const fileStream = s3Response.Body as ReadableStream;

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'DOWNLOAD',
      entityType: 'DOCUMENT',
      entityId: documentId,
      details: {
        name: document.name,
        type: document.type,
      },
    });

    return new NextResponse(fileStream, {
      headers: {
        'Content-Type': document.type,
        'Content-Disposition': `attachment; filename="${document.name}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; documentId: string } }
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
    const documentId = parseInt(params.documentId);

    // Fetch document details
    const [document] = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.organizationId, organizationId),
          eq(documents.id, documentId)
        )
      );

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: document.path,
      })
    );

    // Delete from database
    await db
      .delete(documents)
      .where(
        and(
          eq(documents.organizationId, organizationId),
          eq(documents.id, documentId)
        )
      );

    await AuditService.createLog({
      userId: session.user.id,
      organizationId,
      action: 'DELETE',
      entityType: 'DOCUMENT',
      entityId: documentId,
      details: {
        name: document.name,
        type: document.type,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 