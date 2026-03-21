import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "shouldBlockInteraction",
  indexItem: {
  "name": "shouldBlockInteraction",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "runtime",
  "subgroup": "access",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Permission gates",
  "demoMode": "inspector",
  "description": "shouldBlockInteraction için kanonik katalog girdisi.",
  "sectionIds": [
    "utility_components",
    "accessibility_compliance",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { shouldBlockInteraction } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "shouldBlockInteraction",
  "variantAxes": [
    "state: full | readonly | disabled | hidden",
    "external-disabled: on | off",
    "result: pass | block"
  ],
  "stateModel": [
    "readonly and disabled blocking",
    "external disabled precedence",
    "interaction pass-through"
  ],
    "previewStates": [],
    "behaviorModel": [
      "readonly and disabled blocking",
      "external disabled precedence",
      "interaction pass-through"
    ],
  "props": [
    {
      "name": "state / externallyDisabled",
      "type": "AccessLevel / boolean",
      "default": "full / false",
      "required": false,
      "description": "Event handler veya interactive control icin interaction'in bloke edilip edilmeyecegini hesaplar."
    }
  ],
  "previewFocus": [
    "readonly event blocking",
    "external disabled precedence"
  ],
  "regressionFocus": [
    "readonly block parity",
    "disabled block parity",
    "external override precedence"
  ]
},
};

export default entry;
