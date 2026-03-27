import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FloatButton",
  indexItem: {
    "name": "FloatButton",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "actions",
    "subgroup": "float",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "Float Button & FAB",
    "demoMode": "live",
    "description": "Sabit pozisyonlu aksiyon butonu (FAB); speed-dial grup modu, badge, tooltip ve access-control destegi sunar.",
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
      "actions",
      "stable"
    ],
    "importStatement": "import { FloatButton } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FloatButton",
    "variantAxes": [
      "shape: circle | square",
      "size: sm | md | lg",
      "position: bottom-right | bottom-left | top-right | top-left"
    ],
    "stateModel": [
      "group open / closed",
      "badge indicator",
      "access-controlled interaction"
    ],
    "previewStates": [
      "disabled",
      "speed-dial-open",
      "badge-indicator",
      "dark-theme"
    ],
    "behaviorModel": [
      "speed-dial group expand/collapse",
      "click vs hover trigger for group",
      "escape key close",
      "badge dot and count display",
      "fixed viewport positioning"
    ],
    "props": [
      {
        "name": "icon",
        "type": "ReactNode",
        "default": "PlusIcon",
        "required": false,
        "description": "Buton icindeki ikon."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Ikon yaninda gosterilecek metin."
      },
      {
        "name": "tooltip",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Tooltip metni."
      },
      {
        "name": "shape",
        "type": "'circle' | 'square'",
        "default": "circle",
        "required": false,
        "description": "Buton sekil varyanti."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Gorsel boyut varyanti."
      },
      {
        "name": "position",
        "type": "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
        "default": "bottom-right",
        "required": false,
        "description": "Viewport uzerindeki sabit pozisyon."
      },
      {
        "name": "offset",
        "type": "[number, number]",
        "default": "[24, 24]",
        "required": false,
        "description": "Kenar boslugu [yatay, dikey] px cinsinden."
      },
      {
        "name": "badge",
        "type": "number | boolean",
        "default": "-",
        "required": false,
        "description": "Badge gostergesi; sayi veya dot modu."
      },
      {
        "name": "onClick",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Primary buton tiklandiginda cagrilacak callback."
      },
      {
        "name": "items",
        "type": "FloatButtonGroupItem[]",
        "default": "-",
        "required": false,
        "description": "Speed-dial grup ogeleri."
      },
      {
        "name": "trigger",
        "type": "'click' | 'hover'",
        "default": "click",
        "required": false,
        "description": "Grup menusunun nasil tetiklenecegini belirler."
      },
      {
        "name": "open",
        "type": "boolean",
        "default": "-",
        "required": false,
        "description": "Controlled grup menu acik durumu."
      },
      {
        "name": "onOpenChange",
        "type": "(open: boolean) => void",
        "default": "-",
        "required": false,
        "description": "Grup menu durumu degistiginde cagrilacak callback."
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
        "description": "Root wrapper'a ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "position matrisi",
      "speed-dial group expansion",
      "badge indicator variants"
    ],
    "regressionFocus": [
      "escape key close cleanup",
      "hover trigger group toggle",
      "position offset rendering",
      "access-controlled interaction guard"
    ]
  },
};

export default entry;
