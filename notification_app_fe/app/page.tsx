'use client';

import React, { useState } from 'react';
import { useNotifications, usePriorityNotifications, useNotificationStats } from '../src/hooks/useNotifications';
import NotificationList from '../src/components/NotificationList';
import PriorityInbox from '../src/components/PriorityInbox';
import NotificationStatsDisplay from '../src/components/NotificationStats';

const STUDENT_ID = 'student-001';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'priority' | 'all' | 'stats'>('priority');
  
  const {
    notifications,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    markAsRead,
  } = useNotifications(STUDENT_ID, 20);

  const {
    notifications: topNotifications,
    loading: topLoading,
    error: topError,
    markAsRead: markTopAsRead,
    refresh: refreshTop,
  } = usePriorityNotifications(STUDENT_ID, 10);

  const {
    stats,
    loading: statsLoading,
  } = useNotificationStats(STUDENT_ID);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Notifications</h1>
          <p style={styles.subtitle}>Stay updated with your notifications</p>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'priority' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('priority')}
          >
            Priority Inbox
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'all' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('all')}
          >
            All Notifications ({total})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'stats' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'priority' && (
            <PriorityInbox
              notifications={topNotifications}
              loading={topLoading}
              error={topError}
              onMarkAsRead={markTopAsRead}
              maxItems={10}
            />
          )}

          {activeTab === 'all' && (
            <NotificationList
              notifications={notifications}
              loading={loading}
              error={error}
              onMarkAsRead={markAsRead}
              onLoadMore={loadMore}
              hasMore={hasMore}
              viewMode="priority"
            />
          )}

          {activeTab === 'stats' && (
            <NotificationStatsDisplay stats={stats} loading={statsLoading} />
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2026 Notification System - Full Stack Application</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '32px 20px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.9,
  },
  main: {
    flex: 1,
    padding: '24px 20px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
  },
  tab: {
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#667eea',
    borderBottomColor: '#667eea',
  },
  content: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
  },
  footer: {
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    padding: '20px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
    marginTop: 'auto',
  },
};
