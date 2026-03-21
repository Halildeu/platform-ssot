import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ChartDashboard",
  indexItem: {
    "name": "ChartDashboard",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Dashboard",
    "demoMode": "planned",
    "description": "Birden fazla grafik ve KPI widget'ini grid layout icinde duzenleyen dashboard container bileseni.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "charts",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { ChartDashboard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ChartDashboard",
    "variantAxes": [
      "layout: grid | masonry | stack",
      "columns: 1 | 2 | 3 | 4"
    ],
    "stateModel": [
      "default",
      "loading",
      "empty"
    ],
    "previewStates": [
      "multi-widget",
      "single-column",
      "loading-state",
      "empty-dashboard",
      "dark-theme"
    ],
    "behaviorModel": [
      "responsive grid layout",
      "widget slot composition",
      "drag-to-reorder widgets",
      "loading skeleton overlay",
      "empty state fallback",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Dashboard icerisinde goruntulenecek grafik/widget bilesenleri."
      },
      {
        "name": "columns",
        "type": "number",
        "default": "3",
        "required": false,
        "description": "Grid kolon sayisi."
      },
      {
        "name": "layout",
        "type": "'grid' | 'masonry' | 'stack'",
        "default": "grid",
        "required": false,
        "description": "Widget yerlestirme duzeni."
      },
      {
        "name": "gap",
        "type": "number | string",
        "default": "16",
        "required": false,
        "description": "Widget arasi bosluk degeri."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Tum dashboard icin yuklenme durumu."
      },
      {
        "name": "onReorder",
        "type": "(fromIndex: number, toIndex: number) => void",
        "default": "-",
        "required": false,
        "description": "Widget sira degisikliginde tetiklenen callback."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Dashboard boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "responsive grid layout",
      "widget composition",
      "drag-to-reorder interaction"
    ],
    "regressionFocus": [
      "kolon sayisi responsive gecis",
      "bos dashboard goruntuleme",
      "widget reorder callback dogrulugu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
