import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ErrorBoundary",
  indexItem: {
    "name": "ErrorBoundary",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "feedback",
    "subgroup": "error",
    "taxonomyGroupId": "feedback",
    "taxonomySubgroup": "Error Handling",
    "demoMode": "live",
    "description": "React Error Boundary sarmalayicisi; fallback UI, reset mekanizmasi ve onError callback ile hata yakalama ve kurtarma sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-2",
      "feedback",
      "stable",
      "error-handling"
    ],
    "importStatement": "import { ErrorBoundary } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ErrorBoundary",
    "variantAxes": ["fallback: default | custom render"],
    "stateModel": [
      "error / normal",
      "reset recovery"
    ],
    "previewStates": ["error-caught", "normal", "dark-theme"],
    "behaviorModel": [
      "React componentDidCatch error capture",
      "fallback UI rendering (static or render function)",
      "reset to clear error state",
      "onError callback for logging/reporting",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Sarmalanacak child componentler."
      },
      {
        "name": "fallback",
        "type": "ReactNode | ((error: Error, reset: () => void) => ReactNode)",
        "default": "DefaultFallback",
        "required": false,
        "description": "Hata durumunda gosterilecek statik element veya render fonksiyonu."
      },
      {
        "name": "onError",
        "type": "(error: Error, errorInfo: ErrorInfo) => void",
        "default": "-",
        "required": false,
        "description": "Hata yakalandiginda cagrilacak callback (loglama/raporlama icin)."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Wrapper div'e ek CSS sinifi."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Hata durumu icin erisilebilirlik etiketi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "'md'",
        "required": false,
        "description": "Bilesen boyut varyantini belirler."
      }
    ],
    "previewFocus": [
      "default fallback UI",
      "custom fallback render function",
      "reset recovery flow"
    ],
    "regressionFocus": [
      "error state capture",
      "reset state clearing",
      "onError callback chain"
    ]
  },
};

export default entry;
