import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Upload",
  indexItem: {
  "name": "Upload",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
  "importStatement": "import { Upload } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
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
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
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
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Aciklama metni."
    },
    {
      "name": "hint",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Yardim metni."
    },
    {
      "name": "error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Validation geri bildirimi."
    },
    {
      "name": "files",
      "type": "UploadFileItem[]",
      "default": "[]",
      "required": false,
      "description": "Controlled secili dosya listesi."
    },
    {
      "name": "defaultFiles",
      "type": "UploadFileItem[]",
      "default": "[]",
      "required": false,
      "description": "Uncontrolled secili dosya listesi."
    },
    {
      "name": "multiple",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Coklu dosya secimi."
    },
    {
      "name": "maxFiles",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Dosya adedi limiti."
    },
    {
      "name": "accept",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Izinli dosya tipleri."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yukleme gostergesi render eder ve etkilesimi devre disi birakir."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "readOnly",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Salt okunur durumu aktif eder."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
    },
    {
      "name": "className",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Additional CSS class for custom styling."
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
