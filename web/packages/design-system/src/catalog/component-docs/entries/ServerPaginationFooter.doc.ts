import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ServerPaginationFooter",
  indexItem: {
    "name": "ServerPaginationFooter",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "navigation",
    "subgroup": "pagination",
    "taxonomyGroupId": "navigation",
    "taxonomySubgroup": "Server pagination footer",
    "demoMode": "live",
    "description": "SSRM grid'ler icin custom sayfalama footer'i. Yazilabilir sayfa input'u, sayfa boyutu secici (Tumu dahil), satir bilgisi ve ilk/onceki/sonraki/son navigasyon butonlari icerir. AG Grid built-in pagination'i yerine kullanilir.",
    "sectionIds": [
      "component_library_management",
      "navigation_patterns",
      "governance_contribution"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-4",
      "navigation",
      "beta",
      "server-pagination",
      "data-grid",
      "ssrm"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "critical_path_minimization",
    "roadmapWaveId": "wave_4_data_grid",
    "acceptanceContractId": "ui-library-wave-4-data-grid-v1",
    "importStatement": "import { ServerPaginationFooter } from '@mfe/design-system';",
    "whereUsed": [
      "web/packages/design-system/src/advanced/data-grid/EntityGridTemplate.tsx"
    ],
    "dependsOn": ["EntityGridTemplate", "GridShell"]
  },
  apiItem: {
    "name": "ServerPaginationFooter",
    "variantAxes": [
      "page-size: 25 | 50 | 100 | 200 | all",
      "progress: determinate | indeterminate",
      "start-slot: empty | custom content"
    ],
    "stateModel": [
      "current page (synced from AG Grid paginationChanged event)",
      "total pages (derived from row count / page size)",
      "page size (controlled via setGridOption)",
      "total rows (from AG Grid paginationGetRowCount)",
      "page input value (local editable state)"
    ],
    "previewStates": [
      "default (page 1 of N)",
      "mid-page (page 10 of 25)",
      "last page",
      "all mode (page size = total rows)",
      "empty state (no rows)",
      "with start slot (veri modu dropdown)"
    ],
    "behaviorModel": [
      "page size change triggers setGridOption('paginationPageSize', value)",
      "page input accepts numeric input, navigates on Enter, reverts on Escape",
      "page input blur validates and navigates or reverts",
      "navigation buttons disabled at boundaries (first/last page)",
      "all option sets page size to total row count",
      "syncs state from AG Grid paginationChanged event listener"
    ],
    "props": [
      {
        "name": "gridApi",
        "type": "GridApi | null",
        "default": "null",
        "required": true,
        "description": "AG Grid API reference for pagination control"
      },
      {
        "name": "pageSizeOptions",
        "type": "number[]",
        "default": "[25, 50, 100, 200]",
        "required": false,
        "description": "Available page size options in the dropdown"
      },
      {
        "name": "showAllOption",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Whether to show 'Tumu' (all rows) option in page size selector"
      },
      {
        "name": "allLabel",
        "type": "string",
        "default": "\"Tümü\"",
        "required": false,
        "description": "Label for the all-rows option"
      },
      {
        "name": "startSlot",
        "type": "React.ReactNode",
        "default": "undefined",
        "required": false,
        "description": "Content rendered at the left side of the footer (e.g. data mode selector)"
      }
    ],
    "previewFocus": [
      "page size dropdown interaction",
      "editable page input with Enter/Escape/blur",
      "navigation button states at boundaries",
      "row info text format (X - Y / Z)",
      "start slot alignment with pagination controls"
    ],
    "regressionFocus": [
      "page size change triggers SSRM refresh",
      "page input validates numeric-only input",
      "navigation disabled correctly at first/last page",
      "all mode sets correct page size",
      "component unmount removes event listener"
    ]
  }
};

export default entry;
