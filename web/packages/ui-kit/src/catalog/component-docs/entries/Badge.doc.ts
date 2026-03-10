import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Badge",
  indexItem: {
  "name": "Badge",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "feedback",
  "subgroup": "badges",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Badge / Tag / Chip",
  "demoMode": "live",
  "description": "Durum, sayi ve kisa sinyal gosteren hafif etiket bileşeni.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync"
  ],
  "importStatement": "import { Badge } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessRoleDrawer.ui.tsx",
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-users/src/widgets/user-management/ui/UsersGrid.ui.tsx"
  ]
},
  apiItem: {
  "name": "Badge",
  "variantAxes": [
    "tone: default | info | success | warning | danger | muted",
    "access: full | readonly | disabled | hidden",
    "content: short-label | status-chip"
  ],
  "stateModel": [
    "tone class mapping",
    "hidden access guard",
    "inline chip rendering"
  ],
  "props": [
    {
      "name": "tone",
      "type": "'default' | 'info' | 'success' | 'warning' | 'danger' | 'muted'",
      "default": "default",
      "required": false,
      "description": "Status veya semantic feedback tonunu belirler."
    },
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Chip icerigini veya kisa durum etiketini tasir."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk davranisini belirler; hidden oldugunda render etmez."
    },
    {
      "name": "className / HTMLSpanElement props",
      "type": "string / React.HTMLAttributes<HTMLSpanElement>",
      "default": "-",
      "required": false,
      "description": "Visual override ve standart span attribute gecisini destekler."
    }
  ],
  "previewFocus": [
    "status chip matrix",
    "semantic tone mapping",
    "access-hidden behavior"
  ],
  "regressionFocus": [
    "tone class parity",
    "hidden access guard",
    "className merge stability"
  ]
},
};

export default entry;
