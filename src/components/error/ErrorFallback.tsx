import styles from './ErrorFallback.module.scss';

export interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  variant?: 'page' | 'section';
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  resetError,
  variant = 'page',
  title,
  message,
}: ErrorFallbackProps) {
  const isPage = variant === 'page';
  
  const defaultTitle = isPage 
    ? 'Something went wrong' 
    : 'Failed to load';
    
  const defaultMessage = isPage
    ? "We're sorry, but something unexpected happened. Please try refreshing the page."
    : 'This section encountered an error.';

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      handleRefresh();
    }
  };

  return (
    <div className={`${styles.container} ${styles[variant]}`} role="alert">
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg 
            className={styles.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className={styles.title}>{title || defaultTitle}</h1>
        <p className={styles.message}>{message || defaultMessage}</p>

        {import.meta.env.DEV && (
          <details className={styles.details}>
            <summary>Error Details</summary>
            <pre className={styles.errorText}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className={styles.actions}>
          <button onClick={handleReset} className={styles.primaryButton}>
            {resetError ? 'Try Again' : 'Refresh Page'}
          </button>
          {isPage && (
            <button 
              onClick={() => window.location.href = '/'} 
              className={styles.secondaryButton}
            >
              Go to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
