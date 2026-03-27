import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "getThemeContract",
  indexItem: {
  "name": "getThemeContract",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_api",
  "taxonomySubgroup": "getThemeContract",
  "demoMode": "inspector",
  "description": "Aktif semantic theme contract bilgisini okur.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { getThemeContract } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx",
    "web/apps/mfe-shell/src/features/theme/theme-matrix.constants.ts"
  ]
},
  apiItem: {
  "name": "getThemeContract",
  "variantAxes": [
    "payload: generated-contract",
    "mode-set: default-only | allowed-modes",
    "consumer: runtime | docs"
  ],
  "stateModel": [
    "generated contract access",
    "allowed modes availability",
    "coerce rule presence"
  ],
    "previewStates": [],
    "behaviorModel": [
      "generated contract access",
      "allowed modes availability",
      "coerce rule presence"
    ],
  "props": [
    {
      "name": "signature",
      "type": "() => ThemeContract",
      "default": "-",
      "required": false,
      "description": "Generated theme contract JSON nesnesini runtime ve docs tuketimi icin dondurur."
    }
  ],
  "previewFocus": [
    "generated contract read",
    "allowed mode inspection"
  ],
  "regressionFocus": [
    "generated contract shape",
    "default mode fallback",
    "allowed mode exposure"
  ]
},
};

export default entry;
