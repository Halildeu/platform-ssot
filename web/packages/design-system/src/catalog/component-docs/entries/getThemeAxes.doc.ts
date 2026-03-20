import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "getThemeAxes",
  indexItem: {
  "name": "getThemeAxes",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Token viewer (semantic/raw)",
  "demoMode": "inspector",
  "description": "Aktif theme axes değerlerini okur.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { getThemeAxes } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx"
  ]
},
  apiItem: {
  "name": "getThemeAxes",
  "variantAxes": [
    "snapshot: default | persisted",
    "consumer: shell | entity-grid",
    "read-timing: initial | after-update"
  ],
  "stateModel": [
    "current theme axes snapshot",
    "localStorage hydration result",
    "overlay clamp persistence"
  ],
    "previewStates": [],
    "behaviorModel": [
      "current theme axes snapshot",
      "localStorage hydration result",
      "overlay clamp persistence"
    ],
  "props": [
    {
      "name": "signature",
      "type": "() => ThemeAxes",
      "default": "-",
      "required": false,
      "description": "Runtime icindeki aktif theme axes snapshot'ini senkron olarak dondurur."
    }
  ],
  "previewFocus": [
    "shell theme snapshot read",
    "entity grid runtime binding"
  ],
  "regressionFocus": [
    "default axes fallback",
    "persisted axes hydration",
    "post-update snapshot parity"
  ]
},
};

export default entry;
