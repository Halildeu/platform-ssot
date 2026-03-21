import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MultiStepForm",
  indexItem: {
    "name": "MultiStepForm",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder Multi Step",
    "demoMode": "planned",
    "description": "Cok adimli form container bileseni; adim navigasyonu, validasyon ve ilerleme gostergesi ile form akisi yonetimi saglar.",
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
    "importStatement": "import { MultiStepForm } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MultiStepForm",
    "variantAxes": [
      "layout: wizard | tabs | stepper",
      "navigation: linear | free"
    ],
    "stateModel": [
      "step-active",
      "step-completed",
      "step-error",
      "submitting"
    ],
    "previewStates": [
      "first-step",
      "middle-step",
      "final-step",
      "with-validation-error",
      "dark-theme"
    ],
    "behaviorModel": [
      "step navigation control",
      "per-step validation",
      "progress indicator rendering",
      "step completion tracking",
      "linear/free navigation mode",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "steps",
        "type": "FormStep[]",
        "default": "[]",
        "required": true,
        "description": "Form adimlari tanim dizisi."
      },
      {
        "name": "activeStep",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Aktif adim indeksi (controlled mod)."
      },
      {
        "name": "onStepChange",
        "type": "(step: number) => void",
        "default": "-",
        "required": false,
        "description": "Adim degistiginde tetiklenen callback."
      },
      {
        "name": "onComplete",
        "type": "(formData: Record<string, any>) => Promise<void>",
        "default": "-",
        "required": true,
        "description": "Tum adimlar tamamlandiginda tetiklenen async callback."
      },
      {
        "name": "navigation",
        "type": "'linear' | 'free'",
        "default": "linear",
        "required": false,
        "description": "Adim navigasyon modu; linear sadece ileri/geri, free serbest gecis."
      },
      {
        "name": "showProgress",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Ilerleme gostergesini gosterir veya gizler."
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
        "description": "Form boyut varyantini belirler."
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
      "step navigation flow",
      "progress indicator",
      "per-step validation"
    ],
    "regressionFocus": [
      "adim validasyon engelleme dogrulugu",
      "linear navigasyon sinirlamasi",
      "form veri biriktirme tutarliligi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
