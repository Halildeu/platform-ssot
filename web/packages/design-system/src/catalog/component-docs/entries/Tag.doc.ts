import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tag",
  indexItem: {
  "name": "Tag",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
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
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "importStatement": "import { Tag } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Tag",
  "variantAxes": [
    "variant: default | primary | success | warning | error | danger | info",
    "size: sm | md | lg",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "variant class mapping",
    "hidden access guard",
    "closable tag rendering"
  ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "variant class mapping",
      "hidden access guard",
      "closable tag rendering"
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
      "name": "variant",
      "type": "'default' | 'primary' | 'success' | 'warning' | 'error' | 'danger' | 'info'",
      "default": "default",
      "required": false,
      "description": "Semantic tag tonunu ve border/background map'ini belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Tag boyutunu belirler."
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Metin oncesi ikon slotu."
    },
    {
      "name": "closable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Kapatma butonu gosterir."
    },
    {
      "name": "onClose",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Tag kapatma callback'i."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e Tag stilini aktarir."
    },
    {
      "name": "access",
      "type": "AccessLevel",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk davranisi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedeni; title olarak gosterilir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "",
      "required": false,
      "description": "Utility override sinifi."
    }
  ],
  "previewFocus": [
    "semantic status tags",
    "closable tag interaction",
    "access-hidden behavior"
  ],
  "regressionFocus": [
    "variant mapping parity",
    "hidden access guard",
    "closable interaction stability"
  ]
},
};

export default entry;
