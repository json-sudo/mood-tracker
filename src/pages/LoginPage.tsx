import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

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
