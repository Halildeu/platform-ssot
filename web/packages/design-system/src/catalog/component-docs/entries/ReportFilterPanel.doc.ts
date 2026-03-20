import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ReportFilterPanel",
  indexItem: {
  "name": "ReportFilterPanel",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "page_blocks",
  "subgroup": "filters",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Filters",
  "demoMode": "live",
  "description": "Rapor filtreleri, submit/reset ve durum bilgisini tek panel shell icinde toplar.",
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
    "doctor_frontend_evidence",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-7",
    "page-blocks",
    "stable",
    "filters",
    "reporting"
  ],
  "uxPrimaryThemeId": "data_entry_validation_recovery",
  "uxPrimarySubthemeId": "dependency_aware_form_guidance",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1",
  "importStatement": "import { ReportFilterPanel } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-reporting/src/app/reporting/ReportPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "ReportFilterPanel",
  "variantAxes": [
    "layout: inline-panel | dense-panel",
    "actions: submit-reset | readonly",
    "surface: report | analytics"
  ],
  "stateModel": [
    "submit flow",
    "reset flow",
    "loading state",
    "readonly guard"
  ],
    "previewStates": [
      "loading",
      "disabled",
      "readonly",
      "dark-theme"
    ],
    "behaviorModel": [
      "submit flow",
      "reset flow",
      "loading state",
      "readonly guard"
    ],
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Panel icindeki filtre alanlari."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Submit/reset sirasinda paneli kilitler."
    },
    {
      "name": "submitLabel / resetLabel",
      "type": "string",
      "default": "Filtrele / Sifirla",
      "required": false,
      "description": "Aksiyon etiketlerini override eder."
    },
    {
      "name": "onSubmit / onReset",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Panel aksiyon callbackleri."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkileşim seviyesi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "report filter submit flow",
    "analytics filter reset",
    "readonly policy panel"
  ],
  "regressionFocus": [
    "submit guard",
    "reset guard",
    "child slot wrap"
  ]
},
};

export default entry;
