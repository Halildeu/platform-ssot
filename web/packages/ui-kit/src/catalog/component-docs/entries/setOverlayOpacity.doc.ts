import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setOverlayOpacity",
  indexItem: {
  "name": "setOverlayOpacity",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Overlay intensity tools",
  "demoMode": "inspector",
  "description": "setOverlayOpacity için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setOverlayOpacity } from 'mfe-ui-kit';",
  "whereUsed": []
},
  apiItem: {
  "name": "setOverlayOpacity",
  "variantAxes": [
    "range: 0-100",
    "consumer: theme editor",
    "update: single-axis patch"
  ],
  "stateModel": [
    "overlayOpacity clamp",
    "CSS variable update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "overlayOpacity",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Overlay opacity degerini runtime clamp kurallariyla guncelleyip CSS variable ve axes state'e yazar."
    }
  ],
  "previewFocus": [
    "overlay opacity slider"
  ],
  "regressionFocus": [
    "range clamp parity",
    "CSS variable update",
    "notify cascade"
  ]
},
};

export default entry;
