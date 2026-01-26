import type { MoodAverages, MoodLevel } from '../../types';
import { getMoodIcon, getMoodLabel, getTrendIcon, getTrendDescription } from '../../utils';
import styles from './AverageCard.module.scss';

interface AverageMoodCardProps {
  averages: MoodAverages | null;
}

export function AverageMoodCard({ averages }: AverageMoodCardProps) {
  const hasEnoughData = averages && averages.entries_count >= 5;

  const getMoodLevelFromAvg = (avg: number): MoodLevel => {
    return Math.round(avg) as MoodLevel;
  };

  if (!hasEnoughData) {
    return (
      <article className={styles.card}>
        <header className={styles.header}>
          <h3 className={styles.title}>Average Mood</h3>
          <span className={styles.subtitle}>(Last 5 Check-ins)</span>
        </header>
        <div className={styles.emptyState}>
          <h4 className={styles.emptyTitle}>Keep tracking!</h4>
          <p className={styles.emptyText}>
            Log 5 check-ins to see your average mood.
          </p>
        </div>
      </article>
    );
  }

  const moodLevel = getMoodLevelFromAvg(averages.current_mood_avg);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Average Mood</h3>
        <span className={styles.subtitle}>(Last 5 Check-ins)</span>
      </header>

      <div className={styles.content}>
        <div className={styles.valueRow}>
          <img 
            src={getMoodIcon(moodLevel)} 
            alt={getMoodLabel(moodLevel)}
            className={styles.moodIcon}
          />
          <span className={styles.moodLabel}>{getMoodLabel(moodLevel)}</span>
        </div>

        <div className={styles.trendRow}>
          <img 
            src={getTrendIcon(averages.mood_trend)} 
            alt={averages.mood_trend}
            className={styles.trendIcon}
          />
          <span className={styles.trendText}>
            {getTrendDescription(averages.mood_trend, 'mood')}
          </span>
        </div>
      </div>
    </article>
  );
}
