import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Descriptions",
  indexItem: {
  "name": "Descriptions",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "data_display",
  "subgroup": "descriptions",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Descriptions / Key-Value",
  "demoMode": "live",
  "description": "Key-value detail primitivei; owner, scope, risk ve status ozetlerini kolon bazli layout ile gosterir.",
  "sectionIds": [
    "table_data_display",
    "state_feedback",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "tags": [
    "wave-4",
    "data-display",
    "beta",
    "descriptions"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "confirmation_receipts_and_traceability",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { Descriptions } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Descriptions",
  "variantAxes": [
    "columns: 1 | 2 | 3",
    "density: comfortable | compact",
    "surface: bordered | plain"
  ],
  "stateModel": [
    "empty detail state",
    "tone per item",
    "responsive column collapse",
    "span-aware summary blocks"
  ],
  "props": [
    {
      "name": "items",
      "type": "DescriptionsItem[]",
      "default": "-",
      "required": true,
      "description": "Label, value, helper, tone ve span bilgisini tasir."
    },
    {
      "name": "columns",
      "type": "1 | 2 | 3",
      "default": "2",
      "required": false,
      "description": "Grid kolon sayisini ve responsive dagilimi belirler."
    },
    {
      "name": "density",
      "type": "'comfortable' | 'compact'",
      "default": "comfortable",
      "required": false,
      "description": "Blok ic bosluk yogunlugunu belirler."
    },
    {
      "name": "bordered",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Kart yuzeylerinde border davranisini acar veya kapatir."
    },
    {
      "name": "emptyStateLabel",
      "type": "ReactNode",
      "default": "Gösterilecek detay bulunamadı.",
      "required": false,
      "description": "Bos veri durumunda Empty primitive icin aciklama metni."
    }
  ],
  "previewFocus": [
    "rollout summary",
    "risk / approval panels",
    "span-aware layout"
  ],
  "regressionFocus": [
    "empty state rendering",
    "tone mapping",
    "responsive column collapse"
  ]
},
};

export default entry;
