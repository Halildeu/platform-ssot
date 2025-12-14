import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../../../../packages/ui-kit/src/lib/error/ErrorBoundary';

// Remote components via Module Federation
const AccessApp = React.lazy(() => import('mfe_access/AccessApp'));
const UsersApp = React.lazy(() => import('mfe_users/UsersApp'));
const ReportingApp = React.lazy(() => import('mfe_reporting/ReportApp'));

export function ShellRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/access/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<div>Yükleniyor…</div>}>
                <AccessApp />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/users/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<div>Yükleniyor…</div>}>
                <UsersApp />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/reporting/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<div>Yükleniyor…</div>}>
                <ReportingApp />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="*" element={<div>Sayfa bulunamadı</div>} />
      </Routes>
    </BrowserRouter>
  );
}

