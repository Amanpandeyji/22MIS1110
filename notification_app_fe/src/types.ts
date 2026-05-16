export interface Notification {
  id: string;
  type: 'Event' | 'Result' | 'Placement';
  message: string;
  title: string;
  priority: number;
  isRead: boolean;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

export interface NotificationStats {
  total: number;
  byType: Record<string, number>;
}
