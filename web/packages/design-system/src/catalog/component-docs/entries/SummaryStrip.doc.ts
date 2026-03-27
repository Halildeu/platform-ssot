import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SummaryStrip",
  indexItem: {
  "name": "SummaryStrip",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
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
  "importStatement": "import { SummaryStrip } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationServerDefaultShowcase.tsx"
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
    "previewStates": [
      "loading",
      "compact",
      "dark-theme"
    ],
    "behaviorModel": [
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
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Strip boyut varyanti."
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
