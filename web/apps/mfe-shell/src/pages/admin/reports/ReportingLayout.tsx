import React, { Suspense } from "react";
import { ReportingProvider } from "./ReportingProvider";
import { ReportingShell } from "./ReportingShell";
import { ReportingAppSidebar } from "./ReportingAppSidebar";
import { ReportingModule } from "../../../app/router/lazy-routes";

/* ------------------------------------------------------------------ */
/*  ReportingLayout — Composition root                                 */
/*                                                                     */
/*  Provider → Shell → (Sidebar + Main with MFE)                       */
/*  Mirrors DesignLabLayout pattern.                                   */
/* ------------------------------------------------------------------ */

const PageSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4 p-6">
    <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-muted" />
    <div className="h-8 w-full max-w-lg animate-pulse rounded-lg bg-surface-muted" />
    <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl bg-surface-muted"
        />
      ))}
    </div>
  </div>
);

export const ReportingLayout: React.FC = () => (
  <ReportingProvider>
    <ReportingShell>
      <ReportingShell.Sidebar>
        <ReportingAppSidebar />
      </ReportingShell.Sidebar>
      <ReportingShell.Main>
        <Suspense fallback={<PageSkeleton />}>
          <ReportingModule />
        </Suspense>
      </ReportingShell.Main>
    </ReportingShell>
  </ReportingProvider>
);

export default ReportingLayout;
