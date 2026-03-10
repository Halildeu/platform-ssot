import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SearchFilterListing",
  indexItem: {
  "name": "SearchFilterListing",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "page_blocks",
  "subgroup": "recipes",
  "taxonomyGroupId": "search_filtering",
  "taxonomySubgroup": "Search + filter listings",
  "demoMode": "live",
  "description": "PageHeader, FilterBar, SummaryStrip ve sonuc listesini ayni listing recipe kompozisyonunda toplar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "responsive_layout"
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
    "listing"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1",
  "importStatement": "import { SearchFilterListing } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "SearchFilterListing",
  "variantAxes": [
    "results: empty | listed | custom-surface",
    "filters: hidden | visible",
    "summary: absent | present"
  ],
  "stateModel": [
    "filter shell visibility",
    "summary strip visibility",
    "result list fallback"
  ],
  "props": [
    {
      "name": "title / description / meta / status",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Recipe header katmanini tanimlar."
    },
    {
      "name": "filters / onReset / onSaveView",
      "type": "ReactNode / () => void",
      "default": "- / - / -",
      "required": false,
      "description": "Canonical FilterBar icerigini ve aksiyonlarini tasir."
    },
    {
      "name": "summaryItems",
      "type": "SummaryStripItem[]",
      "default": "[]",
      "required": false,
      "description": "Result shell altindaki KPI strip verisi."
    },
    {
      "name": "items / results",
      "type": "ListItem[] / ReactNode",
      "default": "[] / -",
      "required": false,
      "description": "Varsayilan list surface veya custom result renderer secebilir."
    }
  ],
  "previewFocus": [
    "policy inventory listing",
    "search + filter shell"
  ],
  "regressionFocus": [
    "empty fallback parity",
    "filter action wiring",
    "summary/result ordering"
  ]
},
};

export default entry;
