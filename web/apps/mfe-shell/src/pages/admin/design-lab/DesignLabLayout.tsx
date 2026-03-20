import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { DesignLabProvider } from "./DesignLabProvider";
import { DesignLabShell } from "./DesignLabShell";
import { DesignLabSidebarRouter } from "./DesignLabSidebarRouter";
import { DesignLabSearchModal, useSearchModal } from "./DesignLabSearchModal";

/* ------------------------------------------------------------------ */
/*  DesignLabLayout                                                    */
/*                                                                     */
/*  Shared chrome for every Design Lab route:                          */
/*  - DesignLabProvider wraps data/state context                       */
/*  - DesignLabShell provides the responsive grid                      */
/*  - Sidebar is route-aware (reads URL, not query-params)             */
/*  - <Outlet /> renders the active child route                        */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-subtle border-t-action-primary" />
    </div>
  );
}

export function DesignLabLayout() {
  const searchModal = useSearchModal();

  return (
    <DesignLabProvider>
      <DesignLabShell>
        <DesignLabShell.Sidebar>
          <DesignLabSidebarRouter />
        </DesignLabShell.Sidebar>
        <DesignLabShell.Main>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </DesignLabShell.Main>
      </DesignLabShell>
      <DesignLabSearchModal
        open={searchModal.open}
        onClose={() => searchModal.setOpen(false)}
      />
    </DesignLabProvider>
  );
}

export default DesignLabLayout;
