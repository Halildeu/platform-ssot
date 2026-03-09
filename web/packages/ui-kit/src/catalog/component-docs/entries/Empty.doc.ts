import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Empty",
  indexItem: {
  "name": "Empty",
  "kind": "component",
  "importStatement": "import { Empty } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "empty-states",
  "subgroup": "empty",
  "tags": [],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Empty state / No data",
  "demoMode": "live",
  "description": "Bos durum ve no-data ekranlari icin ortak fallback yuzeyi.",
  "sectionIds": [
    "component_library_management",
    "state_feedback",
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
