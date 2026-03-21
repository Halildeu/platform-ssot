import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createNavigationRailPreset",
  indexItem: {
  "name": "createNavigationRailPreset",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Workspace, compact utility ve ops side nav gibi canonical navigation rail presetlerini tek helper ile dondurur.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createNavigationRailPreset } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/NavigationRail.stories.tsx"
  ]
},
  apiItem: {
  "name": "createNavigationRailPreset",
  "variantAxes": [
    "preset: workspace | compact_utility | ops_side_nav"
  ],
  "stateModel": [
    "preset to navigation rail props mapping"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preset to navigation rail props mapping"
    ],
  "props": [
    {
      "name": "kind",
      "type": "'workspace' | 'compact_utility' | 'ops_side_nav'",
      "default": "-",
      "required": true,
      "description": "Canonical navigation rail recipe'lerinden hangisinin dondurulecegini belirler."
    }
  ],
  "previewFocus": [
    "ops side navigation preset",
    "compact utility preset"
  ],
  "regressionFocus": [
    "preset output parity"
  ]
},
};

export default entry;
