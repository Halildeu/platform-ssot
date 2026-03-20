"use client";

/* ------------------------------------------------------------------ */
/*  AG Grid Setup — Module registration & license                      */
/*                                                                     */
/*  SINGLE OWNER: This file is the canonical AG Grid module            */
/*  registration point for the entire monorepo. No other package       */
/*  should call ModuleRegistry.registerModules() directly.             */
/*                                                                     */
/*  Imported as a side-effect when data-grid components are used.      */
/*  Safe to import multiple times (ModuleRegistry is idempotent).      */
/* ------------------------------------------------------------------ */

import { ModuleRegistry, AllCommunityModule, CsvExportModule, InfiniteRowModelModule } from "ag-grid-community";
import {
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  AdvancedFilterModule,
  SetFilterModule,
  SideBarModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  ColumnMenuModule,
  ExcelExportModule,
  ClipboardModule,
  IntegratedChartsModule,
} from "ag-grid-enterprise";
import { setupAgGridLicense } from "../../lib/ag-grid-license";

/* ── License ─────────────────────────────────────────────────────── */
setupAgGridLicense();

/* ── Targeted module registration (v34.3.1) ──────────────────────── */
/*  Only modules actually consumed by MFE grid components.            */
/*  AllEnterpriseModule deliberately excluded — it registers ~40      */
/*  modules including pivot, charts, sparklines, etc. that bloat      */
/*  the bundle. Add modules here as needed.                           */
/* ------------------------------------------------------------------ */
ModuleRegistry.registerModules([
  // Core (client-side row model + basic grid)
  AllCommunityModule,

  // Row models
  ServerSideRowModelModule,       // mfe-reporting, mfe-users (SSRM)
  ServerSideRowModelApiModule,    // SSRM API (refreshServerSide, retryServerSideLoads)
  InfiniteRowModelModule,         // mfe-audit (infinite scroll)

  // Filtering
  AdvancedFilterModule,           // mfe-users advanced filter
  SetFilterModule,                // column set filter

  // Side bar & panels
  SideBarModule,                  // sidebar container
  ColumnsToolPanelModule,         // columns tool panel
  FiltersToolPanelModule,         // filters tool panel

  // Menus
  MenuModule,                     // context menu
  ColumnMenuModule,               // column header menu

  // Export
  CsvExportModule,                // CSV export
  ExcelExportModule,              // Excel export

  // Clipboard
  ClipboardModule,                // copy/paste

  // Integrated Charts (AG Charts 12.3.1)
  // Enables chart creation from grid range selection.
  // Dependency: ag-charts-enterprise 12.3.1 (installed in monorepo root)
  IntegratedChartsModule,
]);

export const AG_GRID_SETUP_COMPLETE = true;
