import axios, { AxiosInstance } from 'axios';
import { Notification, NotificationResponse, NotificationStats } from '../types';

class NotificationAPI {
  private client: AxiosInstance;
  private baseURL = 'http://localhost:3000/api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getNotifications(
    studentId: string,
    limit: number = 20,
    page: number = 1,
    type?: string
  ): Promise<NotificationResponse> {
    const response = await this.client.get<NotificationResponse>('/notifications', {
      params: {
        studentId,
        limit,
        page,
        notificationType: type,
      },
    });
    return response.data;
  }

  async getTopPriorityNotifications(studentId: string, limit: number = 10): Promise<Notification[]> {
    const response = await this.client.get<{ notifications: Notification[] }>(
      '/notifications/priority',
      {
        params: {
          studentId,
          limit,
        },
      }
    );
    return response.data.notifications;
  }

  async getNotificationStats(studentId: string): Promise<NotificationStats> {
    const response = await this.client.get<NotificationStats>('/notifications/stats', {
      params: {
        studentId,
      },
    });
    return response.data;
  }

  async createNotification(data: {
    studentId: string;
    type: string;
    title: string;
    message: string;
  }): Promise<Notification> {
    const response = await this.client.post<Notification>('/notifications', data);
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await this.client.put<Notification>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  }

  async sendBatchNotifications(data: {
    studentIds: string[];
    type: string;
    title: string;
    message: string;
    emails?: string[];
  }): Promise<{ notificationsCreated: number; emailResults: any }> {
    const response = await this.client.post('/notifications/batch', data);
    return response.data;
  }
}

export default new NotificationAPI();
