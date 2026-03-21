import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DataGridFilterChips",
  indexItem: {
    "name": "DataGridFilterChips",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Filter Controls",
    "demoMode": "live",
    "description": "Aktif grid filtrelerini chip olarak goruntuleyen ve tek tek veya toplu temizleme imkani sunan yardimci bilesen.",
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
      "data-grid",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { DataGridFilterChips } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "DataGridFilterChips",
    "variantAxes": [
      "display: inline | stacked"
    ],
    "stateModel": [
      "empty",
      "single-filter",
      "multi-filter"
    ],
    "previewStates": [
      "single-filter",
      "multi-filter",
      "dark-theme"
    ],
    "behaviorModel": [
      "chip-based active filter display",
      "individual filter removal",
      "bulk clear all action",
      "keyboard chip navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "filters",
        "type": "ActiveFilter[]",
        "default": "-",
        "required": true,
        "description": "Aktif filtre nesneleri dizisi; her biri chip olarak goruntulenir."
      },
      {
        "name": "onClearAll",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Tum filtreleri temizle aksiyonu tetiklendiginde cagrilacak callback."
      },
      {
        "name": "clearAllLabel",
        "type": "string",
        "default": "Tumunu Temizle",
        "required": false,
        "description": "Toplu temizleme butonunun etiket metni."
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
        "description": "Chip boyut varyantini belirler."
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
      "single vs multi-filter chip layout",
      "clear all action",
      "empty state fallback"
    ],
    "regressionFocus": [
      "chip removal callback dogrulugu",
      "bos filtre listesinde goruntuleme",
      "keyboard navigation ve focus-visible",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
