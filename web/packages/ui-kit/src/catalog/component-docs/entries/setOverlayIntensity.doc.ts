import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setOverlayIntensity",
  indexItem: {
  "name": "setOverlayIntensity",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Overlay intensity tools",
  "demoMode": "inspector",
  "description": "setOverlayIntensity için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setOverlayIntensity } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx"
  ]
},
  apiItem: {
  "name": "setOverlayIntensity",
  "variantAxes": [
    "range: min | default | max",
    "consumer: theme editor | shell runtime",
    "update: partial-axes patch"
  ],
  "stateModel": [
    "overlayIntensity clamp",
    "DOM variable update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "overlayIntensity",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Overlay intensity degerini runtime clamp kurallari ile guncelleyip theme axes patch uygular."
    }
  ],
  "previewFocus": [
    "theme editor slider binding",
    "overlay intensity patch"
  ],
  "regressionFocus": [
    "range clamp parity",
    "DOM variable update",
    "notify cascade"
  ]
},
};

export default entry;
