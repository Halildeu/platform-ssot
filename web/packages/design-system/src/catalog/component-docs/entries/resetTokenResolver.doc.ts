import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resetTokenResolver",
  indexItem: {
  "name": "resetTokenResolver",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "runtime",
  "subgroup": "auth",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "HTTP helpers",
  "demoMode": "inspector",
  "description": "resetTokenResolver için kanonik katalog girdisi.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resetTokenResolver } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "resetTokenResolver",
  "variantAxes": [
    "resolver: custom -> default",
    "consumer: tests | app teardown",
    "effect: runtime reset"
  ],
  "stateModel": [
    "default resolver restore"
  ],
    "previewStates": [],
    "behaviorModel": [
      "default resolver restore"
    ],
  "props": [
    {
      "name": "signature",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Kayitli resolver'i default token resolver durumuna geri alir."
    }
  ],
  "previewFocus": [
    "resolver reset"
  ],
  "regressionFocus": [
    "default resolver restore",
    "subsequent token reads"
  ]
},
};

export default entry;
