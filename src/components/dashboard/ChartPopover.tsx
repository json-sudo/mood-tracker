import type { MoodEntry } from '../../types';
import { getMoodIcon, getMoodLabel, formatSleepHours, iconSleep } from '../../utils';
import styles from './ChartPopover.module.scss';

interface ChartPopoverProps {
  entry: MoodEntry;
  position: { x: number; y: number };
  onClose: () => void;
}

export function ChartPopover({ entry, position, onClose }: ChartPopoverProps) {
  const date = new Date(entry.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div
        className={styles.popover}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        data-mood={entry.mood}
      >
        <div className={styles.header}>
          <img 
            src={getMoodIcon(entry.mood)} 
            alt={getMoodLabel(entry.mood)}
            className={styles.moodIcon}
          />
          <div className={styles.headerInfo}>
            <span className={styles.moodLabel}>{getMoodLabel(entry.mood)}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <img src={iconSleep} alt="" className={styles.detailIcon} />
            <span className={styles.detailText}>
              {formatSleepHours(entry.sleep_hours)}
            </span>
          </div>

          {entry.reflection && (
            <p className={styles.reflection}>
              {entry.reflection.length > 80
                ? `${entry.reflection.slice(0, 80)}...`
                : entry.reflection}
            </p>
          )}

          {entry.feelings.length > 0 && (
            <div className={styles.feelings}>
              {entry.feelings.slice(0, 4).map((feeling) => (
                <span key={feeling} className={styles.feelingTag}>
                  #{feeling}
                </span>
              ))}
              {entry.feelings.length > 4 && (
                <span className={styles.moreTag}>
                  +{entry.feelings.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
