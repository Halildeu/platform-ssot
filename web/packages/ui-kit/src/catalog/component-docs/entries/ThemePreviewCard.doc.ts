import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemePreviewCard",
  indexItem: {
  "name": "ThemePreviewCard",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "theme",
  "subgroup": "preview",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Theme preview cards",
  "demoMode": "live",
  "description": "Tema varyasyonlarini minik kartlar halinde karsilastiran preview primitivei.",
  "sectionIds": [
    "design_token_management",
    "theming_customization",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync"
  ],
  "importStatement": "import { ThemePreviewCard } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPreviewPanel.tsx"
  ]
},
  apiItem: {
  "name": "ThemePreviewCard",
  "variantAxes": [
    "selection: selected | unselected",
    "surface: standalone | gallery-linked",
    "token-preview: light | dark compatible"
  ],
  "stateModel": [
    "selected checkmark visibility",
    "border emphasis",
    "token preview skeleton rendering"
  ],
  "props": [
    {
      "name": "selected",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Card'in aktif preset oldugunu vurgulayan border ve check state'ini acar."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Gallery veya compare yuzeyi icin ek visual container override'u saglar."
    }
  ],
  "previewFocus": [
    "selected preset emphasis",
    "compact token preview card",
    "gallery embedding"
  ],
  "regressionFocus": [
    "selected border/check parity",
    "hover emphasis",
    "preview skeleton rendering"
  ]
},
};

export default entry;
