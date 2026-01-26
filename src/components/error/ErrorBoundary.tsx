import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorFallback, type ErrorFallbackProps } from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: { error: Error; resetError: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  variant?: ErrorFallbackProps['variant'];
  title?: string;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
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
      if (fallbackRender) {
        return fallbackRender({ error, resetError: this.resetError });
      }

      if (fallback) {
        return fallback;
      }

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
