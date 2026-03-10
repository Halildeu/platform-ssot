import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FilterBar",
  indexItem: {
  "name": "FilterBar",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "page_blocks",
  "subgroup": "filters",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Filters",
  "demoMode": "live",
  "description": "Liste, grid ve panel filtrelerini ortak toolbar shell icinde toplar.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
    "table_data_display"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence"
  ],
  "tags": [
    "wave-7",
    "page-blocks",
    "stable",
    "filters",
    "toolbar"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1",
  "importStatement": "import { FilterBar } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "FilterBar",
  "variantAxes": [
    "surface: inline-toolbar | wrap-toolbar",
    "actions: reset | save-view | custom-extra",
    "access: full | readonly | disabled"
  ],
  "stateModel": [
    "filter control wrap",
    "reset action",
    "save-view action",
    "readonly guard"
  ],
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Filtre kontrol slotlari."
    },
    {
      "name": "onReset",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Reset aksiyonu."
    },
    {
      "name": "onSaveView",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Kaydedilmis gorunum aksiyonu."
    },
    {
      "name": "extra",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Ek aksiyon veya bilgi alanı."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve davranis."
    }
  ],
  "previewFocus": [
    "grid filter toolbar",
    "compact search strip",
    "readonly action guard"
  ],
  "regressionFocus": [
    "wrap parity",
    "save-view guard",
    "button disabled/readOnly separation"
  ]
},
};

export default entry;
