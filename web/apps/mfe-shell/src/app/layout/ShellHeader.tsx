import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store.hooks";
import { isPermitAllMode, isKeycloakMode, buildAppRedirectUri } from "../auth/auth-config";
import keycloak from "../auth/keycloakClient";
import { logout } from "../../features/auth/model/auth.slice";
import { useAuthorization } from "../../features/auth/model/use-authorization.model";
import { PERMISSIONS } from "../../features/auth/lib/permissions.constants";
import {
  isSuggestionsRemoteEnabled,
  isEthicRemoteEnabled,
} from "../shell-navigation";
import { useShellCommonI18n, i18n } from "../i18n";
import {
  ShellHeaderNavbar,
  type ShellHeaderNavbarItem,
} from "./ShellHeaderNavbar";
import { DesignLabHeaderMenu } from "./DesignLabHeaderMenu";
import NotificationCenter from "./NotificationCenter";
import SessionAuditShortcutsMenu from "./SessionAuditShortcutsMenu";
import LoginPopover from "./LoginPopover";
import AppLauncher from "./AppLauncher";
import { ThemeRuntimePanelButton } from "./ThemeRuntimePanelButton";
import { UserMenuPopover } from "./UserMenuPopover";

/* ------------------------------------------------------------------ */
/*  ShellHeader — Top navigation bar                                   */
/* ------------------------------------------------------------------ */

