import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "registerTokenResolver",
  indexItem: {
  "name": "registerTokenResolver",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "runtime",
  "subgroup": "auth",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "HTTP helpers",
  "demoMode": "inspector",
  "description": "registerTokenResolver için kanonik katalog girdisi.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { registerTokenResolver } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "registerTokenResolver",
  "variantAxes": [
    "resolver: custom | default",
    "consumer: auth bootstrap | test harness",
    "effect: runtime resolver swap"
  ],
  "stateModel": [
    "custom resolver registration",
    "default fallback restore-by-null"
  ],
    "previewStates": [],
    "behaviorModel": [
      "custom resolver registration",
      "default fallback restore-by-null"
    ],
  "props": [
    {
      "name": "resolver",
      "type": "(() => string | null) | null | undefined",
      "default": "undefined",
      "required": false,
      "description": "Runtime icin ozel token resolver kaydeder; null/undefined verilirse default resolver'a duser."
    }
  ],
  "previewFocus": [
    "custom token resolver bootstrap",
    "default fallback by null"
  ],
  "regressionFocus": [
    "resolver swap parity",
    "null/undefined fallback",
    "subsequent header reads"
  ]
},
};

export default entry;
