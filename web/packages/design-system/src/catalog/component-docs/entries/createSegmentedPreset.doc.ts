import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createSegmentedPreset",
  indexItem: {
  "name": "createSegmentedPreset",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "segmented_toggle",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Toolbar, filter bar ve pill-tabs gibi canonical segmented presetlerini tek helper ile dondurur.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createSegmentedPreset } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Segmented.stories.tsx"
  ]
},
  apiItem: {
  "name": "createSegmentedPreset",
  "variantAxes": [
    "preset: toolbar | filter_bar | pill_tabs"
  ],
  "stateModel": [
    "preset to segmented props mapping"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preset to segmented props mapping"
    ],
  "props": [
    {
      "name": "kind",
      "type": "'toolbar' | 'filter_bar' | 'pill_tabs'",
      "default": "-",
      "required": true,
      "description": "Canonical segmented recipe'lerinden hangisinin dondurulecegini belirler."
    }
  ],
  "previewFocus": [
    "filter bar preset",
    "pill tabs preset"
  ],
  "regressionFocus": [
    "preset output parity"
  ]
},
};

export default entry;
