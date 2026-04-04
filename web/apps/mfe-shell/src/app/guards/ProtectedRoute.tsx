import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store.hooks';
import { useAuthorization } from '../../features/auth/model/use-authorization.model';
import { isPermitAllMode } from '../auth/auth-config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  requiredPermissions,
  fallbackPath = '/unauthorized',
}: ProtectedRouteProps) => {
  const { token, initialized } = useAppSelector((state) => state.auth);
  const { hasPermission } = useAuthorization();
  const location = useLocation();
  const permitAllMode = isPermitAllMode();

  // permitAll modunda da auth bootstrap'in tamamlanmasını bekliyoruz.
  // Aksi halde remote modüller fake oturum kurulmadan render olup yetkisiz
  // backend çağrılarıyla kilitlenebiliyor.
  if (!initialized) {
    return null;
  }

  if (permitAllMode) {
    return <>{children}</>;
  }

  const buildRedirectTarget = () => {
    const composed = `${location.pathname ?? ''}${location.search ?? ''}${location.hash ?? ''}`;
    return encodeURIComponent(composed || '/');
  };

  if (!token) {
    const redirect = buildRedirectTarget();
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  const canAccess = hasPermission(requiredPermissions);

  if (!canAccess) {
    return (
      <Navigate
        to={fallbackPath}
        replace
        state={{ from: location.pathname, reason: 'forbidden' }}
      />
    );
  }

  return <>{children}</>;
};
