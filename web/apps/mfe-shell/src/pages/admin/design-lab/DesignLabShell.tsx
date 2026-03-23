import React, { createContext, useContext, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";

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
};

const ShellContext = createContext<ShellContextValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function useDesignLabShell() {
  return useContext(ShellContext);
}

/* ---- Sub-components (slots) ---- */

function Sidebar({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar } = useDesignLabShell();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs sm:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      {/* Sidebar container */}
      <div
        className={[
          // Mobile: slide-over drawer
          "fixed inset-y-0 left-0 z-50 w-[300px] transform transition-[translate] duration-300 sm:relative sm:inset-auto sm:z-auto sm:translate-x-0",
          // Desktop: static in grid
          "sm:w-[240px] lg:w-[280px] xl:w-[300px]",
          // Shrink behaviour
          "shrink-0",
          // Mobile background
          "bg-surface-default sm:bg-transparent",
          // Mobile open/close
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
        ].join(" ")}
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
        <div className="sticky top-4 flex max-h-[calc(100vh-32px)] min-h-0 flex-col sm:top-4">
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
    <main className="min-w-0 flex-1">
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

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <ShellContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      <div className="min-h-screen bg-surface-canvas">
        <div className="mx-auto max-w-[1880px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
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
