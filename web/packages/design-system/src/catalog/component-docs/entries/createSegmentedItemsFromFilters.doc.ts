import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createSegmentedItemsFromFilters",
  indexItem: {
  "name": "createSegmentedItemsFromFilters",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "segmented_toggle",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "createSegmentedPreset",
  "demoMode": "inspector",
  "description": "Filter girdilerini badge/count mantigi ile SegmentedItem dizisine normalize eder.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createSegmentedItemsFromFilters } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Segmented.stories.tsx"
  ]
},
  apiItem: {
  "name": "createSegmentedItemsFromFilters",
  "variantAxes": [
    "count-badge: shown | hidden-zero | custom-formatted",
    "filter-source: icon | description | count"
  ],
  "stateModel": [
    "filter to segmented item normalization",
    "count badge formatting"
  ],
    "previewStates": [],
    "behaviorModel": [
      "filter to segmented item normalization",
      "count badge formatting"
    ],
  "props": [
    {
      "name": "filters",
      "type": "SegmentedFilterInput[]",
      "default": "[]",
      "required": true,
      "description": "Label, count, icon ve disabled metadata'si tasiyan filter girdileri."
    },
    {
      "name": "options.showCountBadge / options.hideZeroCountBadge / options.formatCount",
      "type": "boolean / boolean / (count, filter) => ReactNode",
      "default": "true / false / -",
      "required": false,
      "description": "Badge'in gosterim kosulunu ve count formatinin canonical cikisini belirler."
    }
  ],
  "previewFocus": [
    "filter bar adapter",
    "count badge recipe"
  ],
  "regressionFocus": [
    "zero-count badge suppression",
    "custom count formatting"
  ]
},
};

export default entry;
