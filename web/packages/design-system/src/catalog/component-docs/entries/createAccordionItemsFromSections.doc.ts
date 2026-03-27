import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createAccordionItemsFromSections",
  indexItem: {
  "name": "createAccordionItemsFromSections",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "disclosure",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "createAccordionPreset",
  "demoMode": "inspector",
  "description": "Typed section girdilerini nested disclosure yapisina donusturup AccordionItem dizisine normalize eder.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createAccordionItemsFromSections } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Accordion.stories.tsx"
  ]
},
  apiItem: {
  "name": "createAccordionItemsFromSections",
  "variantAxes": [
    "source: flat | nested",
    "content: explicit | derived",
    "nested-surface: compact | default"
  ],
  "stateModel": [
    "section tree normalization",
    "nested disclosure content composition"
  ],
    "previewStates": [],
    "behaviorModel": [
      "section tree normalization",
      "nested disclosure content composition"
    ],
  "props": [
    {
      "name": "sections",
      "type": "AccordionSectionInput[]",
      "default": "-",
      "required": true,
      "description": "Key, title, content ve opsiyonel child sections alanlarini tasiyan typed section agaci."
    },
    {
      "name": "options",
      "type": "CreateAccordionItemsFromSectionsOptions",
      "default": "{}",
      "required": false,
      "description": "Nested accordion davranisi, renderSectionContent ve compact nested surface varsayimlarini belirler."
    }
  ],
  "previewFocus": [
    "nested disclosure generation",
    "settings recipe adapter"
  ],
  "regressionFocus": [
    "section tree to item mapping",
    "nested accordion content parity"
  ]
},
};

export default entry;
