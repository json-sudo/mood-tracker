import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join to track your daily mood and sleep with ease"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
