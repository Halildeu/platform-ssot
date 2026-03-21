import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createAccordionPreset",
  indexItem: {
  "name": "createAccordionPreset",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "disclosure",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "FAQ, compact disclosure ve settings gibi canonical accordion varsayimlarini tek helper ile dondurur.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createAccordionPreset } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Accordion.stories.tsx"
  ]
},
  apiItem: {
  "name": "createAccordionPreset",
  "variantAxes": [
    "preset: faq | compact | settings"
  ],
  "stateModel": [
    "preset to accordion props mapping"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preset to accordion props mapping"
    ],
  "props": [
    {
      "name": "kind",
      "type": "'faq' | 'compact' | 'settings'",
      "default": "-",
      "required": true,
      "description": "Canonical disclosure presetlerinden hangisinin dondurulecegini belirler."
    }
  ],
  "previewFocus": [
    "compact disclosure recipe",
    "faq preset"
  ],
  "regressionFocus": [
    "preset output parity"
  ]
},
};

export default entry;
