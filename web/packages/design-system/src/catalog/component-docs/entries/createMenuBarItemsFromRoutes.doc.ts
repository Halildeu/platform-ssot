import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createMenuBarItemsFromRoutes",
  indexItem: {
  "name": "createMenuBarItemsFromRoutes",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Route veya app menu girdilerini MenuBarItem dizisine normalize eder ve aktif root badge override'ini uygular.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createMenuBarItemsFromRoutes } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/MenuBar.stories.tsx"
  ]
},
  apiItem: {
  "name": "createMenuBarItemsFromRoutes",
  "variantAxes": [
    "source: route | menu-destination",
    "current-badge: inherited | override"
  ],
  "stateModel": [
    "route to menu item normalization",
    "current route detection",
    "active root badge override"
  ],
    "previewStates": [],
    "behaviorModel": [
      "route to menu item normalization",
      "current route detection",
      "active root badge override"
    ],
  "props": [
    {
      "name": "routes",
      "type": "MenuBarRouteInput[]",
      "default": "[]",
      "required": true,
      "description": "Label, title, href, current ve submenu metadata'si tasiyan menu route girdileri."
    },
    {
      "name": "options.currentValue / options.currentPath / options.currentBadge",
      "type": "string / string / ReactNode",
      "default": "- / - / -",
      "required": false,
      "description": "Aktif root item tespitini override eder ve aktif route icin canonical badge gostermeyi saglar."
    }
  ],
  "previewFocus": [
    "route-aware menu normalization",
    "active menu badge override"
  ],
  "regressionFocus": [
    "label fallback order",
    "current route resolution parity"
  ]
},
};

export default entry;
