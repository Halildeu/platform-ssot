import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Badge",
  indexItem: {
  "name": "Badge",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
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
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "importStatement": "import { Badge } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessRoleDrawer.ui.tsx",
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabComponentDetailSections.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabComponentOverviewPanels.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabRecipeDetailSections.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/page-shell/DesignLabSidebar.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/DesignLabTableSimpleShowcase.tsx",
    "web/apps/mfe-users/src/widgets/user-management/ui/UsersGrid.ui.tsx"
  ],
    "dependsOn": ["Slot"]
},
  apiItem: {
  "name": "Badge",
  "variantAxes": [
    "variant: default | primary | success | warning | error | danger | info | muted",
    "size: sm | md | lg",
    "content: short-label | status-chip | dot"
  ],
  "stateModel": [
    "variant class mapping",
    "dot rendering",
    "inline chip rendering"
  ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "variant class mapping",
      "dot rendering",
      "inline chip rendering"
    ],
  "props": [
    {
      "name": "variant",
      "type": "'default' | 'primary' | 'success' | 'warning' | 'error' | 'danger' | 'info' | 'muted'",
      "default": "default",
      "required": false,
      "description": "Status veya semantic feedback tonunu belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Badge boyutunu belirler."
    },
    {
      "name": "dot",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Dot modunu aktif eder; children render etmez."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e Badge propslarini aktarir."
    },
    {
      "name": "children",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Chip icerigini veya kisa durum etiketini tasir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Visual override sinifi."
    }
  ],
  "previewFocus": [
    "status chip matrix",
    "semantic variant mapping",
    "dot mode rendering"
  ],
  "regressionFocus": [
    "variant class parity",
    "dot mode rendering",
    "className merge stability"
  ]
},
};

export default entry;
