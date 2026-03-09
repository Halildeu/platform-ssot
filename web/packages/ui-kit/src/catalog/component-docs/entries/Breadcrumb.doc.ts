import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Breadcrumb",
  indexItem: {
  "name": "Breadcrumb",
  "kind": "component",
  "importStatement": "import { Breadcrumb } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "navigation",
  "subgroup": "breadcrumb",
  "tags": [
    "navigation",
    "stable",
    "wave-2"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Breadcrumb",
  "demoMode": "live",
  "description": "Breadcrumb primitivei; route-aware yol izi, collapse ve current-page davranisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "domain_based_information_architecture",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1"
},
  apiItem: {
  "name": "Breadcrumb",
  "variantAxes": [
    "density: default | compact",
    "collapse: full | middle-collapse",
    "itemType: href | action | current | disabled"
  ],
  "stateModel": [
    "current page",
    "collapsed middle",
    "disabled crumb",
    "route-aware reuse"
  ],
  "props": [
    {
      "name": "items",
      "type": "BreadcrumbItem[]",
      "default": "-",
      "required": true,
      "description": "Path segmentlerini, href/onClick ve disabled/current davranisini tasir."
    },
    {
      "name": "maxItems",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Uzun pathlerde middle collapse davranisini acar."
    },
    {
      "name": "separator",
      "type": "ReactNode",
      "default": "/",
      "required": false,
      "description": "Marka veya domain odakli ayirici varyasyonu."
    }
  ],
  "previewFocus": [
    "basic path",
    "collapsed path",
    "PageLayout reuse"
  ],
  "regressionFocus": [
    "aria-current semantics",
    "collapse determinism",
    "disabled/current visual separation"
  ]
},
};

export default entry;
