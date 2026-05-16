import React from 'react';
import { Notification } from '../types';
import NotificationCard from './NotificationCard';
import { getPriorityColor, getPriorityLabel } from '../utils/helpers';
import styles from '../styles/PriorityInbox.module.css';

interface PriorityInboxProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onMarkAsRead?: (id: string) => void;
  maxItems?: number;
}

const PriorityInbox: React.FC<PriorityInboxProps> = ({
  notifications,
  loading,
  error,
  onMarkAsRead,
  maxItems = 10,
}) => {
  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading priority notifications: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading top notifications...</p>
      </div>
    );
  }

  const displayedNotifications = notifications.slice(0, maxItems);
  const priorityGroups = {
    4: displayedNotifications.filter((n) => n.priority === 4),
    3: displayedNotifications.filter((n) => n.priority === 3),
    2: displayedNotifications.filter((n) => n.priority === 2),
    1: displayedNotifications.filter((n) => n.priority === 1),
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Priority Inbox</h2>
        <span className={styles.count}>{notifications.length} important notifications</span>
      </div>

      {Object.entries(priorityGroups).map(([priority, items]) => {
        if (items.length === 0) return null;

        const priorityNum = parseInt(priority);
        const label = getPriorityLabel(priorityNum);
        const color = getPriorityColor(priorityNum);

        return (
          <div key={priority} className={styles.priorityGroup}>
            <div className={styles.groupHeader} style={{ backgroundColor: color }}>
              <h3>{label} Priority</h3>
              <span className={styles.count}>{items.length}</span>
            </div>

            <div className={styles.groupNotifications}>
              {items.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </div>
        );
      })}

      {displayedNotifications.length === 0 && (
        <div className={styles.empty}>
          <p>All caught up! No important notifications.</p>
        </div>
      )}
    </div>
  );
};

export default PriorityInbox;
