import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

// ===========================================
// LOGIN PAGE
// ===========================================

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Log in to continue tracking your mood and sleep"
    >
      <LoginForm />
    </AuthLayout>
  );
}
