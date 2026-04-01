import React, { createContext, useContext, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";

/** Join class names, filtering out falsy values */
const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ */
/*  DesignLabShell — Responsive layout grid                            */
/*                                                                     */
/*  Breakpoints:                                                       */
/*  - Mobile  (<640px):   Full-width main, sidebar as drawer           */
/*  - Tablet  (640-1023): Collapsible sidebar (240px) + main           */
/*  - Desktop (1024+):    Sidebar (280px) + main                       */
/*  - XL      (1280+):    Sidebar (300px) + main + right rail (260px)  */
/*                                                                     */
/*  Compound component pattern:                                        */
/*  <DesignLabShell>                                                   */
/*    <DesignLabShell.Sidebar>...</DesignLabShell.Sidebar>             */
/*    <DesignLabShell.Main>...</DesignLabShell.Main>                   */
/*    <DesignLabShell.RightRail>...</DesignLabShell.RightRail>         */
/*  </DesignLabShell>                                                  */
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

export function useDesignLabShell() {
  return useContext(ShellContext);
}

const STORAGE_KEY = "design-lab-sidebar-collapsed";

/* ---- Sub-components (slots) ---- */

function Sidebar({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar, sidebarCollapsed } = useDesignLabShell();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-inverse/30 backdrop-blur-xs sm:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      {/* Sidebar container */}
      <div
        data-testid="design-lab-sidebar-container"
        data-collapsed={sidebarCollapsed}
        className={cx(
          // Base
          "shrink-0 self-start transition-[width] duration-200",
          // Mobile: slide-over drawer (hidden off-screen by default)
          "fixed inset-y-0 left-0 z-50 w-[300px] bg-surface-default",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: sticky in layout, stays in view on scroll
          "sm:sticky sm:top-4 sm:inset-auto sm:z-auto sm:translate-x-0 sm:bg-transparent",
          // Desktop width
          sidebarCollapsed
            ? "sm:w-[52px] sm:max-w-[52px]"
            : "sm:w-[240px] lg:w-[280px] xl:w-[300px]",
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 pt-4 sm:hidden">
          <span className="text-sm font-semibold text-text-primary">Design Lab</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            aria-label="Close menu"
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
  const { sidebarOpen, toggleSidebar } = useDesignLabShell();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="inline-flex items-center justify-center rounded-xl border border-border-subtle bg-surface-default p-2 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary sm:hidden"
      aria-label={sidebarOpen ? "Close menu" : "Open menu"}
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

function RightRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden xl:block xl:w-[260px] xl:shrink-0">
      <div className="sticky top-4 max-h-[calc(100vh-32px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

/* ---- Root shell ---- */

function DesignLabShellRoot({ children }: { children: React.ReactNode }) {
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
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return (
    <ShellContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar, sidebarCollapsed, toggleSidebarCollapse }}>
      <div className="min-h-screen bg-surface-canvas overflow-x-hidden">
        <div className="mx-auto max-w-[1880px] px-2 py-4 sm:px-3 lg:px-4">
          <div className="flex gap-3 max-w-full">
            {children}
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

/* ---- Compound component assembly ---- */

export const DesignLabShell = Object.assign(DesignLabShellRoot, {
  Sidebar,
  Main,
  RightRail,
});
