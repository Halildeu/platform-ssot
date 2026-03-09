import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EntitySummaryBlock",
  indexItem: {
  "name": "EntitySummaryBlock",
  "kind": "component",
  "importStatement": "import { EntitySummaryBlock } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "page_blocks",
  "subgroup": "summary",
  "tags": [
    "beta",
    "entity",
    "page-blocks",
    "summary",
    "wave-7"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Summary Blocks",
  "demoMode": "live",
  "description": "Entity detail ust ozeti, avatar, badge, metadata ve quick action alanlarini tek block icinde toplar.",
  "sectionIds": [
    "component_library_management",
    "responsive_layout",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "confirmation_receipts_and_traceability",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1"
},
  apiItem: {
  "name": "EntitySummaryBlock",
  "variantAxes": [
    "surface: detail-summary | readonly-summary",
    "identity: avatar | initials | icon",
    "actions: none | quick-actions"
  ],
  "stateModel": [
    "avatar fallback",
    "badge visibility",
    "description grid render",
    "action slot visibility"
  ],
  "props": [
    {
      "name": "title / subtitle",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Entity baslik ve alt baslik bilgisi."
    },
    {
      "name": "badge",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Entity durumu veya etiketi."
    },
    {
      "name": "avatar",
      "type": "{ src?; alt?; name?; fallbackIcon? }",
      "default": "-",
      "required": false,
      "description": "Identity sunumu icin avatar konfigurasyonu."
    },
    {
      "name": "actions",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Quick action slotu."
    },
    {
      "name": "items",
      "type": "DescriptionsItem[]",
      "default": "-",
      "required": true,
      "description": "Summary metadata girdileri."
    }
  ],
  "previewFocus": [
    "entity detail summary",
    "readonly registry summary",
    "avatar + actions composition"
  ],
  "regressionFocus": [
    "avatar fallback parity",
    "description columns",
    "header/action alignment"
  ]
},
};

export default entry;
