import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resolveMenuBarActiveValue",
  indexItem: {
  "name": "resolveMenuBarActiveValue",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "resolveMenuBarActiveValue",
  "demoMode": "inspector",
  "description": "Current value, current path ve enabled root item listesine gore aktif menubar item'ini deterministik olarak hesaplar.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resolveMenuBarActiveValue } from '@mfe/design-system';",
  "whereUsed": [
    "web/packages/design-system/src/components/MenuBar.tsx"
  ]
},
  apiItem: {
  "name": "resolveMenuBarActiveValue",
  "variantAxes": [
    "source: explicit-value | current-path | fallback-first-enabled"
  ],
  "stateModel": [
    "active root resolution",
    "path fallback"
  ],
    "previewStates": [],
    "behaviorModel": [
      "active root resolution",
      "path fallback"
    ],
  "props": [
    {
      "name": "args.currentValue / args.currentPath",
      "type": "string / string",
      "default": "- / -",
      "required": false,
      "description": "Aktif root'u once explicit value ile, sonra current path ile cozmeye calisir."
    },
    {
      "name": "args.items",
      "type": "MenuBarItem[]",
      "default": "[]",
      "required": true,
      "description": "Disabled state ve matchPath/href metadata'si tasiyan top-level menubar item listesi."
    }
  ],
  "previewFocus": [
    "route-aware active root resolution",
    "first-enabled fallback"
  ],
  "regressionFocus": [
    "explicit value precedence",
    "path resolution parity"
  ]
},
};

export default entry;
