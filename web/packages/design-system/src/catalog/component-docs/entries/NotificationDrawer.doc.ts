import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "NotificationDrawer",
  indexItem: {
  "name": "NotificationDrawer",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "feedback",
  "subgroup": "toast_notification",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Toast / Notification",
  "demoMode": "live",
  "description": "NotificationPanel'i sagdan kayan overlay drawer preset'i olarak paketler ve shell notification center benzeri deneyimi reusable hale getirir.",
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
  "importStatement": "import { NotificationDrawer } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/widgets/app-shell/ui/NotificationCenter.ui.tsx",
    "web/stories/NotificationDrawer.stories.tsx"
  ],
    "dependsOn": ["NotificationPanel"]
},
  apiItem: {
  "name": "NotificationDrawer",
  "variantAxes": [
    "visibility: open | closed",
    "dismiss: overlay | escape | close-button | programmatic",
    "lifecycle: destroy-on-hidden | keep-mounted",
    "content: plain feed | filtered feed | selectable batch triage",
    "surface: portal | inline | custom width"
  ],
  "stateModel": [
    "controlled open state",
    "overlay close reason dispatch",
    "escape and overlay dismiss guards",
    "NotificationPanel prop passthrough",
    "access-aware close affordance",
    "portal or inline overlay rendering"
  ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled open state",
      "overlay close reason dispatch",
      "escape and overlay dismiss guards",
      "NotificationPanel prop passthrough",
      "access-aware close affordance",
      "portal or inline overlay rendering",
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "open / onClose",
      "type": "boolean / (reason: OverlayCloseReason) => void",
      "default": "- / -",
      "required": true,
      "description": "Drawer gorunurlugunu consumer katmanda kontrol eder ve close-button, overlay veya escape kaynakli kapanis sebebini raporlar."
    },
    {
      "name": "items / title / summaryLabel",
      "type": "NotificationSurfaceItem[] / ReactNode / ReactNode",
      "default": "- / 'Bildirimler' / -",
      "required": true,
      "description": "Notification feed icerigini, drawer basligini ve header ozet sinyalini tanimlar."
    },
    {
      "name": "showFilters / grouping / dateGrouping / selectable",
      "type": "boolean / 'none' | 'priority' / 'none' | 'relative-day' / boolean",
      "default": "false / 'none' / 'none' / false",
      "required": false,
      "description": "Panel icindeki filtre segmentlerini, priority veya tarih bazli gruplamayi ve batch triage secim yuzeyini acar."
    },
    {
      "name": "onMarkAllRead / onClear / onRemoveItem / onMarkSelectedRead / onRemoveSelected",
      "type": "() => void / () => void / (id: string) => void / (ids: string[]) => void / (ids: string[]) => void",
      "default": "- / - / - / - / -",
      "required": false,
      "description": "NotificationPanel icindeki header ve selection aksiyonlarini drawer seviyesinde disari cikarir."
    },
    {
      "name": "closeLabel / closeOnOverlayClick / closeOnEscape",
      "type": "string / boolean / boolean",
      "default": "'Bildirim merkezini kapat' / true / true",
      "required": false,
      "description": "Kapatma affordance etiketini ve overlay ya da escape kaynakli dismiss politikasini belirler."
    },
    {
      "name": "keepMounted / destroyOnHidden / disablePortal / portalTarget",
      "type": "boolean / boolean / boolean / HTMLElement | null",
      "default": "false / true / false / document.body",
      "required": false,
      "description": "Overlay yasam dongusunu ve panelin portal veya inline render stratejisini kontrol eder."
    },
    {
      "name": "dialogLabel / widthClassName / panelClassName / access",
      "type": "string / string / string / 'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "'Bildirimler' / 'max-w-md' / '' / 'full'",
      "required": false,
      "description": "Dialog aria label'ini, drawer genisligini, panel stil uzantisini ve policy tabanli gorunurluk-etkilesim seviyesini tanimlar."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "Bildirimler",
      "required": false,
      "description": "Drawer baslik icerigi."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay aciklama icerigi."
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
      "description": "Drawer panel boyut varyantini belirler."
    }
  ],
  "previewFocus": [
    "shell notification center parity",
    "priority-grouped inbox triage",
    "selection batch actions",
    "close reason observability"
  ],
  "regressionFocus": [
    "overlay, escape and close-button reasons",
    "keepMounted and destroyOnHidden parity",
    "NotificationPanel callback passthrough",
    "readonly or disabled close guard",
    "portal and inline rendering parity"
  ]
},
};

export default entry;
