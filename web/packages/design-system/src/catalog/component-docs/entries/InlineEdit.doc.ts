import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "InlineEdit",
  indexItem: {
    "name": "InlineEdit",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "inputs",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Double-click inline duzenleme",
    "demoMode": "live",
    "description": "Text, number ve select giris tiplerini destekleyen, cift tikla duzenleme moduna gecen inline editing bileseni; validasyon ve async kaydetme destegi sunar.",
    "sectionIds": [
      "component_library_management"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility"
    ],
    "tags": [
      "enterprise",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_14_enterprise_suite",
    "acceptanceContractId": "ui-library-wave-14-enterprise-suite-v1",
    "importStatement": "import { InlineEdit } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "InlineEdit",
    "variantAxes": [
      "type: text | number | select"
    ],
    "stateModel": [
      "display",
      "editing",
      "saving",
      "error"
    ],
    "previewStates": ["edit-mode", "validation-error", "dark-theme"],
    "behaviorModel": [
      "double-click to enter edit mode",
      "Enter/Tab to save, Escape to cancel",
      "validation with error display",
      "async save with loading state",
      "auto-focus and select on edit",
      "format display value"
    ],
    "props": [
      { "name": "value", "type": "string", "default": "-", "required": true, "description": "Mevcut gorunen deger." },
      { "name": "type", "type": "InlineEditType", "default": "text", "required": false, "description": "Duzenleme modunda render edilen giris tipi." },
      { "name": "options", "type": "SelectOption[]", "default": "[]", "required": false, "description": "Select tipi icin secenek listesi." },
      { "name": "placeholder", "type": "string", "default": "Click to edit", "required": false, "description": "Deger bos oldugunda gosterilen metin." },
      { "name": "validate", "type": "(value: string) => string | null", "default": "-", "required": false, "description": "Hata mesaji veya null donduren validasyon fonksiyonu." },
      { "name": "onSave", "type": "(value: string) => void | Promise<void>", "default": "-", "required": true, "description": "Kullanici duzenlemeyi onayladiginda yeni degerle cagirilir." },
      { "name": "formatDisplay", "type": "(value: string) => string", "default": "-", "required": false, "description": "Gosterim modunda degeri formatlar." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "display to edit transition",
      "text vs select input types",
      "validation error display"
    ],
    "regressionFocus": [
      "async save hata yonetimi",
      "bos deger display",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
