import type { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';
import logo from '../../assets/images/logo.svg';

// ===========================================
// AUTH LAYOUT - Shared layout for login/register
// ===========================================

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src={logo} alt="Mood Tracker" className={styles.logo} />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
