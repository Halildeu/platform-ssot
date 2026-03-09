import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Select",
  indexItem: {
  "name": "Select",
  "kind": "component",
  "importStatement": "import { Select } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "forms",
  "subgroup": "select",
  "tags": [],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Select / Dropdown / Combobox",
  "demoMode": "live",
  "description": "Temel secim ve dropdown alanlarini ortak stil ve access guard ile sunar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
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
