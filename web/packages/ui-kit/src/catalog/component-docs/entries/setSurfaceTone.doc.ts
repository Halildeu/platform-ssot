import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setSurfaceTone",
  indexItem: {
  "name": "setSurfaceTone",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setSurfaceTone için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setSurfaceTone } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "setSurfaceTone",
  "variantAxes": [
    "surfaceTone: contract-backed ids",
    "consumer: theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "surfaceTone patch",
    "DOM attr update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "surfaceTone",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Theme contract'tan gelen surface tone kimligini runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "surface tone selector"
  ],
  "regressionFocus": [
    "tone patch parity",
    "DOM attr update",
    "notify cascade"
  ]
},
};

export default entry;
