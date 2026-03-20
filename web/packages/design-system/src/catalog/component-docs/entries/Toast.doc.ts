import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Toast",
  indexItem: {
    "name": "Toast",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "feedback",
    "subgroup": "toast",
    "taxonomyGroupId": "state_feedback",
    "taxonomySubgroup": "Toast & Notification",
    "demoMode": "live",
    "description": "Toast bildirim componenti; pozisyon, sure, maksimum gosterim limiti ve provider tabanli yonetim destegi sunar.",
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
      "feedback",
      "stable"
    ],
    "importStatement": "import { Toast } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Toast",
    "variantAxes": [
      "position: top | top-right | top-left | bottom | bottom-right | bottom-left"
    ],
    "stateModel": [
      "toast queue management",
      "auto-dismiss timer",
      "max visible limit"
    ],
    "previewStates": ["info", "success", "warning", "error", "dark-theme"],
    "behaviorModel": [
      "provider-based toast management",
      "configurable position",
      "auto-dismiss with duration",
      "max visible toast limit",
      "stacking and queue overflow",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "position",
        "type": "'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'",
        "default": "top-right",
        "required": false,
        "description": "Toast bildirim pozisyonu."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "3000",
        "required": false,
        "description": "Otomatik kapanma suresi (ms)."
      },
      {
        "name": "maxVisible",
        "type": "number",
        "default": "5",
        "required": false,
        "description": "Ayni anda gorunen maksimum toast sayisi."
      },
      {
        "name": "title",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Overlay baslik icerigi."
      },
      {
        "name": "description",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Overlay aciklama icerigi."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Provider icinde sarilacak uygulama icerigi."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Bilesen boyut varyantini belirler."
      }
    ],
    "previewFocus": [
      "position matrix",
      "stacking behavior",
      "auto-dismiss timing"
    ],
    "regressionFocus": [
      "queue overflow handling",
      "duration timer cleanup on unmount",
      "position change re-render",
      "concurrent toast management"
    ]
  },
};

export default entry;
