import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.scss';

// ===========================================
// DASHBOARD PAGE (Placeholder)
// ===========================================

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Mood Tracker</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.placeholder}>
          <h2>Dashboard coming soon...</h2>
          <p>The mood tracking components will be built in the next phase.</p>
        </div>
      </main>
    </div>
  );
}
