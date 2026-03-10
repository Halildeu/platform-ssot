import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "setTableSurfaceTone",
  indexItem: {
  "name": "setTableSurfaceTone",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme editor (axes)",
  "demoMode": "inspector",
  "description": "setTableSurfaceTone için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { setTableSurfaceTone } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx"
  ]
},
  apiItem: {
  "name": "setTableSurfaceTone",
  "variantAxes": [
    "tone: soft | normal | strong",
    "consumer: table shell | global theme editor",
    "update: partial-axes patch"
  ],
  "stateModel": [
    "tableSurfaceTone patch",
    "theme attr update",
    "subscriber notification"
  ],
  "props": [
    {
      "name": "tableSurfaceTone",
      "type": "'soft' | 'normal' | 'strong'",
      "default": "-",
      "required": true,
      "description": "Table/grid yuzey tonunu runtime axes state uzerinden gunceller."
    }
  ],
  "previewFocus": [
    "table tone switch",
    "theme editor integration"
  ],
  "regressionFocus": [
    "tone patch parity",
    "DOM attr update",
    "subscriber notification"
  ]
},
};

export default entry;
