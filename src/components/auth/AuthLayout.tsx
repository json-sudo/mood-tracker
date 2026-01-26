import type { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';
import logo from '../../assets/images/logo.svg';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <img src={logo} alt="Mood Tracker" className={styles.logo} />
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
