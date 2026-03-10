import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Empty",
  indexItem: {
  "name": "Empty",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "empty-states",
  "subgroup": "empty",
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
  "importStatement": "import { Empty } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Empty",
  "variantAxes": [
    "copy: default | custom",
    "access: full | readonly | hidden",
    "surface: standalone | embedded"
  ],
  "stateModel": [
    "description fallback",
    "hidden access guard",
    "centered empty layout"
  ],
  "props": [
    {
      "name": "description",
      "type": "string",
      "default": "'Kayit bulunamadi'",
      "required": false,
      "description": "Bos durum mesajini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Surface container'ina ek utility class uygular."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Hidden durumda component render edilmez; diger durumlar metadata olarak tasinir."
    }
  ],
  "previewFocus": [
    "default empty copy",
    "custom description",
    "embedded fallback panel"
  ],
  "regressionFocus": [
    "description fallback parity",
    "hidden access guard",
    "layout centering stability"
  ]
},
};

export default entry;
