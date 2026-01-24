import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import {
  HeroSection,
  TodayMoodCard,
  AverageMoodCard,
  AverageSleepCard,
  TrendChart,
} from '../components/dashboard';
import { useMoodData } from '../hooks';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const { todayEntry, entries, averages, isLoading } = useMoodData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogMood = () => {
    setIsModalOpen(true);
    // Modal component will be added later
    console.log('Open mood logger modal');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading your mood data...</p>
        </div>
      </DashboardLayout>
    );
  }

  const hasTodayEntry = todayEntry !== null;

  return (
    <DashboardLayout>
      <HeroSection hasTodayEntry={hasTodayEntry} onLogMood={handleLogMood} />

      {/* Today's Mood Card - shown when mood is logged */}
      {hasTodayEntry && todayEntry && (
        <section className={styles.todaySection}>
          <TodayMoodCard entry={todayEntry} />
        </section>
      )}

      {/* Main content grid */}
      <div className={styles.grid}>
        {/* Left column - Averages */}
        <aside className={styles.sidebar}>
          <AverageMoodCard averages={averages} />
          <AverageSleepCard averages={averages} />
        </aside>

        {/* Right column - Trend Chart */}
        <section className={styles.chartSection}>
          <TrendChart entries={entries} />
        </section>
      </div>

      {/* Mood Logger Modal - will be added later */}
      {isModalOpen && (
        <div className={styles.modalPlaceholder}>
          <p>Mood Logger Modal (design pending)</p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </DashboardLayout>
  );
}
