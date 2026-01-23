import { useAuth } from '../../context/AuthContext';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  hasTodayEntry: boolean;
  onLogMood: () => void;
}

export function HeroSection({ hasTodayEntry, onLogMood }: HeroSectionProps) {
  const { user } = useAuth();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Add ordinal suffix (1st, 2nd, 3rd, etc.)
  const day = today.getDate();
  const ordinal = getOrdinalSuffix(day);
  const dateWithOrdinal = formattedDate.replace(String(day), `${day}${ordinal}`);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <section className={styles.hero}>
      <p className={styles.greeting}>Hello, {firstName}!</p>
      <h1 className={styles.question}>How are you feeling today?</h1>
      <p className={styles.date}>{dateWithOrdinal}</p>

      {!hasTodayEntry && (
        <button className={styles.logButton} onClick={onLogMood}>
          Log today's mood
        </button>
      )}
    </section>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
