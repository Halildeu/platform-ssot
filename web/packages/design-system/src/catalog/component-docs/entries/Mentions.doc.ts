import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Mentions",
  indexItem: {
    "name": "Mentions",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "mentions",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Mentions & Tagging",
    "demoMode": "live",
    "description": "Bahsetme (mention) componenti; trigger karakter bazli oneri dropdown, ozel filtre, avatar destegi ve klavye navigasyonu sunar.",
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
    "importStatement": "import { Mentions } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Mentions",
    "variantAxes": [
      "size: sm | md | lg",
      "trigger: @ | # | custom"
    ],
    "stateModel": [
      "dropdown open / closed",
      "mention search active",
      "access-controlled interaction",
      "disabled",
      "readOnly",
      "loading"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
      "trigger character detection",
      "search text filtering",
      "keyboard arrow navigation in dropdown",
      "mention insertion into text",
      "focus restore after selection"
    ],
    "props": [
      {
        "name": "value",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Controlled textarea degeri."
      },
      {
        "name": "defaultValue",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "options",
        "type": "MentionOption[]",
        "default": "-",
        "required": true,
        "description": "Mevcut bahsetme secenekleri."
      },
      {
        "name": "trigger",
        "type": "string",
        "default": "@",
        "required": false,
        "description": "Bahsetme tetikleyici karakter."
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "Bir sey yazin...",
        "required": false,
        "description": "Textarea placeholder metni."
      },
      {
        "name": "rows",
        "type": "number",
        "default": "3",
        "required": false,
        "description": "Textarea satir sayisi."
      },
      {
        "name": "onValueChange",
        "type": "(value: string) => void",
        "default": "-",
        "required": false,
        "description": "Deger degistiginde cagrilacak callback."
      },
      {
        "name": "onSelect",
        "type": "(option: MentionOption) => void",
        "default": "-",
        "required": false,
        "description": "Bahsetme secildiginde cagrilacak callback."
      },
      {
        "name": "onSearch",
        "type": "(text: string, trigger: string) => void",
        "default": "-",
        "required": false,
        "description": "Arama metni degistiginde cagrilacak callback."
      },
      {
        "name": "filterOption",
        "type": "(input: string, option: MentionOption) => boolean",
        "default": "-",
        "required": false,
        "description": "Ozel filtre fonksiyonu."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Textarea label metni."
      },
      {
        "name": "error",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hata durumu."
      },
      {
        "name": "description",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Aciklama metni."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Boyut varyanti."
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
      "trigger detection + dropdown",
      "keyboard navigation",
      "mention insertion"
    ],
    "regressionFocus": [
      "cursor position after mention insert",
      "blur delayed close for click selection",
      "disabled option skip in keyboard nav"
    ]
  },
};

export default entry;
