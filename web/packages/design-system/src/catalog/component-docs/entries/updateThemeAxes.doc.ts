import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "updateThemeAxes",
  indexItem: {
  "name": "updateThemeAxes",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_api",
  "taxonomySubgroup": "updateThemeAxes",
  "demoMode": "inspector",
  "description": "Theme axes patch uygulayan runtime controller.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { updateThemeAxes } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx"
  ]
},
  apiItem: {
  "name": "updateThemeAxes",
  "variantAxes": [
    "patch: partial | multi-axis",
    "overlay: clamped | unchanged",
    "consumer: provider | imperative runtime"
  ],
  "stateModel": [
    "partial patch merge",
    "overlay clamp",
    "DOM attr update",
    "storage persistence",
    "subscriber notification"
  ],
    "previewStates": [],
    "behaviorModel": [
      "partial patch merge",
      "overlay clamp",
      "DOM attr update",
      "storage persistence",
      "subscriber notification"
    ],
  "props": [
    {
      "name": "patch",
      "type": "Partial<ThemeAxes>",
      "default": "{}",
      "required": false,
      "description": "Theme axes state'ine kismi patch uygular; overlay alanlarini clamp eder, DOM/storage'i gunceller ve yeni state'i dondurur."
    }
  ],
  "previewFocus": [
    "multi-axis runtime patch",
    "DOM + storage sync",
    "provider-level imperative update"
  ],
  "regressionFocus": [
    "partial merge parity",
    "overlay clamp correctness",
    "notify + persist ordering"
  ]
},
};

export default entry;
