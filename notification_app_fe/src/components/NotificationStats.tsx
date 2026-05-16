import React from 'react';
import { NotificationStats } from '../types';
import styles from '../styles/NotificationStats.module.css';

interface StatsDisplayProps {
  stats: NotificationStats;
  loading: boolean;
}

const NotificationStatsDisplay: React.FC<StatsDisplayProps> = ({ stats, loading }) => {
  if (loading) {
    return <div className={styles.container}>Loading stats...</div>;
  }

  const types = ['Event', 'Result', 'Placement'];

  return (
    <div className={styles.container}>
      <div className={styles.totalBox}>
        <h3>Total Notifications</h3>
        <p className={styles.totalCount}>{stats.total}</p>
      </div>

      <div className={styles.typeBoxes}>
        {types.map((type) => (
          <div key={type} className={styles.typeBox}>
            <h4>{type}</h4>
            <p className={styles.count}>{stats.byType[type] || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationStatsDisplay;
