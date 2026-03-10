import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tag",
  indexItem: {
  "name": "Tag",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "feedback",
  "subgroup": "tags",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Badge / Tag / Chip",
  "demoMode": "live",
  "description": "Kategori, statü ve filtre sinyalleri icin kullanılan kapsul etiket.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync"
  ],
  "importStatement": "import { Tag } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Tag",
  "variantAxes": [
    "tone: default | success | warning | danger | info",
    "access: full | readonly | disabled | hidden",
    "content: short | status-label"
  ],
  "stateModel": [
    "tone class mapping",
    "hidden access guard",
    "uppercase inline label rendering"
  ],
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Tag icindeki kisa durum metni veya label icerigi."
    },
    {
      "name": "tone",
      "type": "'default' | 'success' | 'warning' | 'danger' | 'info'",
      "default": "default",
      "required": false,
      "description": "Semantic tag tonunu ve border/background map'ini belirler."
    },
    {
      "name": "className / access",
      "type": "string / 'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "'' / full",
      "required": false,
      "description": "Utility override ve policy tabanli gorunurluk davranisini kontrol eder."
    }
  ],
  "previewFocus": [
    "semantic status tags",
    "uppercase compact label",
    "access-hidden behavior"
  ],
  "regressionFocus": [
    "tone mapping parity",
    "hidden access guard",
    "uppercase layout stability"
  ]
},
};

export default entry;
