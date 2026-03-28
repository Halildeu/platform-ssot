import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ColorPicker",
  indexItem: {
    "name": "ColorPicker",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "color",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Color Picker",
    "demoMode": "live",
    "description": "Renk secici componenti; gradient picker, hue slider, hex/rgb/hsl input, preset paletler ve access-control destegi sunar.",
    "sectionIds": [
      "component_library_management",
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
      "wave-3",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { ColorPicker } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ColorPicker",
    "variantAxes": [
      "size: sm | md | lg",
      "format: hex | rgb | hsl"
    ],
    "stateModel": [
      "open / closed popover",
      "controlled / uncontrolled color",
      "access-controlled interaction",
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
      "swatch trigger popover toggle",
      "saturation-value gradient click",
      "hue slider drag",
      "hex text input with validation",
      "preset palette selection"
    ],
    "props": [
      {
        "name": "value",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Controlled renk degeri (hex string)."
      },
      {
        "name": "defaultValue",
        "type": "string",
        "default": "#3b82f6",
        "required": false,
        "description": "Uncontrolled baslangic renk degeri."
      },
      {
        "name": "format",
        "type": "'hex' | 'rgb' | 'hsl'",
        "default": "hex",
        "required": false,
        "description": "Input gosterim formati."
      },
      {
        "name": "presets",
        "type": "ColorPickerPreset[]",
        "default": "-",
        "required": false,
        "description": "Onceden tanimli renk paletleri."
      },
      {
        "name": "showInput",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Metin input gorunurlugu."
      },
      {
        "name": "showPresets",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Preset paletler bolumu gorunurlugu."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Gorsel boyut varyanti."
      },
      {
        "name": "onValueChange",
        "type": "(color: string) => void",
        "default": "-",
        "required": false,
        "description": "Renk degistiginde cagrilacak callback."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Picker uzerinde gosterilen label."
      },
      {
        "name": "description",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Label altinda aciklama metni."
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
        "name": "error",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Dogrulama geri bildirimi."
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
      "gradient picker + hue slider",
      "preset palette interaction",
      "format switching"
    ],
    "regressionFocus": [
      "HSV-to-hex conversion accuracy",
      "hex input validation and revert",
      "preset selection sync",
      "access-controlled popover guard"
    ]
  },
};

export default entry;
