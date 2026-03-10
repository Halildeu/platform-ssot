import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resolveThemeModeKey",
  indexItem: {
  "name": "resolveThemeModeKey",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "theme",
  "subgroup": "runtime",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Token viewer (semantic/raw)",
  "demoMode": "inspector",
  "description": "resolveThemeModeKey için kanonik katalog girdisi.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resolveThemeModeKey } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.shared.ts"
  ]
},
  apiItem: {
  "name": "resolveThemeModeKey",
  "variantAxes": [
    "input: explicit-mode | appearance-density",
    "fallback: alias | defaultMode",
    "coerce: matched | bypassed"
  ],
  "stateModel": [
    "explicit mode validation",
    "appearance/density alias resolution",
    "coerce rule application",
    "default mode fallback"
  ],
  "props": [
    {
      "name": "axes",
      "type": "{ appearance?: unknown; density?: unknown; modeKey?: unknown }",
      "default": "{}",
      "required": false,
      "description": "Explicit modeKey veya appearance/density kombinasyonundan kanonik theme mode key uretir."
    }
  ],
  "previewFocus": [
    "explicit mode passthrough",
    "appearance-density alias mapping",
    "default mode fallback"
  ],
  "regressionFocus": [
    "invalid mode fallback",
    "coerce rule parity",
    "alias precedence"
  ]
},
};

export default entry;
