import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createMenuBarPreset",
  indexItem: {
  "name": "createMenuBarPreset",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Workspace header, ops command bar ve ghost utility gibi canonical menubar recipe'lerini tek helper ile dondurur.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createMenuBarPreset } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/MenuBar.stories.tsx"
  ]
},
  apiItem: {
  "name": "createMenuBarPreset",
  "variantAxes": [
    "preset: workspace_header | ops_command_bar | ghost_utility"
  ],
  "stateModel": [
    "preset to menu bar props mapping"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preset to menu bar props mapping"
    ],
  "props": [
    {
      "name": "kind",
      "type": "'workspace_header' | 'ops_command_bar' | 'ghost_utility'",
      "default": "-",
      "required": true,
      "description": "Canonical menubar recipe'lerinden hangisinin dondurulecegini belirler."
    }
  ],
  "previewFocus": [
    "workspace header preset",
    "ghost utility preset"
  ],
  "regressionFocus": [
    "preset output parity"
  ]
},
};

export default entry;
