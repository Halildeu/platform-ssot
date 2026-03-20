import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TablePagination",
  indexItem: {
  "name": "TablePagination",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "pagination",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Table pagination",
  "demoMode": "live",
  "description": "Table ve grid footer'lari icin satir adedi, range bilgisi ve ilk-son sayfa aksiyonlarini ayni shell'de toplar.",
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
    "wave-2",
    "navigation",
    "beta",
    "table-pagination",
    "data-grid"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { TablePagination } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessGrid.ui.tsx",
    "web/apps/mfe-audit/src/app/components/AuditEventFeed.tsx"
  ]
},
  apiItem: {
  "name": "TablePagination",
  "variantAxes": [
    "mode: controlled | uncontrolled",
    "density: default | compact",
    "first-last-buttons: hidden | visible",
    "total knowledge: known | unknown",
    "actions shell: default | custom component",
    "page-size options: primitive | rich object options"
  ],
  "stateModel": [
    "page state controller",
    "page-size selection",
    "first-last navigation guard",
    "range summary shell",
    "unknown-total next-page contract",
    "slot-driven actions override"
  ],
    "previewStates": ["first-page", "middle-page", "last-page", "dark-theme"],
    "behaviorModel": [
      "page state controller",
      "page-size selection",
      "first-last navigation guard",
      "range summary shell",
      "unknown-total next-page contract",
      "slot-driven actions override"
    ],
  "props": [
    {
      "name": "totalItems",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Grid veya tablo footer'inin toplam kayit bilgisini ve range hesabini besler."
    },
    {
      "name": "page / defaultPage",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Controlled veya uncontrolled sayfa durumunu belirler."
    },
    {
      "name": "pageSize / defaultPageSize / pageSizeOptions",
      "type": "number / number / number[] | PaginationSizeOption[]",
      "default": "10 / 10 / [10, 20, 50, 100]",
      "required": false,
      "description": "Satir adedi secimi ve footer'daki size changer shell'ini belirler."
    },
    {
      "name": "showFirstLastButtons",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Ilk/son sayfa ikon aksiyonlarini footer toolbar'ina ekler."
    },
    {
      "name": "totalItemsKnown / hasNextPage",
      "type": "boolean / boolean",
      "default": "true / -",
      "required": false,
      "description": "Toplam kaydin tam bilinmedigi stream veya server-driven footer senaryolarinda next-page guard'ini tanimlar."
    },
    {
      "name": "ActionsComponent / slots / slotProps",
      "type": "React component / slot map / slot props",
      "default": "-",
      "required": false,
      "description": "Footer aksiyon cluster'ini kendi buton yapinla degistirip layout class'larini slot seviyesinde override etmeni saglar."
    },
    {
      "name": "localeText / access / accessReason",
      "type": "TablePaginationLocaleText / access-level / string",
      "default": "- / full / -",
      "required": false,
      "description": "Rows-per-page, range ve navigation etiketlerini locale-aware sekilde override eder."
    },
    {
      "name": "className",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Additional CSS class for custom styling."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "'md'",
      "required": false,
      "description": "Component size variant."
    }
  ],
  "previewFocus": [
    "grid footer integration",
    "rows-per-page shell",
    "first-last button variant",
    "unknown-total footer semantics",
    "custom actions override"
  ],
  "regressionFocus": [
    "page-size change reset parity",
    "range summary correctness",
    "first-last button disabled guards",
    "unknown total next-page parity",
    "actions slot override"
  ]
},
};

export default entry;
