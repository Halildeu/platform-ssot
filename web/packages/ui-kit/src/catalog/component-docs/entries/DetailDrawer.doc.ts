import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DetailDrawer",
  indexItem: {
  "name": "DetailDrawer",
  "kind": "component",
  "importStatement": "import { DetailDrawer } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessRoleDrawer.ui.tsx",
    "web/apps/mfe-audit/src/app/components/AuditDetailDrawer.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-users/src/widgets/user-management/ui/UserDetailDrawer.ui.tsx"
  ],
  "group": "overlays",
  "subgroup": "drawers",
  "tags": [
    "detail",
    "drawer",
    "overlay",
    "stable",
    "wave-5"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Drawer / Side panel",
  "demoMode": "live",
  "description": "Detay, audit ve summary akislari icin sekmeli side panel primitivei.",
  "sectionIds": [
    "component_library_management",
    "overlay_components",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "confirmation_receipts_and_traceability",
  "roadmapWaveId": "wave_5_overlay",
  "acceptanceContractId": "ui-library-wave-5-overlay-v1"
},
  apiItem: {
  "name": "DetailDrawer",
  "variantAxes": [
    "tabs: summary | audit | details",
    "surface: review | evidence | readonly",
    "width: lg | xl"
  ],
  "stateModel": [
    "open / closed",
    "active tab",
    "escape dismiss",
    "readonly access hint"
  ],
  "props": [
    {
      "name": "open",
      "type": "boolean",
      "default": "false",
      "required": true,
      "description": "Drawer acikligini controlled olarak yonetir."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header title ve aria label kaynagi."
    },
    {
      "name": "tabs",
      "type": "DetailDrawerTab[]",
      "default": "-",
      "required": true,
      "description": "Sekmeli icerik yapisini tanimlar."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve readonly nedeni."
    },
    {
      "name": "onClose",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Dismiss callbacki."
    }
  ],
  "previewFocus": [
    "tabbed review drawer",
    "readonly evidence drawer",
    "audit/status tab switch"
  ],
  "regressionFocus": [
    "tab aria wiring",
    "escape close parity",
    "readonly badge visibility"
  ]
},
};

export default entry;
