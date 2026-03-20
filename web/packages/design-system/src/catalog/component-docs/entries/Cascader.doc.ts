import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Cascader",
  indexItem: {
    "name": "Cascader",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "cascader",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Cascader & Hierarchy",
    "demoMode": "live",
    "description": "Hiyerarsik secim componenti; cok seviyeli kolon dropdown, arama, hover/click genisletme ve klavye navigasyonu destegi.",
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
      "wave-3",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { Cascader } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Cascader",
    "variantAxes": [
      "size: sm | md | lg",
      "expandTrigger: click | hover"
    ],
    "stateModel": [
      "open / closed",
      "multi-column expansion",
      "search mode",
      "disabled",
      "readOnly",
      "error",
      "loading"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
      "multi-level column expansion",
      "click vs hover expand trigger",
      "searchable flat result mode",
      "keyboard arrow navigation across columns",
      "outside click close"
    ],
    "props": [
      {
        "name": "options",
        "type": "CascaderOption[]",
        "default": "-",
        "required": true,
        "description": "Hiyerarsik secenek agaci."
      },
      {
        "name": "value",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Controlled secili deger yolu."
      },
      {
        "name": "defaultValue",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "Select...",
        "required": false,
        "description": "Trigger placeholder metni."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Trigger boyut varyanti."
      },
      {
        "name": "multiple",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Coklu secim modu."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Arama input'unu gosterir."
      },
      {
        "name": "expandTrigger",
        "type": "'click' | 'hover'",
        "default": "click",
        "required": false,
        "description": "Alt seviyelerin nasil acilacagini belirler."
      },
      {
        "name": "displayRender",
        "type": "(labels: string[]) => string",
        "default": "-",
        "required": false,
        "description": "Secili deger gosterim formati."
      },
      {
        "name": "onValueChange",
        "type": "(value: string[], selectedOptions: CascaderOption[]) => void",
        "default": "-",
        "required": false,
        "description": "Secim degistiginde cagrilacak callback."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Form label metni."
      },
      {
        "name": "error",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hata durumu gostergesi."
      },
      {
        "name": "description",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Aciklama metni."
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
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yukleme gostergesi render eder ve etkilesimi devre disi birakir."
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Alan altinda gosterilen yardimci metin."
      },
      {
        "name": "access",
        "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
        "default": "full",
        "required": false,
        "description": "Policy tabanli gorunurluk ve etkilesim kontrolu."
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
      "multi-level column expansion",
      "search mode",
      "click vs hover trigger"
    ],
    "regressionFocus": [
      "keyboard navigation across columns",
      "outside click close",
      "search result selection",
      "column rebuild from value sync"
    ]
  },
};

export default entry;
