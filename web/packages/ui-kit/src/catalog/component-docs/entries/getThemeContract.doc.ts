import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "getThemeContract",
  indexItem: {
  "name": "getThemeContract",
  "kind": "function",
  "importStatement": "import { getThemeContract } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx",
    "web/apps/mfe-shell/src/features/theme/theme-matrix.constants.ts"
  ],
  "group": "theme",
  "subgroup": "runtime",
  "tags": [],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "theme_tokens",
  "taxonomySubgroup": "Token viewer (semantic/raw)",
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
  "uxPrimaryThemeId": "",
  "uxPrimarySubthemeId": "",
  "roadmapWaveId": "",
  "acceptanceContractId": ""
},
  apiItem: null,
};

export default entry;
