import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemePreviewCard",
  indexItem: {
  "name": "ThemePreviewCard",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "importStatement": "import { ThemePreviewCard } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPreviewPanel.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
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
    "previewStates": ["default", "dark-theme"],
    "behaviorModel": [
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
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
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
