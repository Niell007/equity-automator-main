import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

interface AuditLogParams {
  userId: number;
  organizationId: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'SUBMIT' | 'APPROVE' | 'REJECT';
  entityType: string;
  entityId: string;
  details: string | object;
}

export class AuditService {
  private static async createLog(params: AuditLogParams) {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || '';

    try {
      await db.insert(auditLogs).values({
        ...params,
        details: typeof params.details === 'string' 
          ? params.details 
          : JSON.stringify(params.details),
        ipAddress: ipAddress.split(',')[0],
        userAgent,
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw - audit logging should not break main functionality
    }
  }

  public static async logEmployeeAction(
    params: Omit<AuditLogParams, 'entityType'> & { 
      changes?: Record<string, any> 
    }
  ) {
    await this.createLog({
      ...params,
      entityType: 'employee',
      details: params.changes || params.details,
    });
  }

  public static async logReportAction(
    params: Omit<AuditLogParams, 'entityType'> & {
      reportType?: string;
      status?: string;
    }
  ) {
    await this.createLog({
      ...params,
      entityType: 'report',
      details: {
        ...params.details,
        reportType: params.reportType,
        status: params.status,
      },
    });
  }

  public static async logDocumentAction(
    params: Omit<AuditLogParams, 'entityType'> & {
      documentType: string;
      fileName: string;
    }
  ) {
    await this.createLog({
      ...params,
      entityType: 'document',
      details: {
        ...params.details,
        documentType: params.documentType,
        fileName: params.fileName,
      },
    });
  }

  public static async logSettingsChange(
    params: Omit<AuditLogParams, 'entityType'> & {
      setting: string;
      oldValue?: any;
      newValue?: any;
    }
  ) {
    await this.createLog({
      ...params,
      entityType: 'settings',
      details: {
        setting: params.setting,
        oldValue: params.oldValue,
        newValue: params.newValue,
        ...params.details,
      },
    });
  }

  public static async getAuditLogs(
    organizationId: number,
    filters?: {
      entityType?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
      userId?: number;
    }
  ) {
    try {
      let query = db
        .select()
        .from(auditLogs)
        .where('organization_id = ?', [organizationId])
        .orderBy('created_at DESC');

      if (filters?.entityType) {
        query = query.where('entity_type = ?', [filters.entityType]);
      }
      if (filters?.action) {
        query = query.where('action = ?', [filters.action]);
      }
      if (filters?.userId) {
        query = query.where('user_id = ?', [filters.userId]);
      }
      if (filters?.startDate) {
        query = query.where('created_at >= ?', [filters.startDate]);
      }
      if (filters?.endDate) {
        query = query.where('created_at <= ?', [filters.endDate]);
      }

      return await query;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  public static async exportAuditLogs(
    organizationId: number,
    filters?: {
      entityType?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
      userId?: number;
    }
  ) {
    const logs = await this.getAuditLogs(organizationId, filters);
    
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'Details', 'IP Address'];
    const rows = logs.map(log => [
      new Date(log.createdAt).toISOString(),
      log.userId,
      log.action,
      log.entityType,
      log.entityId,
      log.details,
      log.ipAddress,
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
} 