export const ShellHeader: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const permitAllMode = isPermitAllMode();
  const keycloakEnabled = isKeycloakMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { hasPermission } = useAuthorization();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { t, manager: i18nManager, locale } = useShellCommonI18n();
  const suggestionsEnabled = isSuggestionsRemoteEnabled();
  const ethicEnabled = isEthicRemoteEnabled();

  useEffect(() => {
    setLoginOpen(false);
    setLauncherOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const menuItems = useMemo(() => {
    const items: ShellHeaderNavbarItem[] = [
      { key: "/", path: "/", label: t("shell.nav.home") },
    ];
    if (suggestionsEnabled) {
      items.push({ key: "/suggestions", path: "/suggestions", label: t("shell.nav.suggestions") });
    }
    if (ethicEnabled) {
      items.push({ key: "/ethic", path: "/ethic", label: t("shell.nav.ethic") });
    }
    if (hasPermission(PERMISSIONS.ACCESS_MODULE)) {
      items.push({ key: "/access", path: "/access/roles", label: t("shell.nav.access") });
    }
    if (hasPermission(PERMISSIONS.AUDIT_MODULE)) {
      items.push({ key: "/audit", path: "/audit/events", label: t("shell.nav.audit") });
    }
    if (hasPermission(PERMISSIONS.REPORTING_MODULE)) {
      items.push({ key: "/admin/reports", path: "/admin/reports", label: t("shell.nav.reports") });
    }
    if (hasPermission(PERMISSIONS.USER_MANAGEMENT_MODULE)) {
      items.push({ key: "/admin/users", path: "/admin/users", label: t("shell.nav.users") });
    }
    if (hasPermission(PERMISSIONS.THEME_ADMIN)) {
      items.push({ key: "/admin/themes", path: "/admin/themes", label: t("shell.nav.themes") });
    }
    items.push({ key: "/admin/services", path: "/admin/services", label: t("shell.nav.services") });
    return items;
  }, [ethicEnabled, hasPermission, suggestionsEnabled, t]);

  const designLabEnabled = hasPermission(PERMISSIONS.THEME_ADMIN);
  const sessionAuditShortcutEnabled = Boolean(
    token && user?.email && hasPermission(PERMISSIONS.AUDIT_MODULE),
  );

  const userDisplayName = useMemo(() => {
    if (user?.fullName && user.fullName.trim().length > 0) return user.fullName;
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    if (user?.email) {
      const [namePart] = user.email.split("@");
      return namePart;
    }
    return t("shell.header.defaultUser");
  }, [t, locale, user?.displayName, user?.email, user?.fullName, user?.name]);

  const formattedLastLogin = useMemo(() => {
    if (!user?.lastLoginAt) return t("shell.header.neverLoggedIn");
    try {
      const date = new Date(user.lastLoginAt);
      const localeMap: Record<string, string> = {
        tr: "tr-TR", en: "en-US", de: "de-DE", es: "es-ES",
      };
      const localeCode = localeMap[locale];
      return localeCode ? date.toLocaleString(localeCode) : date.toLocaleString();
    } catch {
      return user.lastLoginAt;
    }
  }, [user?.lastLoginAt, t, locale]);

  const userMenuItems = useMemo(
    () => [
      {
        key: "last-login",
        label: t("shell.header.lastLogin").replace("{value}", formattedLastLogin),
        disabled: true,
      },
      { type: "divider" as const },
      { key: "profile", label: t("shell.header.profileSoon"), disabled: true },
      { type: "divider" as const },
      { key: "logout", label: t("shell.header.logout"), icon: "🚪" },
    ],
    [formattedLastLogin, t],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    if (keycloakEnabled && typeof window !== "undefined") {
      keycloak
        .logout({ redirectUri: buildAppRedirectUri("/login"), federated: true })
        .catch(() => {});
    }
  }, [dispatch, keycloakEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      ref={(el) => {
        if (el) {
          const h = el.getBoundingClientRect().height;
          document.documentElement.style.setProperty('--shell-header-h', `${h}px`);
        }
      }}
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      className="fixed inset-x-0 top-0 z-50 bg-surface-header px-6 py-2"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-panel px-3 py-2 shadow-xs">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-action-secondary-border bg-action-secondary text-action-secondary-text shadow-xs transition hover:opacity-90"
            onClick={() => setLauncherOpen((prev) => !prev)}
            aria-label={t("shell.launcher.title")}
            title={t("shell.launcher.title")}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </button>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <ShellHeaderNavbar
              items={menuItems}
              currentPath={location.pathname}
              onNavigate={(path) => {
                if (path !== location.pathname) navigate(path);
              }}
              ariaLabel={locale === "tr" ? "Ana gezinme" : "Primary navigation"}
              morePagesLabel={t("shell.nav.morePages")}
              utility={designLabEnabled ? <DesignLabHeaderMenu /> : undefined}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {/* Language selector */}
          <div className="hidden items-center gap-2 xl:flex">
            <span className="hidden text-xs font-semibold text-text-secondary md:inline">
              {t("shell.header.language")}:
            </span>
            <select
              className="h-8 rounded-md border border-action-secondary-border bg-action-secondary px-2 text-xs font-semibold text-action-secondary-text focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
              value={i18nManager.getLocale()}
              aria-label={t("shell.header.languageSelectAria")}
              onChange={(event) => {
                const nextLocale = event.target.value;
                i18nManager.setLocale(nextLocale);
                if (typeof window !== "undefined") {
                  try {
                    window.localStorage.setItem("mfe.locale", nextLocale);
                    window.dispatchEvent(
                      new CustomEvent("app:locale-change", {
                        detail: { locale: nextLocale },
                      }),
                    );
                  } catch {}
                }
              }}
            >
              <option value="tr">🇹🇷 {t("shell.language.tr")}</option>
              <option value="en">🇬🇧 {t("shell.language.en")}</option>
              <option value="de">🇩🇪 {t("shell.language.de")}</option>
              <option value="es">🇪🇸 {t("shell.language.es")}</option>
            </select>
          </div>
          <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface-panel px-2 py-1 text-xs font-semibold text-text-secondary xl:hidden">
            <span aria-hidden>
              {locale === "tr" ? "🇹🇷" : locale === "en" ? "🇬🇧" : locale === "de" ? "🇩🇪" : locale === "es" ? "🇪🇸" : "🌐"}
            </span>
          </div>
          <div className="inline-flex">
            <ThemeRuntimePanelButton />
          </div>
          {sessionAuditShortcutEnabled ? (
            <SessionAuditShortcutsMenu email={user?.email} label={t("shell.nav.audit")} />
          ) : null}
          <NotificationCenter />
          {token ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setUserMenuOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-panel px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted lg:gap-2 lg:px-3"
              >
                <span aria-hidden>👤</span>
                <span className="max-w-[140px] truncate text-left hidden lg:inline">
                  {userDisplayName}
                </span>
                <ChevronDown className="h-3 w-3" aria-hidden />
              </button>
              {userMenuOpen ? (
                <UserMenuPopover
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={handleLogout}
                  items={userMenuItems}
                />
              ) : null}
            </div>
          ) : permitAllMode ? (
            <span className="rounded-full border border-border-subtle bg-surface-panel px-3 py-1 text-xs font-semibold text-text-secondary">
              {t("shell.header.permitAllNoLogin")}
            </span>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-action-primary-border bg-action-primary px-4 py-2 text-xs font-semibold text-action-primary-text shadow-xs hover:opacity-90"
              onClick={() => {
                setLoginOpen(false);
                keycloak
                  .login({ redirectUri: buildAppRedirectUri(window.location.href) })
                  .catch(() => { setLoginOpen(true); });
              }}
            >
              <span aria-hidden>🔑</span>
              <span>{t("shell.header.loginPanel")}</span>
            </button>
          )}
        </div>
      </div>
      {!token && !permitAllMode && loginOpen && (
        <LoginPopover
          onClose={() => setLoginOpen(false)}
          onNavigate={() => navigate("/login")}
        />
      )}
      {launcherOpen && <AppLauncher onClose={() => setLauncherOpen(false)} />}
    </header>
  );
};
