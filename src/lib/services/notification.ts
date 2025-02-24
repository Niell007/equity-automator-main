import { db } from '@/lib/db';
import { notifications, type NewNotification } from '@/lib/db/schema';

export class NotificationService {
  static async createNotification(data: Omit<NewNotification, 'createdAt' | 'updatedAt' | 'isRead'>) {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...data,
        isRead: false,
      })
      .returning();

    return notification;
  }

  static async createBatchNotifications(
    data: Array<Omit<NewNotification, 'createdAt' | 'updatedAt' | 'isRead'>>
  ) {
    const notificationList = await db
      .insert(notifications)
      .values(
        data.map((item) => ({
          ...item,
          isRead: false,
        }))
      )
      .returning();

    return notificationList;
  }

  static async sendComplianceAlert({
    organizationId,
    userIds,
    title,
    message,
    link,
  }: {
    organizationId: number;
    userIds: number[];
    title: string;
    message: string;
    link?: string;
  }) {
    const notifications = await this.createBatchNotifications(
      userIds.map((userId) => ({
        organizationId,
        userId,
        type: 'WARNING',
        title,
        message,
        link,
      }))
    );

    return notifications;
  }

  static async sendReportNotification({
    organizationId,
    userIds,
    reportId,
    status,
  }: {
    organizationId: number;
    userIds: number[];
    reportId: number;
    status: 'COMPLETED' | 'FAILED';
  }) {
    const title = status === 'COMPLETED' 
      ? 'Report Generation Complete'
      : 'Report Generation Failed';
    
    const message = status === 'COMPLETED'
      ? 'Your compliance report is ready for download.'
      : 'There was an error generating your compliance report.';

    const type = status === 'COMPLETED' ? 'SUCCESS' : 'ERROR';
    const link = status === 'COMPLETED' ? `/reports/${reportId}` : undefined;

    const notifications = await this.createBatchNotifications(
      userIds.map((userId) => ({
        organizationId,
        userId,
        type,
        title,
        message,
        link,
      }))
    );

    return notifications;
  }

  static async sendDocumentNotification({
    organizationId,
    userIds,
    documentId,
    action,
  }: {
    organizationId: number;
    userIds: number[];
    documentId: number;
    action: 'UPLOADED' | 'DELETED' | 'UPDATED';
  }) {
    const title = `Document ${action.toLowerCase()}`;
    const message = `A document has been ${action.toLowerCase()} in your organization.`;
    const link = action !== 'DELETED' ? `/documents/${documentId}` : undefined;

    const notifications = await this.createBatchNotifications(
      userIds.map((userId) => ({
        organizationId,
        userId,
        type: 'INFO',
        title,
        message,
        link,
      }))
    );

    return notifications;
  }
} 