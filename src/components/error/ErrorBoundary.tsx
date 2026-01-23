import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorFallback, type ErrorFallbackProps } from './ErrorFallback';

// ===========================================
// ERROR BOUNDARY - Catches React render errors
// ===========================================

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback component to render on error. Defaults to ErrorFallback */
  fallback?: ReactNode;
  /** Custom fallback render function for more control */
  fallbackRender?: (props: { error: Error; resetError: () => void }) => ReactNode;
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Variant passed to default ErrorFallback */
  variant?: ErrorFallbackProps['variant'];
  /** Custom title for default ErrorFallback */
  title?: string;
  /** Custom message for default ErrorFallback */
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error callback (useful for error reporting services)
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { 
      children, 
      fallback, 
      fallbackRender, 
      variant = 'page',
      title,
      message,
    } = this.props;

    if (hasError && error) {
      // Custom fallback render function takes priority
      if (fallbackRender) {
        return fallbackRender({ error, resetError: this.resetError });
      }

      // Static fallback element
      if (fallback) {
        return fallback;
      }

      // Default ErrorFallback component
      return (
        <ErrorFallback
          error={error}
          resetError={this.resetError}
          variant={variant}
          title={title}
          message={message}
        />
      );
    }

    return children;
  }
}
