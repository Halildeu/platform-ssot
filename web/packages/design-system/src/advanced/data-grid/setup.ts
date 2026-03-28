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
  RowGroupingModule,
  RowGroupingPanelModule,
  StatusBarModule,
  PivotModule,
  RangeSelectionModule,
} from "ag-grid-enterprise";
import { setupAgGridLicense } from "../../lib/ag-grid-license";

/* ── License ─────────────────────────────────────────────────────── */
// Immediate attempt (works when process.env is available via DefinePlugin)
const immediateResult = setupAgGridLicense();

// Deferred retry — window.__env__ may not be populated yet at module load time
// (shell injects it via <script> tag, which runs before MFE chunks but after
//  the initial module scope evaluation in some webpack federation configurations)
if (!immediateResult && typeof window !== 'undefined') {
  const retrySetup = () => {
    if (!setupAgGridLicense()) {
      // Final fallback: schedule one more attempt after DOM is ready
      if (document.readyState !== 'complete') {
        window.addEventListener('load', () => setupAgGridLicense(), { once: true });
      }
    }
  };
  // Micro-task retry: runs after current script block completes
  Promise.resolve().then(retrySetup);
  // Macro-task retry: runs after all synchronous scripts
  setTimeout(retrySetup, 0);
}

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

  // Row Grouping (drag column headers to group panel)
  RowGroupingModule,              // grouping engine
  RowGroupingPanelModule,         // drop zone panel above headers

  // Pivot (rotate grouped data into columns)
  PivotModule,                    // pivot mode engine

  // Status Bar (row count, selection count, aggregations)
  StatusBarModule,                // bottom status bar

  // Range Selection (Excel-like cell range select + aggregation)
  RangeSelectionModule,           // cell range selection

  // Integrated Charts (AG Charts 12.3.1)
  // Enables chart creation from grid range selection.
  // Dependency: ag-charts-enterprise 12.3.1 (installed in monorepo root)
  IntegratedChartsModule,
]);

export const AG_GRID_SETUP_COMPLETE = true;
