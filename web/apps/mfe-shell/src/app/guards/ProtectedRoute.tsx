import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store.hooks';
import { usePermissions, type ModuleKey } from '@mfe/auth';
import { isPermitAllMode } from '../auth/auth-config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: ModuleKey;
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  requiredModule,
  fallbackPath = '/unauthorized',
}: ProtectedRouteProps) => {
  const { token, initialized } = useAppSelector((state) => state.auth);
  const { hasModule, isSuperAdmin } = usePermissions();
  const location = useLocation();
  const permitAllMode = isPermitAllMode();

  if (!initialized) {
    return null;
  }

  if (permitAllMode) {
    return <>{children}</>;
  }

  if (!token) {
    const composed = `${location.pathname ?? ''}${location.search ?? ''}${location.hash ?? ''}`;
    const redirect = encodeURIComponent(composed || '/');
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  const canAccess = isSuperAdmin()
    || (requiredModule ? hasModule(requiredModule) : true);

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
