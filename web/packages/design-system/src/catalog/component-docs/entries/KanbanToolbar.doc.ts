import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanToolbar",
  indexItem: {
    "name": "KanbanToolbar",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "x_kanban",
    "taxonomySubgroup": "Kanban toolbar",
    "demoMode": "planned",
    "description": "Kanban tahtasi icin arama, filtreleme ve kolon ekleme aksiyonlarini barindiran toolbar bileseni.",
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
      "kanban",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { KanbanToolbar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanToolbar",
    "variantAxes": [
      "layout: standard | compact"
    ],
    "stateModel": [
      "idle",
      "searching",
      "filtering"
    ],
    "previewStates": [
      "default",
      "with-search",
      "with-filters",
      "dark-theme"
    ],
    "behaviorModel": [
      "search input with debounced filtering",
      "column add trigger action",
      "filter controls integration",
      "keyboard shortcut support",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "searchValue",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Arama alaninin kontrol edilen degeri."
      },
      {
        "name": "onSearchChange",
        "type": "(value: string) => void",
        "default": "-",
        "required": false,
        "description": "Arama degeri degistiginde tetiklenen callback."
      },
      {
        "name": "onAddColumn",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Yeni kolon ekleme aksiyonu tetiklendiginde cagrilacak callback."
      },
      {
        "name": "filters",
        "type": "KanbanFilter[]",
        "default": "[]",
        "required": false,
        "description": "Aktif filtre tanimlari dizisi."
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
        "description": "Toolbar boyut varyantini belirler."
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
      "search input interaction",
      "add column button",
      "filter controls layout"
    ],
    "regressionFocus": [
      "arama debounce zamanlama dogrulugu",
      "filtre state senkronizasyonu",
      "keyboard shortcut tetikleme",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
