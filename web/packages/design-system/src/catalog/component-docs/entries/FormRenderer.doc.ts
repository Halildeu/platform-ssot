import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FormRenderer",
  indexItem: {
    "name": "FormRenderer",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder",
    "demoMode": "planned",
    "description": "JSON schema tabanli dinamik form render eden container bilesen. Deger yonetimi, validasyon ve submit/reset aksiyonlarini bunyesinde toplar.",
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
    "importStatement": "import { FormRenderer } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FormRenderer",
    "variantAxes": [
      "mode: editable | readOnly",
      "layout: vertical | horizontal | grid"
    ],
    "stateModel": [
      "idle",
      "dirty",
      "submitting",
      "error"
    ],
    "previewStates": [
      "empty-form",
      "filled-form",
      "with-errors",
      "readOnly",
      "dark-theme"
    ],
    "behaviorModel": [
      "schema-driven field rendering",
      "controlled value management",
      "field-level error display",
      "submit and reset form actions",
      "loading state overlay",
      "read-only mode rendering",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "schema",
        "type": "FormSchema",
        "default": "-",
        "required": true,
        "description": "Form alanlarini ve yapilandirmasini tanimlayan JSON schema nesnesi."
      },
      {
        "name": "values",
        "type": "Record<string, any>",
        "default": "{}",
        "required": false,
        "description": "Form alanlarinin kontrol edilen deger haritasi."
      },
      {
        "name": "onChange",
        "type": "(values: Record<string, any>) => void",
        "default": "-",
        "required": false,
        "description": "Herhangi bir alan degeri degistiginde tetiklenen callback."
      },
      {
        "name": "onSubmit",
        "type": "(values: Record<string, any>) => void",
        "default": "-",
        "required": false,
        "description": "Form gonderildiginde tetiklenen callback."
      },
      {
        "name": "onReset",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Form sifirlandiginda tetiklenen callback."
      },
      {
        "name": "errors",
        "type": "Record<string, string>",
        "default": "{}",
        "required": false,
        "description": "Alan bazli hata mesajlari haritasi."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Tum form alanlarini salt okunur moda gecirir."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Form uzerinde yukleme durumu gostergesi aktif eder."
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
      "schema-driven field rendering",
      "error display per field",
      "submit/reset action flow"
    ],
    "regressionFocus": [
      "schema degisiminde alan yeniden render",
      "hata mesaji alan eslesmesi dogrulugu",
      "submit callback deger paritesi",
      "readOnly modda input devre disi birakilmasi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
