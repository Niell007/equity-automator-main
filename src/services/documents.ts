import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { AuditService } from './audit';
import { createHash } from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/jpeg',
  'image/png',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadParams {
  file: File;
  type: string;
  organizationId: number;
  userId: number;
}

export class DocumentService {
  private static generateKey(organizationId: number, fileName: string): string {
    const timestamp = Date.now();
    const hash = createHash('md5')
      .update(`${organizationId}-${fileName}-${timestamp}`)
      .digest('hex');
    return `organizations/${organizationId}/${hash}-${fileName}`;
  }

  private static validateFile(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds limit');
    }
  }

  public static async uploadDocument({
    file,
    type,
    organizationId,
    userId,
  }: UploadParams) {
    try {
      this.validateFile(file);

      const key = this.generateKey(organizationId, file.name);
      const buffer = await file.arrayBuffer();

      // Upload to S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: Buffer.from(buffer),
          ContentType: file.type,
          Metadata: {
            organizationId: organizationId.toString(),
            documentType: type,
          },
        })
      );

      // Create database record
      const [document] = await db
        .insert(documents)
        .values({
          organizationId,
          type,
          name: file.name,
          path: key,
          mimeType: file.type,
          size: file.size,
          uploadedBy: userId,
        })
        .returning();

      // Log the action
      await AuditService.logDocumentAction({
        userId,
        organizationId,
        action: 'CREATE',
        entityId: document.id.toString(),
        documentType: type,
        fileName: file.name,
        details: {
          size: file.size,
          mimeType: file.type,
        },
      });

      return document;
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw new Error('Failed to upload document');
    }
  }

  public static async getDocumentUrl(documentId: number, userId: number) {
    try {
      const [document] = await db
        .select()
        .from(documents)
        .where('id = ?', [documentId]);

      if (!document) {
        throw new Error('Document not found');
      }

      // Generate presigned URL
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: document.path,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      // Log the access
      await AuditService.logDocumentAction({
        userId,
        organizationId: document.organizationId,
        action: 'VIEW',
        entityId: documentId.toString(),
        documentType: document.type,
        fileName: document.name,
        details: {
          accessType: 'download',
        },
      });

      return url;
    } catch (error) {
      console.error('Failed to get document URL:', error);
      throw new Error('Failed to get document URL');
    }
  }

  public static async getOrganizationDocuments(
    organizationId: number,
    type?: string
  ) {
    try {
      let query = db
        .select()
        .from(documents)
        .where('organization_id = ?', [organizationId])
        .orderBy('created_at DESC');

      if (type) {
        query = query.where('type = ?', [type]);
      }

      return await query;
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  public static async deleteDocument(documentId: number, userId: number) {
    try {
      const [document] = await db
        .select()
        .from(documents)
        .where('id = ?', [documentId]);

      if (!document) {
        throw new Error('Document not found');
      }

      // Delete from S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: document.path,
        })
      );

      // Delete database record
      await db.delete(documents).where('id = ?', [documentId]);

      // Log the deletion
      await AuditService.logDocumentAction({
        userId,
        organizationId: document.organizationId,
        action: 'DELETE',
        entityId: documentId.toString(),
        documentType: document.type,
        fileName: document.name,
        details: {
          reason: 'User initiated deletion',
        },
      });
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw new Error('Failed to delete document');
    }
  }
} 