import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SummaryStrip",
  indexItem: {
  "name": "SummaryStrip",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "page_blocks",
  "subgroup": "summary",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Summary Blocks",
  "demoMode": "live",
  "description": "Page ustu KPI, durum ve trend ozetlerini reusable strip shell olarak sunar.",
  "sectionIds": [
    "component_library_management",
    "responsive_layout",
    "state_feedback"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence"
  ],
  "tags": [
    "wave-7",
    "page-blocks",
    "beta",
    "summary",
    "kpi"
  ],
  "uxPrimaryThemeId": "measurement_kpi_and_experimentation",
  "uxPrimarySubthemeId": "task_completion_time_p50_p95",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1",
  "importStatement": "import { SummaryStrip } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "SummaryStrip",
  "variantAxes": [
    "columns: 2 | 3 | 4",
    "tone: default | info | success | warning",
    "surface: KPI | audit-summary"
  ],
  "stateModel": [
    "stat card wrap",
    "trend visibility",
    "note visibility",
    "column density"
  ],
  "props": [
    {
      "name": "items",
      "type": "SummaryStripItem[]",
      "default": "-",
      "required": true,
      "description": "KPI kartlarinin veri girisi."
    },
    {
      "name": "title / description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Strip ustu baslik ve aciklama."
    },
    {
      "name": "columns",
      "type": "2 | 3 | 4",
      "default": "4",
      "required": false,
      "description": "Responsive kolon yogunlugu."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk seviyesi."
    }
  ],
  "previewFocus": [
    "release KPI strip",
    "warning trend strip",
    "compact summary row"
  ],
  "regressionFocus": [
    "column wrap parity",
    "tone border mapping",
    "trend placement"
  ]
},
};

export default entry;
