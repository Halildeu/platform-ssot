import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Upload",
  indexItem: {
  "name": "Upload",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "forms",
  "subgroup": "inputs",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Upload / File picker",
  "demoMode": "live",
  "description": "Upload primitivei; kanit, ek ve release paketlerini policy-aware file selection yuzeyi ile toplar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-3",
    "forms",
    "beta",
    "file-entry"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "dependency_aware_form_guidance",
  "roadmapWaveId": "wave_3_forms",
  "acceptanceContractId": "ui-library-wave-3-forms-v1",
  "importStatement": "import { Upload } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Upload",
  "variantAxes": [
    "size: sm | md | lg",
    "mode: single | multiple",
    "state: default | invalid | readonly | disabled"
  ],
  "stateModel": [
    "controlled vs uncontrolled file list",
    "file limit enforcement",
    "inline validation",
    "access-aware interaction"
  ],
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Dosya secim alaninin basligi ve baglami."
    },
    {
      "name": "description / hint / error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama, yardim ve validation geri bildirimi."
    },
    {
      "name": "files / defaultFiles",
      "type": "UploadFileItem[]",
      "default": "[]",
      "required": false,
      "description": "Controlled veya uncontrolled secili dosya listesi."
    },
    {
      "name": "multiple / maxFiles / accept",
      "type": "boolean / number / string",
      "default": "false / - / -",
      "required": false,
      "description": "Secim adedi, limit ve izinli tipler."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
    }
  ],
  "previewFocus": [
    "controlled evidence pack",
    "readonly/disabled matrix",
    "limit and validation states"
  ],
  "regressionFocus": [
    "file list normalization",
    "readonly interaction guard",
    "maxFiles enforcement"
  ]
},
};

export default entry;
