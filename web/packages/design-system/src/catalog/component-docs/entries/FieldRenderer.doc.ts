import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FieldRenderer",
  indexItem: {
    "name": "FieldRenderer",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder",
    "demoMode": "planned",
    "description": "Form schema icerisindeki tek bir alani tipine gore uygun input bilesenine donusturen render bileseni.",
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
    "importStatement": "import { FieldRenderer } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FieldRenderer",
    "variantAxes": [
      "fieldType: text | number | select | checkbox | date | custom",
      "state: idle | error | readOnly"
    ],
    "stateModel": [
      "idle",
      "focused",
      "error",
      "readOnly"
    ],
    "previewStates": [
      "text-field",
      "select-field",
      "with-error",
      "readOnly",
      "dark-theme"
    ],
    "behaviorModel": [
      "field type to input component mapping",
      "controlled value binding",
      "blur validation trigger",
      "error message display",
      "read-only state delegation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "field",
        "type": "FormFieldSchema",
        "default": "-",
        "required": true,
        "description": "Alan tipi, label, validasyon kurallari gibi bilgileri iceren schema nesnesi."
      },
      {
        "name": "value",
        "type": "any",
        "default": "-",
        "required": false,
        "description": "Alanin kontrol edilen degeri."
      },
      {
        "name": "onChange",
        "type": "(value: any) => void",
        "default": "-",
        "required": false,
        "description": "Alan degeri degistiginde tetiklenen callback."
      },
      {
        "name": "onBlur",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Alan fokusu kaybettiginde tetiklenen callback."
      },
      {
        "name": "error",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Alanla iliskili hata mesaji; varsa hata durumunu aktif eder."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Alani salt okunur moda gecirir."
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
        "description": "Alan boyut varyantini belirler."
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
      "field type component mapping",
      "error state rendering",
      "readOnly mode delegation"
    ],
    "regressionFocus": [
      "alan tipi esleme dogrulugu",
      "onChange/onBlur callback zamanlama",
      "hata mesaji goruntuleme/gizleme gecisleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
