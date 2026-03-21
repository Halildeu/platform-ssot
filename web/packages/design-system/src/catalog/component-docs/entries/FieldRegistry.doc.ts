import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FieldRegistry",
  indexItem: {
    "name": "FieldRegistry",
    "kind": "function",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder Registry",
    "demoMode": "planned",
    "description": "Form alan tiplerini bilesen esleme kayit defteri fonksiyonu; ozel alan tiplerinin FormRenderer ile entegrasyonunu saglar.",
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
    "importStatement": "import { FieldRegistry } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FieldRegistry",
    "variantAxes": [
      "scope: global | local"
    ],
    "stateModel": [
      "initialized",
      "registered",
      "resolved"
    ],
    "previewStates": [
      "default-types",
      "custom-type-registered",
      "dark-theme"
    ],
    "behaviorModel": [
      "field type to component mapping",
      "custom type registration",
      "type resolution at render time",
      "default type fallback",
      "registry scope isolation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "register",
        "type": "(type: string, component: ComponentType<FieldProps>) => void",
        "default": "-",
        "required": true,
        "description": "Yeni alan tipini bilesen ile esleyerek kayit eder."
      },
      {
        "name": "resolve",
        "type": "(type: string) => ComponentType<FieldProps> | null",
        "default": "-",
        "required": true,
        "description": "Alan tipine karsilik gelen bileseni cozumler."
      },
      {
        "name": "unregister",
        "type": "(type: string) => void",
        "default": "-",
        "required": false,
        "description": "Kayitli alan tipini kayittan cikarir."
      },
      {
        "name": "getRegisteredTypes",
        "type": "() => string[]",
        "default": "-",
        "required": false,
        "description": "Kayitli tum alan tiplerinin listesini dondurur."
      },
      {
        "name": "fallback",
        "type": "ComponentType<FieldProps>",
        "default": "TextInput",
        "required": false,
        "description": "Cozumlenemeyen alan tipleri icin varsayilan bilesen."
      }
    ],
    "previewFocus": [
      "type registration flow",
      "custom component resolution",
      "fallback behavior"
    ],
    "regressionFocus": [
      "tip cozumleme oncelik sirasi",
      "kayit/silme lifecycle tutarliligi",
      "fallback bilesen dogrulugu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
