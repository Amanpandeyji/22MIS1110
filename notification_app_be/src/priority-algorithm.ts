import { PRIORITY_LEVELS, NOTIFICATION_TYPES } from './config';

interface NotificationData {
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

class PriorityAlgorithm {
  private typeWeights: Record<string, number> = {
    [NOTIFICATION_TYPES.EVENT]: 1,
    [NOTIFICATION_TYPES.RESULT]: 3,
    [NOTIFICATION_TYPES.PLACEMENT]: 4,
  };

  private keywordWeights: Record<string, number> = {
    urgent: 2,
    immediate: 2,
    important: 1.5,
    critical: 3,
    failure: 2,
    passed: 0.5,
    rejected: 2,
    selected: 2.5,
    shortlisted: 2,
  };

  calculatePriority(notification: NotificationData): number {
    let priorityScore = 0;

    const typeScore = this.typeWeights[notification.type] || 1;
    priorityScore += typeScore * 1.5;

    const messageScore = this.calculateMessageScore(notification.message);
    priorityScore += messageScore;

    const recencyScore = this.calculateRecencyScore(notification.createdAt);
    priorityScore += recencyScore;

    if (!notification.isRead) {
      priorityScore += 1;
    }

    const finalPriority = Math.min(4, Math.max(1, Math.ceil(priorityScore)));

    return finalPriority;
  }

  private calculateMessageScore(message: string): number {
    let score = 1;
    const lowerMessage = message.toLowerCase();

    for (const [keyword, weight] of Object.entries(this.keywordWeights)) {
      if (lowerMessage.includes(keyword)) {
        score += weight;
      }
    }

    return score;
  }

  private calculateRecencyScore(createdAt: string): number {
    const createdDate = new Date(createdAt).getTime();
    const currentDate = new Date().getTime();
    const daysDiff = (currentDate - createdDate) / (1000 * 60 * 60 * 24);

    if (daysDiff < 1) return 2;
    if (daysDiff < 7) return 1;
    return 0;
  }

  sortByPriority(notifications: any[]): any[] {
    return notifications.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  filterByPriority(notifications: any[], minPriority: number): any[] {
    return notifications.filter((n) => n.priority >= minPriority);
  }

  getTopNotifications(notifications: any[], limit: number = 10): any[] {
    return this.sortByPriority(notifications).slice(0, limit);
  }

  groupByPriority(notifications: any[]): Record<number, any[]> {
    const grouped: Record<number, any[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    notifications.forEach((n) => {
      grouped[n.priority]?.push(n);
    });

    return grouped;
  }
}

export default new PriorityAlgorithm();
