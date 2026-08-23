import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/ui/Spinner';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader message="Vérification de votre session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(roles)) {
    const home =
      user?.role === 'STUDENT' ? '/student/dashboard' :
      user?.role === 'COMPANY' ? '/company/dashboard' :
      user?.role === 'ADMIN' ? '/admin/dashboard' : '/';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
