import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "getResolvedToken",
  indexItem: {
  "name": "getResolvedToken",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "runtime",
  "subgroup": "auth",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "HTTP helpers",
  "demoMode": "inspector",
  "description": "getResolvedToken için kanonik katalog girdisi.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { getResolvedToken } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "getResolvedToken",
  "variantAxes": [
    "resolver: default | registered",
    "result: token | null",
    "error-path: safe-null fallback"
  ],
  "stateModel": [
    "registered resolver invocation",
    "null fallback",
    "safe error handling"
  ],
  "props": [
    {
      "name": "signature",
      "type": "() => string | null",
      "default": "-",
      "required": false,
      "description": "Kayitli token resolver'i calistirir; hata veya token yoksa guvenli bicimde null dondurur."
    }
  ],
  "previewFocus": [
    "token resolver read",
    "safe null fallback"
  ],
  "regressionFocus": [
    "resolver error handling",
    "null fallback parity",
    "registered resolver wiring"
  ]
},
};

export default entry;
