import type { MoodAverages } from '../../types';
import { getTrendIcon, getTrendDescription, iconSleep } from '../../utils';
import styles from './AverageCard.module.scss';

interface AverageSleepCardProps {
  averages: MoodAverages | null;
}

/**
 * Format average sleep hours to a range display (e.g., "5-6 Hours")
 */
function formatSleepRange(hours: number): string {
  if (hours >= 9) return '9+ Hours';
  if (hours >= 7) return '7-8 Hours';
  if (hours >= 5) return '5-6 Hours';
  if (hours >= 3) return '3-4 Hours';
  return `${Math.round(hours)} Hours`;
}

export function AverageSleepCard({ averages }: AverageSleepCardProps) {
  const hasEnoughData = averages && averages.entries_count >= 5;

  if (!hasEnoughData) {
    return (
      <article className={styles.card}>
        <header className={styles.header}>
          <h3 className={styles.title}>Average Sleep</h3>
          <span className={styles.subtitle}>(Last 5 Check-ins)</span>
        </header>
        <div className={styles.emptyState}>
          <h4 className={styles.emptyTitle}>Not enough data yet!</h4>
          <p className={styles.emptyText}>
            Track 5 nights to view average sleep.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Average Sleep</h3>
        <span className={styles.subtitle}>(Last 5 Check-ins)</span>
      </header>

      <div className={styles.content}>
        <div className={styles.valueRow}>
          <img 
            src={iconSleep} 
            alt="Sleep"
            className={styles.sleepIcon}
          />
          <span className={styles.sleepValue}>
            {formatSleepRange(averages.current_sleep_avg)}
          </span>
        </div>

        <div className={styles.trendRow}>
          <img 
            src={getTrendIcon(averages.sleep_trend)} 
            alt={averages.sleep_trend}
            className={styles.trendIcon}
          />
          <span className={styles.trendText}>
            {getTrendDescription(averages.sleep_trend, 'sleep')}
          </span>
        </div>
      </div>
    </article>
  );
}
