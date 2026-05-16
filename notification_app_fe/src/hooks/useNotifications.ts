import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationResponse } from '../types';
import notificationAPI from '../utils/api';

export const useNotifications = (studentId: string, limit: number = 20) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(
    async (currentPage: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const result = await notificationAPI.getNotifications(studentId, limit, currentPage);

        if (currentPage === 1) {
          setNotifications(result.notifications);
        } else {
          setNotifications((prev) => [...prev, ...result.notifications]);
        }

        setTotal(result.total);
        setPage(currentPage);
        setHasMore(result.notifications.length === limit);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    },
    [studentId, limit]
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [studentId, fetchNotifications]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1);
    }
  }, [hasMore, loading, page, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const updated = await notificationAPI.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? updated : n))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark as read');
      }
    },
    []
  );

  return {
    notifications,
    loading,
    error,
    total,
    hasMore,
    page,
    loadMore,
    markAsRead,
    refresh: () => fetchNotifications(1),
  };
};

export const usePriorityNotifications = (studentId: string, limit: number = 10) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await notificationAPI.getTopPriorityNotifications(studentId, limit);
      setNotifications(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top notifications');
    } finally {
      setLoading(false);
    }
  }, [studentId, limit]);

  useEffect(() => {
    fetchTopNotifications();
  }, [studentId, fetchTopNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const updated = await notificationAPI.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? updated : n))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark as read');
      }
    },
    []
  );

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refresh: fetchTopNotifications,
  };
};

export const useNotificationStats = (studentId: string) => {
  const [stats, setStats] = useState({ total: 0, byType: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await notificationAPI.getNotificationStats(studentId);
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStats();
  }, [studentId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};
