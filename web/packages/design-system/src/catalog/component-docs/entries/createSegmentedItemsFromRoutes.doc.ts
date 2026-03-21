import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createSegmentedItemsFromRoutes",
  indexItem: {
  "name": "createSegmentedItemsFromRoutes",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "segmented_toggle",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Route girdilerini SegmentedItem dizisine normalize eder ve current route icin badge override'i uygular.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createSegmentedItemsFromRoutes } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Segmented.stories.tsx"
  ]
},
  apiItem: {
  "name": "createSegmentedItemsFromRoutes",
  "variantAxes": [
    "route-source: title | label | value fallback",
    "current-badge: inherited | override"
  ],
  "stateModel": [
    "route to segmented item normalization",
    "current route detection"
  ],
    "previewStates": [],
    "behaviorModel": [
      "route to segmented item normalization",
      "current route detection"
    ],
  "props": [
    {
      "name": "routes",
      "type": "SegmentedRouteInput[]",
      "default": "[]",
      "required": true,
      "description": "Label, title, current ve badge metadata'si tasiyan route girdileri."
    },
    {
      "name": "options.currentValue / options.currentBadge",
      "type": "string / ReactNode",
      "default": "- / -",
      "required": false,
      "description": "Aktif route degerini override eder ve aktif route icin canonical badge gostermeyi saglar."
    }
  ],
  "previewFocus": [
    "route tab adapter",
    "current route badge override"
  ],
  "regressionFocus": [
    "label fallback order",
    "current route detection parity"
  ]
},
};

export default entry;
