import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FormPreview",
  indexItem: {
    "name": "FormPreview",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_form_builder",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder",
    "demoMode": "planned",
    "description": "Form schemasinin canli on izlemesini gosteren salt okunur bilesen. Tasarim sirasinda form gorunumunu dogrulamak icin kullanilir.",
    "sectionIds": [
      "component_library_management",
      "form_controls",
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
      "form-builder",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { FormPreview } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FormPreview",
    "variantAxes": [
      "layout: vertical | horizontal | grid"
    ],
    "stateModel": [
      "empty-schema",
      "rendered"
    ],
    "previewStates": [
      "simple-form",
      "complex-form",
      "empty-schema",
      "dark-theme"
    ],
    "behaviorModel": [
      "schema-to-visual preview rendering",
      "real-time schema change reflection",
      "field layout visualization",
      "non-interactive display mode",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "schema",
        "type": "FormSchema",
        "default": "-",
        "required": true,
        "description": "On izlemesi goruntulecek form schema nesnesi."
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
        "description": "On izleme boyut varyantini belirler."
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
      "schema visualization accuracy",
      "field layout rendering",
      "empty schema fallback"
    ],
    "regressionFocus": [
      "schema degisiminde yeniden render",
      "bos schema goruntuleme",
      "karmasik alan tipleri render dogrulugu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
