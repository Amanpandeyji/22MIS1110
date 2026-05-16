import { DB_CONFIG } from './config';

interface Notification {
  id: string;
  studentId: string;
  type: string;
  title: string;
  message: string;
  priority: number;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface NotificationIndex {
  studentId_createdAt: string[];
  priority_studentId: string[];
  type_studentId: string[];
}

class Database {
  private notifications: Map<string, Notification> = new Map();
  private indexes: NotificationIndex = {
    studentId_createdAt: [],
    priority_studentId: [],
    type_studentId: [],
  };

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    console.log('Database initialized');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private updateIndexes(notification: Notification): void {
    const studentCreatedKey = `${notification.studentId}_${notification.createdAt}`;
    const priorityStudentKey = `${notification.priority}_${notification.studentId}`;
    const typeStudentKey = `${notification.type}_${notification.studentId}`;

    if (!this.indexes.studentId_createdAt.includes(studentCreatedKey)) {
      this.indexes.studentId_createdAt.push(studentCreatedKey);
    }
    if (!this.indexes.priority_studentId.includes(priorityStudentKey)) {
      this.indexes.priority_studentId.push(priorityStudentKey);
    }
    if (!this.indexes.type_studentId.includes(typeStudentKey)) {
      this.indexes.type_studentId.push(typeStudentKey);
    }
  }

  createNotification(data: {
    studentId: string;
    type: string;
    title: string;
    message: string;
    priority: number;
    metadata?: Record<string, unknown>;
  }): Notification {
    const notification: Notification = {
      id: this.generateId(),
      studentId: data.studentId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority,
      isRead: false,
      createdAt: new Date().toISOString(),
      metadata: data.metadata,
    };

    this.notifications.set(notification.id, notification);
    this.updateIndexes(notification);

    return notification;
  }

  getNotificationsByStudent(
    studentId: string,
    limit: number = 20,
    page: number = 1,
    notificationType?: string
  ): { notifications: Notification[]; total: number } {
    let filtered = Array.from(this.notifications.values()).filter(
      (n) => n.studentId === studentId
    );

    if (notificationType) {
      filtered = filtered.filter((n) => n.type === notificationType);
    }

    const sorted = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const offset = (page - 1) * limit;
    const paginated = sorted.slice(offset, offset + limit);

    return {
      notifications: paginated,
      total: sorted.length,
    };
  }

  getTopPriorityNotifications(studentId: string, limit: number = 10): Notification[] {
    return Array.from(this.notifications.values())
      .filter((n) => n.studentId === studentId && !n.isRead)
      .sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, limit);
  }

  markAsRead(notificationId: string): Notification | null {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.isRead = true;
      return notification;
    }
    return null;
  }

  getNotificationById(notificationId: string): Notification | null {
    return this.notifications.get(notificationId) || null;
  }

  getAllNotifications(): Notification[] {
    return Array.from(this.notifications.values());
  }

  getNotificationCountByType(studentId: string): Record<string, number> {
    const counts: Record<string, number> = {};

    Array.from(this.notifications.values())
      .filter((n) => n.studentId === studentId)
      .forEach((n) => {
        counts[n.type] = (counts[n.type] || 0) + 1;
      });

    return counts;
  }
}

export default new Database();
