import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

// ===========================================
// REGISTER PAGE
// ===========================================

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your mood tracking journey today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
