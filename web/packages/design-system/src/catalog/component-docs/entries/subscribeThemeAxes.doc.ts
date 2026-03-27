import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "subscribeThemeAxes",
  indexItem: {
  "name": "subscribeThemeAxes",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_api",
  "taxonomySubgroup": "subscribeThemeAxes",
  "demoMode": "inspector",
  "description": "subscribeThemeAxes için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { subscribeThemeAxes } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx"
  ]
},
  apiItem: {
  "name": "subscribeThemeAxes",
  "variantAxes": [
    "listener: immediate-fire | subsequent-updates",
    "consumer: shell provider | entity grid",
    "cleanup: active | unsubscribed"
  ],
  "stateModel": [
    "listener registration",
    "initial snapshot emit",
    "unsubscribe cleanup"
  ],
    "previewStates": [],
    "behaviorModel": [
      "listener registration",
      "initial snapshot emit",
      "unsubscribe cleanup"
    ],
  "props": [
    {
      "name": "listener",
      "type": "(axes: ThemeAxes) => void",
      "default": "-",
      "required": true,
      "description": "Aktif theme axes snapshot'ini hemen iletir ve sonraki degisimlerde dinleyiciyi bilgilendirir."
    }
  ],
  "previewFocus": [
    "provider subscription",
    "immediate snapshot callback",
    "unsubscribe lifecycle"
  ],
  "regressionFocus": [
    "initial callback parity",
    "unsubscribe cleanup",
    "listener notification order"
  ]
},
};

export default entry;
