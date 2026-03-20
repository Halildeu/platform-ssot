import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createNavigationDestinationItems",
  indexItem: {
  "name": "createNavigationDestinationItems",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Route veya destination girdilerini NavigationRailItem dizisine normalize eder ve aktif destination badge override'ini uygular.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createNavigationDestinationItems } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/NavigationRail.stories.tsx"
  ]
},
  apiItem: {
  "name": "createNavigationDestinationItems",
  "variantAxes": [
    "source: route | destination",
    "current-badge: inherited | override"
  ],
  "stateModel": [
    "destination normalization",
    "current destination badge override"
  ],
    "previewStates": [],
    "behaviorModel": [
      "destination normalization",
      "current destination badge override"
    ],
  "props": [
    {
      "name": "destinations",
      "type": "NavigationDestinationInput[]",
      "default": "[]",
      "required": true,
      "description": "Label, title, href, current ve badge metadata'si tasiyan navigation girdileri."
    },
    {
      "name": "options.currentValue / options.currentPath / options.currentBadge",
      "type": "string / string / ReactNode",
      "default": "- / - / -",
      "required": false,
      "description": "Aktif destination tespitini ve aktif item icin canonical badge override'ini yonetir."
    }
  ],
  "previewFocus": [
    "route-aware side navigation",
    "destination badge override"
  ],
  "regressionFocus": [
    "label fallback order",
    "current destination resolution parity"
  ]
},
};

export default entry;
