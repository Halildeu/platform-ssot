import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SearchInput",
  indexItem: {
    "name": "SearchInput",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "search",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Search & Filter",
    "demoMode": "live",
    "description": "Arama ikonu, temizle butonu, loading spinner ve klavye kisayol ipucu ile donatilmis arama input primitivei.",
    "sectionIds": [
      "component_library_management",
      "documentation_standards"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-1",
      "foundation-primitives",
      "stable",
      "input"
    ],
    "importStatement": "import { SearchInput } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SearchInput",
    "variantAxes": [
      "size: sm | md | lg",
      "clearable: on | off"
    ],
    "stateModel": [
      "disabled",
      "readOnly",
      "error",
      "loading",
      "clearable"
    ],
    "previewStates": [
      "loading",
      "disabled",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
      "loading spinner display",
      "clearable button toggle",
      "shortcut hint display",
      "disabled opacity"
    ],
    "props": [
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Input boyut varyantini belirler."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Loading spinner gosterir."
      },
      {
        "name": "clearable",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Deger varken temizle butonunu gosterir."
      },
      {
        "name": "onClear",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Temizle butonuna tiklandiginda cagrilacak callback."
      },
      {
        "name": "shortcutHint",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Klavye kisayol ipucu (orn. Cmd+K)."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aria-label degeri."
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Alan altinda gosterilen yardimci metin."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Input etkisiz durumunu kontrol eder."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Salt okunur durumu aktif eder."
      },
      {
        "name": "error",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hata durumu gorsel geri bildirimini aktif eder."
      },
      {
        "name": "value",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Controlled input degeri."
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Placeholder metni."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Input elementine ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "size matrisi",
      "loading ve clearable kombinasyonu",
      "shortcut hint display"
    ],
    "regressionFocus": [
      "clear button toggle logic",
      "loading spinner vs clear button precedence",
      "shortcut hint visibility"
    ]
  },
};

export default entry;
