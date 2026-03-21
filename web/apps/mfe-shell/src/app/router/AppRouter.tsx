import React, { Suspense, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store.hooks";
import { isPermitAllMode } from "../auth/auth-config";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { PERMISSIONS } from "../../features/auth/lib/permissions.constants";
import {
  isEthicRemoteEnabled,
  isSuggestionsRemoteEnabled,
  resolveDefaultShellPath,
} from "../shell-navigation";
import { useShellCommonI18n } from "../i18n";
import {
  SuggestionsApp,
  EthicApp,
  AccessModule,
  AuditModule,
  UsersModule,
  ReportingModule,
} from "./lazy-routes";

/* ---- Page imports ---- */
import { LoginPage } from "../../pages/login";
import { RegisterPage } from "../../pages/register";
import { UnauthorizedPage } from "../../pages/unauthorized";
import ThemeMatrixPage from "../../pages/runtime/ThemeMatrixPage";
import ThemeAdminPage from "../../pages/admin/ThemeAdminPage";
import DesignLabPage from "../../pages/admin/DesignLabPage";
import { DesignLabRoutes } from "../../pages/admin/design-lab/DesignLabRoutes";

const XSuiteDashboardPage = React.lazy(
  () => import("../../pages/admin/XSuiteDashboardPage"),
);

/* ------------------------------------------------------------------ */
/*  AppRouter — All application routes                                 */
/* ------------------------------------------------------------------ */

const AuthTraceRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Dev-only auth state logging
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  const { t } = useShellCommonI18n();
  const authState = useAppSelector((state) => state.auth);
  const { token, initialized } = authState;
  const permitAllMode = isPermitAllMode();
  const suggestionsEnabled = isSuggestionsRemoteEnabled();
  const ethicEnabled = isEthicRemoteEnabled();

  const defaultShellPath = useMemo(
    () =>
      resolveDefaultShellPath({
        permitAllMode,
        permissions: authState.user?.permissions ?? [],
      }),
    [authState.user?.permissions, permitAllMode],
  );

  return (
    <Suspense fallback={<div>{t("shell.header.suspenseLoading")}</div>}>
      <Routes>
        <Route
          path="/suggestions"
          element={
            suggestionsEnabled ? (
              <ProtectedRoute>
                <SuggestionsApp />
              </ProtectedRoute>
            ) : (
              <Navigate to={defaultShellPath} replace />
            )
          }
        />
        <Route
          path="/ethic"
          element={
            ethicEnabled ? (
              <ProtectedRoute>
                <EthicApp />
              </ProtectedRoute>
            ) : (
              <Navigate to={defaultShellPath} replace />
            )
          }
        />
        <Route
          path="/access/roles"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.ACCESS_MODULE]}>
              <AccessModule />
            </ProtectedRoute>
          }
        />
        <Route path="/access" element={<Navigate to="/access/roles" replace />} />
        <Route
          path="/audit/events"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.AUDIT_MODULE]}>
              <AuditModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports/*"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.REPORTING_MODULE]}>
              <ReportingModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={<Navigate to="/admin/reports/users" replace />}
        />
        <Route path="/reports/*" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/reports" element={<Navigate to="/admin/reports/users" replace />} />
        <Route
          path="/admin/users"
          element={
            <AuthTraceRoute>
              <ProtectedRoute
                requiredPermissions={[PERMISSIONS.USER_MANAGEMENT_MODULE]}
              >
                <UsersModule />
              </ProtectedRoute>
            </AuthTraceRoute>
          }
        />
        <Route
          path="/admin/themes"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
              <ThemeAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/design-lab/*"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
              <DesignLabRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/design-lab-legacy"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
              <DesignLabPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/x-suite-dashboard"
          element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
              <XSuiteDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/runtime/theme-matrix" element={<ThemeMatrixPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/"
          element={
            !initialized && !permitAllMode ? (
              <div className="px-6 py-10 text-sm font-medium text-text-secondary">
                {t("auth.session.validating")}
              </div>
            ) : (
              <Navigate
                to={token || permitAllMode ? defaultShellPath : "/login"}
                replace
              />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
