import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemePreviewCard",
  indexItem: {
  "name": "ThemePreviewCard",
  "kind": "component",
  "importStatement": "import { ThemePreviewCard } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx"
  ],
  "group": "theme",
  "subgroup": "preview",
  "tags": [],
  "availability": "exported",
  "lifecycle": "stable",
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
  "uxPrimaryThemeId": "",
  "uxPrimarySubthemeId": "",
  "roadmapWaveId": "",
  "acceptanceContractId": ""
},
  apiItem: null,
};

export default entry;
