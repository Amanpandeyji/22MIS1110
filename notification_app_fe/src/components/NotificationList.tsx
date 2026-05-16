import React, { useState } from 'react';
import { Notification } from '../types';
import NotificationCard from './NotificationCard';
import { sortNotificationsByPriority, groupNotificationsByType } from '../utils/helpers';
import styles from '../styles/NotificationList.module.css';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onMarkAsRead?: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  viewMode?: 'list' | 'grouped' | 'priority';
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  error,
  onMarkAsRead,
  onLoadMore,
  hasMore,
  viewMode = 'priority',
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading notifications: {error}</p>
      </div>
    );
  }

  if (loading && notifications.length === 0) {
    return (
      <div className={styles.loading}>
        <p>Loading notifications...</p>
      </div>
    );
  }

  let displayedNotifications = [...notifications];

  if (viewMode === 'priority') {
    displayedNotifications = sortNotificationsByPriority(displayedNotifications);
  }

  if (selectedType) {
    displayedNotifications = displayedNotifications.filter((n) => n.type === selectedType);
  }

  if (displayedNotifications.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No notifications found</p>
      </div>
    );
  }

  const typeFilters = Array.from(new Set(notifications.map((n) => n.type)));

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${selectedType === null ? styles.active : ''}`}
          onClick={() => setSelectedType(null)}
        >
          All ({notifications.length})
        </button>
        {typeFilters.map((type) => (
          <button
            key={type}
            className={`${styles.filterBtn} ${selectedType === type ? styles.active : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type} ({notifications.filter((n) => n.type === type).length})
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {displayedNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button onClick={onLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
