import database from './database';
import emailService from './email-service';
import priorityAlgorithm from './priority-algorithm';
import { NOTIFICATION_TYPES } from './config';

class Logger {
  private stack: string;
  private logPackage: string;

  constructor(stack: string, logPackage: string) {
    this.stack = stack;
    this.logPackage = logPackage;
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    console.log('[DEBUG]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'debug', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    console.log('[INFO]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'info', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn('[WARN]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'warn', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    console.error('[ERROR]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'error', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    console.error('[FATAL]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'fatal', stack: this.stack, package: this.logPackage, message, metadata }));
  }
}

const logger = new Logger('backend', 'notification-service');

interface CreateNotificationRequest {
  studentId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface SendNotificationRequest {
  studentIds: string[];
  type: string;
  title: string;
  message: string;
  emails?: string[];
  metadata?: Record<string, unknown>;
}

class NotificationService {
  async createNotification(request: CreateNotificationRequest) {
    try {
      const priority = priorityAlgorithm.calculatePriority({
        type: request.type,
        message: request.message,
        createdAt: new Date().toISOString(),
        isRead: false,
      });

      const notification = database.createNotification({
        studentId: request.studentId,
        type: request.type,
        title: request.title,
        message: request.message,
        priority,
        metadata: request.metadata,
      });

      logger.info('Notification created', {
        notificationId: notification.id,
        studentId: request.studentId,
        priority,
      });

      return notification;
    } catch (error) {
      logger.error('Failed to create notification', {
        studentId: request.studentId,
        error: String(error),
      });
      throw error;
    }
  }

  async sendToMultipleStudents(request: SendNotificationRequest) {
    try {
      const notifications: any[] = [];

      for (const studentId of request.studentIds) {
        const notification = await this.createNotification({
          studentId,
          type: request.type,
          title: request.title,
          message: request.message,
          metadata: request.metadata,
        });
        notifications.push(notification);
      }

      let emailResults = null;
      if (request.emails && request.emails.length > 0) {
        emailResults = await emailService.notifyAllStudents(
          request.emails,
          request.title,
          request.message
        );

        logger.info('Batch emails sent', {
          totalStudents: request.studentIds.length,
          emailResults,
        });
      }

      return {
        notificationsCreated: notifications.length,
        emailResults,
      };
    } catch (error) {
      logger.error('Failed to send notifications to multiple students', {
        studentCount: request.studentIds.length,
        error: String(error),
      });
      throw error;
    }
  }

  async getStudentNotifications(studentId: string, limit: number = 20, page: number = 1) {
    try {
      const result = database.getNotificationsByStudent(studentId, limit, page);

      logger.info('Retrieved student notifications', {
        studentId,
        count: result.notifications.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      logger.error('Failed to retrieve notifications', {
        studentId,
        error: String(error),
      });
      throw error;
    }
  }

  async getStudentNotificationsByType(
    studentId: string,
    type: string,
    limit: number = 20,
    page: number = 1
  ) {
    try {
      const result = database.getNotificationsByStudent(studentId, limit, page, type);

      logger.info('Retrieved notifications by type', {
        studentId,
        type,
        count: result.notifications.length,
      });

      return result;
    } catch (error) {
      logger.error('Failed to retrieve notifications by type', {
        studentId,
        type,
        error: String(error),
      });
      throw error;
    }
  }

  async getTopPriorityNotifications(studentId: string, limit: number = 10) {
    try {
      const notifications = database.getTopPriorityNotifications(studentId, limit);

      logger.info('Retrieved top priority notifications', {
        studentId,
        count: notifications.length,
      });

      return notifications;
    } catch (error) {
      logger.error('Failed to retrieve top priority notifications', {
        studentId,
        error: String(error),
      });
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const notification = database.markAsRead(notificationId);

      if (notification) {
        logger.info('Notification marked as read', {
          notificationId,
        });
      }

      return notification;
    } catch (error) {
      logger.error('Failed to mark notification as read', {
        notificationId,
        error: String(error),
      });
      throw error;
    }
  }

  async getNotificationStats(studentId: string) {
    try {
      const counts = database.getNotificationCountByType(studentId);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      return {
        total,
        byType: counts,
      };
    } catch (error) {
      logger.error('Failed to get notification stats', {
        studentId,
        error: String(error),
      });
      throw error;
    }
  }
}

export default new NotificationService();
