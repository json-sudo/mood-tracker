import { useMemo } from 'react';
import type { MoodEntry } from '../../types';
import { 
  getMoodIcon, 
  getMoodLabel, 
  getMoodQuote, 
  formatSleepHours,
  iconQuote,
  iconSleep,
  iconReflection,
} from '../../utils';
import styles from './TodayMoodCard.module.scss';

interface TodayMoodCardProps {
  entry: MoodEntry;
}

export function TodayMoodCard({ entry }: TodayMoodCardProps) {
  const quote = useMemo(() => getMoodQuote(entry.mood), [entry.mood]);

  return (
    <article className={styles.card}>
      <div className={styles.moodSection}>
        <span className={styles.moodPrefix}>I'm feeling</span>
        <h3 className={styles.moodLabel}>{getMoodLabel(entry.mood)}</h3>
        
        <img 
          src={getMoodIcon(entry.mood)} 
          alt={getMoodLabel(entry.mood)}
          className={styles.moodIcon}
        />
        
        <div className={styles.quoteSection}>
          <img src={iconQuote} alt="" className={styles.quoteIcon} />
          <p className={styles.quoteText}>{quote}</p>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailBlock}>
          <div className={styles.detailHeader}>
            <img src={iconSleep} alt="" className={styles.detailIcon} />
            <span className={styles.detailLabel}>Sleep</span>
          </div>
          <p className={styles.detailValue}>{formatSleepHours(entry.sleep_hours)}</p>
        </div>

        {entry.reflection && (
          <div className={styles.detailBlock}>
            <div className={styles.detailHeader}>
              <img src={iconReflection} alt="" className={styles.detailIcon} />
              <span className={styles.detailLabel}>Reflection of the day</span>
            </div>
            <p className={styles.reflectionText}>{entry.reflection}</p>
          </div>
        )}

        {entry.feelings.length > 0 && (
          <div className={styles.feelings}>
            {entry.feelings.map((feeling) => (
              <span key={feeling} className={styles.feelingTag}>
                #{feeling}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
