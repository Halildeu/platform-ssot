import React, { useEffect, useMemo, useCallback, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store.hooks";
import { useThemeContext } from "../theme/theme-context.provider";
import { useToast } from "@mfe/design-system";
import { isPermitAllMode } from "../auth/auth-config";
import {
  isSuggestionsRemoteEnabled,
  isEthicRemoteEnabled,
  resolveDefaultShellPath,
} from "../shell-navigation";
import { useShellCommonI18n } from "../i18n";
import { useShellShortcuts } from "../shortcuts/useShellShortcuts.model";
import { fetchProducts } from "../../features/products/model/products.slice";
import {
  pushNotification,
  toggleOpen,
} from "../../features/notifications/model/notifications.slice";
import { logout } from "../../features/auth/model/auth.slice";
import { Sidebar } from "./Sidebar";
import AuditSummaryStrip from "./AuditSummaryStrip";
import { ShellHeader } from "./ShellHeader";
import { RouteTracker } from "../router/RouteTracker";
import { AppRouter } from "../router/AppRouter";

/* ------------------------------------------------------------------ */
/*  ShellLayout — Main application layout with header, sidebar, routes */
/* ------------------------------------------------------------------ */

const ShellChrome: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const colors = currentTheme.colors;
  const authState = useAppSelector((state) => state.auth);
  const { token, initialized } = authState;
  const permitAllMode = isPermitAllMode();
  const showSidebar = Boolean(token) || permitAllMode;
  const location = useLocation();
  const showAuditSummary =
    initialized && location.pathname.startsWith("/audit");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
      }}
      className="flex min-h-screen flex-col"
    >
      {/* Fixed header — takes space via pt below */}
      <ShellHeader />
      {/* Push content below fixed header */}
      <div className="pt-[var(--shell-header-h,56px)]">
        {showAuditSummary ? <AuditSummaryStrip /> : null}
        {/* Fixed sidebar — rendered outside flow */}
        {showSidebar ? <Sidebar /> : null}
        <div className="flex min-h-0 flex-1">
          {/* Spacer matching fixed sidebar width */}
          {showSidebar ? <SidebarSpacer /> : null}
          <main className="min-w-0 flex-1 px-8 py-8">
          <div className="flex w-full flex-col gap-6">
            <AppRouter />
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export const ShellLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { token, expiresAt } = authState;
  const { t } = useShellCommonI18n();
  const {
    success: pushSuccessToast,
    info: pushInfoToast,
    warning: pushWarningToast,
    error: pushErrorToast,
  } = useToast();

  useShellShortcuts();

  /* Fetch initial data */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* Runtime toast handler (custom events from remote modules) */
  const pushRuntimeToast = useCallback(
    (
      type: "success" | "info" | "warning" | "error" | "loading",
      message: string,
    ) => {
      const duration = type === "loading" ? 0 : 4500;
      if (type === "success") { pushSuccessToast(message, { duration }); return; }
      if (type === "warning") { pushWarningToast(message, { duration }); return; }
      if (type === "error") { pushErrorToast(message, { duration }); return; }
      // "loading" falls through to info since toast API has no loading variant
      pushInfoToast(message, { duration });
    },
    [pushErrorToast, pushInfoToast, pushSuccessToast, pushWarningToast],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleToast = (event: Event) => {
      const detail = (
        event as CustomEvent<
          { type?: string; text?: string; open?: boolean } | undefined
        >
      ).detail;
      const message =
        typeof detail?.text === "string" ? detail.text.trim() : "";
      if (!message) return;
      const type =
        detail?.type === "success" ||
        detail?.type === "info" ||
        detail?.type === "warning" ||
        detail?.type === "error" ||
        detail?.type === "loading"
          ? detail.type
          : "info";
      dispatch(
        pushNotification({
          message,
          type,
          priority:
            detail?.open === true || type === "warning" || type === "error"
              ? "high"
              : "normal",
          meta: { source: "app:toast", open: detail?.open === true },
        }),
      );
      pushRuntimeToast(type, message);
      if (detail?.open === true) {
        dispatch(toggleOpen(true));
      }
    };
    window.addEventListener("app:toast", handleToast as EventListener);
    return () => {
      window.removeEventListener("app:toast", handleToast as EventListener);
    };
  }, [dispatch, pushRuntimeToast]);

  /* Session expiry handler */
  useEffect(() => {
    if (!token || !expiresAt) return;
    const now = Date.now();
    const remaining = expiresAt - now;
    const sendSessionExpiredNotification = () => {
      dispatch(
        pushNotification({
          message: t("auth.session.expired"),
          description: t("auth.session.expired.description"),
          type: "warning",
          priority: "high",
          pinned: true,
          meta: { source: "session-expired" },
        }),
      );
    };
    if (remaining <= 0) {
      sendSessionExpiredNotification();
      dispatch(logout());
      return;
    }
    const timeoutId = window.setTimeout(() => {
      sendSessionExpiredNotification();
      dispatch(logout());
    }, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, expiresAt, token, t]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <RouteTracker />
      <ShellChrome />
    </BrowserRouter>
  );
};

/** Invisible spacer that matches the fixed sidebar width so main content doesn't slide under it. */
const SIDEBAR_KEY = 'sidebar-mode';
function SidebarSpacer() {
  const [mode, setMode] = useState<'expanded' | 'collapsed'>(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_KEY);
      return raw === 'collapsed' ? 'collapsed' : 'expanded';
    } catch { return 'expanded'; }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(SIDEBAR_KEY);
        setMode(raw === 'collapsed' ? 'collapsed' : 'expanded');
      } catch { /* */ }
    };
    // Listen for sidebar toggle (Sidebar writes to localStorage + fires storage event)
    window.addEventListener('storage', handler);
    // Also poll briefly since same-tab localStorage changes don't fire storage event
    const id = setInterval(handler, 300);
    return () => { window.removeEventListener('storage', handler); clearInterval(id); };
  }, []);

  return <div className={`shrink-0 ${mode === 'collapsed' ? 'w-[76px]' : 'w-[280px]'}`} />;
}
