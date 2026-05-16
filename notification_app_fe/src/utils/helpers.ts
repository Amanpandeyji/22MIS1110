import { Notification } from '../types';

export const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 4:
      return '#dc2626';
    case 3:
      return '#ea580c';
    case 2:
      return '#eab308';
    case 1:
    default:
      return '#3b82f6';
  }
};

export const getPriorityLabel = (priority: number): string => {
  switch (priority) {
    case 4:
      return 'Critical';
    case 3:
      return 'High';
    case 2:
      return 'Medium';
    case 1:
    default:
      return 'Low';
  }
};

export const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'Event':
      return '📅';
    case 'Result':
      return '📊';
    case 'Placement':
      return '💼';
    default:
      return '📬';
  }
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export const sortNotificationsByPriority = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const groupNotificationsByType = (
  notifications: Notification[]
): Record<string, Notification[]> => {
  const grouped: Record<string, Notification[]> = {};

  notifications.forEach((notification) => {
    if (!grouped[notification.type]) {
      grouped[notification.type] = [];
    }
    grouped[notification.type].push(notification);
  });

  return grouped;
};

export const filterNotificationsByPriority = (
  notifications: Notification[],
  minPriority: number
): Notification[] => {
  return notifications.filter((n) => n.priority >= minPriority);
};
