import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DetailSummary",
  indexItem: {
  "name": "DetailSummary",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "page_blocks",
  "subgroup": "recipes",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Detail summary / inspector",
  "demoMode": "live",
  "description": "PageHeader, SummaryStrip, EntitySummaryBlock ve detay payload yuzeylerini ayni inspector recipe olarak toplar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "table_data_display"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-11",
    "recipes",
    "stable",
    "detail"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "confirmation_receipts_and_traceability",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1",
  "importStatement": "import { DetailSummary } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "DetailSummary",
  "variantAxes": [
    "summary: absent | present",
    "payload: detail-only | detail+json",
    "header: compact | action-rich"
  ],
  "stateModel": [
    "summary strip visibility",
    "entity summary context",
    "json payload presence"
  ],
  "props": [
    {
      "name": "title / description / meta / status",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Recipe seviyesindeki header bilgisini tanimlar."
    },
    {
      "name": "summaryItems",
      "type": "SummaryStripItem[]",
      "default": "[]",
      "required": false,
      "description": "Detail header altindaki KPI strip verisi."
    },
    {
      "name": "entity",
      "type": "EntitySummaryBlockProps",
      "default": "-",
      "required": true,
      "description": "Primary entity ozetini canonical block ile verir."
    },
    {
      "name": "detailItems / jsonValue",
      "type": "DescriptionsItem[] / unknown",
      "default": "[] / undefined",
      "required": false,
      "description": "Structured metadata ve machine-readable payload yuzeylerini recipe altinda toplar."
    }
  ],
  "previewFocus": [
    "detail inspector shell",
    "summary + json dual rail"
  ],
  "regressionFocus": [
    "optional section visibility",
    "entity/detail payload ordering",
    "json fallback parity"
  ]
},
};

export default entry;
