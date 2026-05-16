import React from 'react';
import { Notification } from '../types';
import { getPriorityColor, getPriorityLabel, getTypeIcon, formatTimestamp } from '../utils/helpers';
import styles from '../styles/NotificationCard.module.css';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead }) => {
  const priorityColor = getPriorityColor(notification.priority);
  const priorityLabel = getPriorityLabel(notification.priority);
  const icon = getTypeIcon(notification.type);
  const timeAgo = formatTimestamp(notification.timestamp);

  return (
    <div
      className={`${styles.card} ${notification.isRead ? styles.read : styles.unread}`}
      style={{ borderLeftColor: priorityColor }}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{notification.title}</h3>
          <span className={styles.type}>{notification.type}</span>
        </div>
        <div className={styles.rightSection}>
          <span className={styles.priority} style={{ backgroundColor: priorityColor }}>
            {priorityLabel}
          </span>
          <span className={styles.time}>{timeAgo}</span>
        </div>
      </div>

      <div className={styles.message}>{notification.message}</div>

      {onMarkAsRead && (
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => onMarkAsRead(notification.id)}
            disabled={notification.isRead}
          >
            {notification.isRead ? 'Read' : 'Mark as read'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
