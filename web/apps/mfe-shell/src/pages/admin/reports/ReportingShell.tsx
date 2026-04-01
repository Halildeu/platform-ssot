import React, { createContext, useContext, useState, useCallback } from "react";
import { X, Menu } from "lucide-react";

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ */
/*  ReportingShell — Responsive layout grid for reporting pages        */
/*                                                                     */
/*  Mirrors DesignLabShell pattern:                                    */
/*  - Mobile  (<640px): Full-width main, sidebar as drawer             */
/*  - Tablet  (640-1023): Collapsible sidebar (240px) + main           */
/*  - Desktop (1024+): Sidebar (280px) + main                         */
/* ------------------------------------------------------------------ */

type ShellContextValue = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
};

const ShellContext = createContext<ShellContextValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  sidebarCollapsed: false,
  toggleSidebarCollapse: () => {},
});

export function useReportingShell() {
  return useContext(ShellContext);
}

const STORAGE_KEY = "reporting-sidebar-collapsed";

/* ---- Slots ---- */

function Sidebar({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar, sidebarCollapsed } = useReportingShell();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-inverse/30 backdrop-blur-xs sm:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      <div
        data-testid="reporting-sidebar-container"
        data-collapsed={sidebarCollapsed}
        className={cx(
          "shrink-0 self-start transition-[width] duration-200",
          "fixed inset-y-0 left-0 z-50 w-[300px] bg-surface-default",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "sm:sticky sm:top-4 sm:inset-auto sm:z-auto sm:translate-x-0 sm:bg-transparent",
          sidebarCollapsed
            ? "sm:w-[52px] sm:max-w-[52px]"
            : "sm:w-[240px] lg:w-[280px] xl:w-[300px]",
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 sm:hidden">
          <span className="text-sm font-semibold text-text-primary">
            Raporlar
          </span>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex max-h-[calc(100vh-var(--shell-header-h)-40px)] min-h-0 flex-col">
          {children}
        </div>
      </div>
    </>
  );
}

function MobileMenuButton() {
  const { sidebarOpen, toggleSidebar } = useReportingShell();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="inline-flex items-center justify-center rounded-xl border border-border-subtle bg-surface-default p-2 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary sm:hidden"
      aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
    >
      {sidebarOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden">
      <div className="mb-3 sm:hidden">
        <MobileMenuButton />
      </div>
      {children}
    </main>
  );
}

/* ---- Root ---- */

function ReportingShellRoot({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ShellContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        sidebarCollapsed,
        toggleSidebarCollapse,
      }}
    >
      <div className="min-h-screen bg-surface-canvas overflow-x-hidden">
        <div className="mx-auto max-w-[1880px] px-2 py-4 sm:px-3 lg:px-4">
          <div className="flex gap-3 max-w-full">{children}</div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

/* ---- Compound ---- */

export const ReportingShell = Object.assign(ReportingShellRoot, {
  Sidebar,
  Main,
});
