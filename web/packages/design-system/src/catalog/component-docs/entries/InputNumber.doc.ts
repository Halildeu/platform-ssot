import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "InputNumber",
  indexItem: {
    "name": "InputNumber",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "number",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Numeric Input",
    "demoMode": "live",
    "description": "Sayisal input componenti; artirma/azaltma butonlari, min/max clamping, step, precision, prefix/suffix ve klavye ok destegi sunar.",
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
    "importStatement": "import { InputNumber } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "InputNumber",
    "variantAxes": [
      "size: sm | md | lg",
      "controls: visible | hidden"
    ],
    "stateModel": [
      "disabled",
      "readOnly",
      "invalid",
      "loading",
      "increment/decrement boundary"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "invalid",
      "dark-theme"
    ],
    "behaviorModel": [
      "increment/decrement button stepping",
      "keyboard ArrowUp/ArrowDown stepping",
      "shift+arrow 10x multiplier",
      "min/max clamping on blur",
      "precision rounding"
    ],
    "props": [
      {
        "name": "value",
        "type": "number | null",
        "default": "-",
        "required": false,
        "description": "Controlled sayisal deger."
      },
      {
        "name": "defaultValue",
        "type": "number | null",
        "default": "-",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "onChange",
        "type": "(value: number | null) => void",
        "default": "-",
        "required": false,
        "description": "Deger degistiginde cagrilacak callback."
      },
      {
        "name": "min",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Minimum izin verilen deger."
      },
      {
        "name": "max",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Maksimum izin verilen deger."
      },
      {
        "name": "step",
        "type": "number",
        "default": "1",
        "required": false,
        "description": "Artirma/azaltma adimi."
      },
      {
        "name": "precision",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Gosterilecek ondalik basamak sayisi."
      },
      {
        "name": "prefix",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Input oncesi gorsel slot."
      },
      {
        "name": "suffix",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Input sonrasi gorsel slot."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Input boyut varyanti."
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
        "description": "Salt okunur durumu."
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
        "description": "Hata mesaji."
      },
      {
        "name": "label",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Input label."
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
        "description": "Yardimci ipucu."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yukleme gostergesi render eder ve input'u devre disi birakir."
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
      "step + precision combo",
      "min/max boundary clamping",
      "prefix/suffix slots"
    ],
    "regressionFocus": [
      "blur clamping and precision rounding",
      "shift+arrow 10x multiplier",
      "increment/decrement button disabled state at boundaries",
      "ARIA spinbutton pattern"
    ]
  },
};

export default entry;
