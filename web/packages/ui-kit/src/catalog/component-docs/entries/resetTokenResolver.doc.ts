import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resetTokenResolver",
  indexItem: {
  "name": "resetTokenResolver",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
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
  "importStatement": "import { resetTokenResolver } from 'mfe-ui-kit';",
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
