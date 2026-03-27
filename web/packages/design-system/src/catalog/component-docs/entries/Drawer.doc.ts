import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Drawer",
  indexItem: {
    "name": "Drawer",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "overlays",
    "subgroup": "drawer",
    "taxonomyGroupId": "feedback",
    "taxonomySubgroup": "Drawer / Side Panel",
    "demoMode": "live",
    "description": "Slide-in side panel primitivei; dort kenardan gelen placement, boyut preseti ve overlay-engine entegrasyonu sunar.",
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
      "wave-1",
      "foundation-primitives",
      "stable",
      "overlay"
    ],
    "importStatement": "import { Drawer } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Drawer",
    "variantAxes": [
      "placement: left | right | top | bottom",
      "size: sm | md | lg | full"
    ],
    "stateModel": [
      "open / closed",
      "overlay dismiss",
      "escape dismiss"
    ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "open / closed controlled state",
      "overlay click dismiss",
      "escape key dismiss",
      "scroll lock on open",
      "focus restore on close",
      "layer-stack registration",
      "portal rendering",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "default": "false",
        "required": true,
        "description": "Drawer acik/kapali durumunu kontrol eder."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "default": "-",
        "required": true,
        "description": "Drawer kapatildiginda cagrilacak callback."
      },
      {
        "name": "placement",
        "type": "'left' | 'right' | 'top' | 'bottom'",
        "default": "right",
        "required": false,
        "description": "Drawer'in hangi kenardan kayarak gelecegini belirler."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg' | 'full'",
        "default": "md",
        "required": false,
        "description": "Panel genislik/yukseklik presetini belirler."
      },
      {
        "name": "title",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Drawer baslik icerigi."
      },
      {
        "name": "description",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Baslik altinda aciklama metni."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Drawer body icerigi."
      },
      {
        "name": "footer",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Footer aksiyon alani."
      },
      {
        "name": "closeOnOverlayClick",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Overlay backdrop tiklandiginda drawer kapatilir mi kararini verir."
      },
      {
        "name": "closeOnEscape",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Escape tusu ile kapatma davranisini kontrol eder."
      },
      {
        "name": "showOverlay",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Backdrop overlay gorunurlugunu kontrol eder."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Panel elementine ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "placement matrisi",
      "size preseti",
      "overlay dismiss matrix"
    ],
    "regressionFocus": [
      "scroll lock cleanup",
      "focus restore on close",
      "layer-stack registration parity",
      "portal rendering"
    ]
  },
};

export default entry;
