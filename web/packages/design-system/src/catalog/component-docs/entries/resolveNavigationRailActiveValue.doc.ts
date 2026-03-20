import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resolveNavigationRailActiveValue",
  indexItem: {
  "name": "resolveNavigationRailActiveValue",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Current value, current path ve enabled item listesine gore aktif navigation rail destination'ini deterministik olarak hesaplar.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resolveNavigationRailActiveValue } from '@mfe/design-system';",
  "whereUsed": [
    "web/packages/design-system/src/components/NavigationRail.tsx"
  ]
},
  apiItem: {
  "name": "resolveNavigationRailActiveValue",
  "variantAxes": [
    "source: explicit-value | current-path | fallback-first-enabled"
  ],
  "stateModel": [
    "active destination resolution",
    "path fallback"
  ],
    "previewStates": [],
    "behaviorModel": [
      "active destination resolution",
      "path fallback"
    ],
  "props": [
    {
      "name": "args.currentValue / args.currentPath",
      "type": "string / string",
      "default": "- / -",
      "required": false,
      "description": "Aktif destination'i once explicit value ile, sonra current path ile cozmeye calisir."
    },
    {
      "name": "args.items",
      "type": "NavigationRailItem[]",
      "default": "[]",
      "required": true,
      "description": "Disabled state ve matchPath/href metadata'si tasiyan destination listesi."
    }
  ],
  "previewFocus": [
    "route-aware active value resolution",
    "first-enabled fallback"
  ],
  "regressionFocus": [
    "explicit value precedence",
    "path resolution parity"
  ]
},
};

export default entry;
