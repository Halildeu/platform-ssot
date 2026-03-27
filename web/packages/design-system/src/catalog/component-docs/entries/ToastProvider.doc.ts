import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ToastProvider",
  indexItem: {
  "name": "ToastProvider",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "feedback",
  "subgroup": "toast_notification",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Toast / Notification",
  "demoMode": "live",
  "description": "Global toast stack, placement ve dismiss davranisini context tabanli reusable provider yuzeyinde toplar.",
  "sectionIds": [
    "state_feedback",
    "integration_distribution",
    "component_library_management"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "importStatement": "import { ToastProvider } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/stories/ToastProvider.stories.tsx"
  ]
},
  apiItem: {
  "name": "ToastProvider",
  "variantAxes": [
    "placement: top-left | top-center | top-right | bottom-left | bottom-center | bottom-right",
    "queue: newest-on-top | append-bottom",
    "capacity: bounded stack | overflow trim",
    "rendering: portal | inline viewport",
    "severity: success | info | warning | error | loading"
  ],
  "stateModel": [
    "context-backed toast registry",
    "push and dismiss lifecycle",
    "auto-hide timer scheduling",
    "manual dismiss and dismissAll flow",
    "maxVisible trimming",
    "loading toast persistent duration override",
    "portal target resolution"
  ],
    "previewStates": [
      "severity-variants",
      "stacked-queue",
      "dark-theme"
    ],
    "behaviorModel": [
      "context-backed toast registry",
      "push and dismiss lifecycle",
      "auto-hide timer scheduling",
      "manual dismiss and dismissAll flow",
      "maxVisible trimming",
      "loading toast persistent duration override",
      "portal target resolution",
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Toast context'ini saglayacak uygulama veya story shell agacini sarar."
    },
    {
      "name": "placement / viewportClassName",
      "type": "ToastPlacement / string",
      "default": "'top-right' / ''",
      "required": false,
      "description": "Toast viewport'unun ekrandaki yerlesimini ve viewport seviyesindeki class override yuzeyini belirler."
    },
    {
      "name": "autoHideDuration / maxVisible / newestOnTop",
      "type": "number / number / boolean",
      "default": "4500 / 4 / true",
      "required": false,
      "description": "Varsayilan auto-hide suresini, ayni anda gorunen toast sinirini ve yeni toast'larin stack basina eklenip eklenmeyecegini kontrol eder."
    },
    {
      "name": "disablePortal / portalTarget",
      "type": "boolean / HTMLElement | null",
      "default": "false / document.body",
      "required": false,
      "description": "Toast viewport'unun body portalina mi yoksa mevcut agac icine mi render edilecegini belirler."
    },
    {
      "name": "closeLabel / toastClassName",
      "type": "string / string",
      "default": "'Bildirimi kapat' / ''",
      "required": false,
      "description": "Alert close affordance etiketini ve tekil toast container class override yuzeyini tanimlar."
    },
    {
      "name": "viewportTestId / toastTestId",
      "type": "string / string",
      "default": "- / -",
      "required": false,
      "description": "Test harness ve runtime smoke senaryolari icin viewport ve toast node'larina sabit test id baglar."
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
      "name": "toast api",
      "type": "push | dismiss | dismissAll | success | info | warning | error | loading",
      "default": "-",
      "required": false,
      "description": "Context uzerinden expose edilen imperative API; consumer katmanlar useToast hook'u ile severity bazli bildirim akislari uretir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Viewport root element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Toast bildirim boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "global app-shell toast lane",
    "severity variant triggers",
    "placement and queue policy",
    "inline viewport for local preview"
  ],
  "regressionFocus": [
    "auto-hide timer cleanup",
    "maxVisible trimming parity",
    "loading toast non-expiring default",
    "portal target resolution",
    "dismiss and dismissAll callback chain"
  ]
},
};

export default entry;
