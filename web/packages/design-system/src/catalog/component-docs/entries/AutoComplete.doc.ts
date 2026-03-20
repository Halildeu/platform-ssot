import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AutoComplete",
  indexItem: {
    "name": "AutoComplete",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "autocomplete",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Autocomplete & Combobox",
    "demoMode": "live",
    "description": "Input + Combobox fusyon componenti; type-ahead filtreleme, async arama, klavye navigasyonu ve ARIA combobox deseni destegi.",
    "sectionIds": [
      "component_library_management",
      "state_feedback",
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
      "wave-2",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { Autocomplete } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "AutoComplete",
    "variantAxes": [
      "size: sm | md | lg",
      "mode: freeform | option-only"
    ],
    "stateModel": [
      "open / closed dropdown",
      "loading",
      "invalid",
      "disabled",
      "readOnly"
    ],
    "previewStates": [
      "loading",
      "disabled",
      "invalid",
      "dark-theme"
    ],
    "behaviorModel": [
      "type-ahead filtering",
      "async search with debounce",
      "keyboard arrow navigation",
      "outside click close",
      "freeform vs option-only selection"
    ],
    "props": [
      {
        "name": "value",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Controlled input degeri."
      },
      {
        "name": "defaultValue",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "onChange",
        "type": "(value: string) => void",
        "default": "-",
        "required": false,
        "description": "Deger degistiginde cagrilacak callback."
      },
      {
        "name": "options",
        "type": "AutocompleteOption[]",
        "default": "-",
        "required": true,
        "description": "Oneri secenekleri listesi."
      },
      {
        "name": "onSearch",
        "type": "(query: string) => void",
        "default": "-",
        "required": false,
        "description": "Async arama handler; debounce ile input degisikliginde cagirilir."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Dropdown iceriginde loading durumunu gosterir."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Input boyut varyantini belirler."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Input etkisiz durumu."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Salt okunur durumu aktif eder."
      },
      {
        "name": "invalid",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Gecersiz durum gostergesi."
      },
      {
        "name": "error",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Hata mesaji icerigi."
      },
      {
        "name": "label",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Input label icerigi."
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
        "description": "Yardimci ipucu metni."
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Input placeholder metni."
      },
      {
        "name": "allowCustomValue",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Serbest metin girimine izin verilip verilmeyecegini belirler."
      },
      {
        "name": "maxSuggestions",
        "type": "number",
        "default": "10",
        "required": false,
        "description": "Gosterilecek maksimum oneri sayisi."
      },
      {
        "name": "fullWidth",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Tam genislik modu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "async search flow",
      "keyboard navigation",
      "option filtering"
    ],
    "regressionFocus": [
      "debounce timer cleanup",
      "outside click close",
      "freeform vs option-only blur behavior",
      "ARIA combobox pattern"
    ]
  },
};

export default entry;
