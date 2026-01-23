import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { HeroSection } from '../components/dashboard';
import { useMoodData } from '../hooks';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const { todayEntry, entries, averages, isLoading, refetch } = useMoodData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogMood = () => {
    setIsModalOpen(true);
    // Modal component will be added later
    console.log('Open mood logger modal');
  };

  const handleMoodLogged = async () => {
    setIsModalOpen(false);
    await refetch();
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
  const hasAnyEntries = entries.length > 0;

  return (
    <DashboardLayout>
      <HeroSection hasTodayEntry={hasTodayEntry} onLogMood={handleLogMood} />

      {/* Today's Mood Card - shown when mood is logged */}
      {hasTodayEntry && (
        <section className={styles.todaySection}>
          {/* TodayMoodCard component will go here */}
          <div className={styles.placeholder}>
            Today's Mood Card (to be built)
          </div>
        </section>
      )}

      {/* Main content grid */}
      <div className={styles.grid}>
        {/* Left column - Averages */}
        <aside className={styles.sidebar}>
          {/* AveragesCards component will go here */}
          <div className={styles.placeholder}>
            <p><strong>Average Mood</strong> (Last 5 Check-ins)</p>
            {averages && averages.entries_count >= 5 ? (
              <p>Mood: {averages.current_mood_avg.toFixed(1)}</p>
            ) : (
              <p>Keep tracking! Log 5 check-ins to see your average mood.</p>
            )}
          </div>
          <div className={styles.placeholder}>
            <p><strong>Average Sleep</strong> (Last 5 Check-ins)</p>
            {averages && averages.entries_count >= 5 ? (
              <p>Sleep: {averages.current_sleep_avg.toFixed(1)} hours</p>
            ) : (
              <p>Not enough data yet! Track 5 nights to view average sleep.</p>
            )}
          </div>
        </aside>

        {/* Right column - Trend Chart */}
        <section className={styles.chartSection}>
          {/* TrendChart component will go here */}
          <div className={styles.placeholder}>
            <h2>Mood and sleep trends</h2>
            {hasAnyEntries ? (
              <p>{entries.length} entries to display</p>
            ) : (
              <p>No data yet. Start tracking to see trends!</p>
            )}
          </div>
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
