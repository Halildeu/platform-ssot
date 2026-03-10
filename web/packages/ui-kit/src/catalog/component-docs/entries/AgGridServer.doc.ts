import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AgGridServer",
  indexItem: {
  "name": "AgGridServer",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "data_display",
  "subgroup": "data_grid",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Data Grid (AG Grid / EntityGrid)",
  "demoMode": "live",
  "description": "Server-side AG Grid wrapperi; standard options ve overlay davranisini toplar.",
  "sectionIds": [
    "component_library_management",
    "table_data_display",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence",
    "performance_contract"
  ],
  "tags": [
    "wave-4",
    "data-display",
    "stable",
    "grid",
    "server"
  ],
  "uxPrimaryThemeId": "performance_resilience_experience",
  "uxPrimarySubthemeId": "perceived_performance_optimization",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { AgGridServer } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "AgGridServer",
  "variantAxes": [
    "surface: fixed-height | full-width",
    "data-flow: success | loading | error",
    "schema: simple columns | grouped columns"
  ],
  "stateModel": [
    "server datasource attach",
    "loading overlay lifecycle",
    "success vs fail getRows handling",
    "rowCount fallback"
  ],
  "props": [
    {
      "name": "columnDefs",
      "type": "(ColDef | ColGroupDef)[]",
      "default": "-",
      "required": true,
      "description": "Server-side grid kolon yapisi."
    },
    {
      "name": "getData",
      "type": "(request) => Promise<{ rows; total? }>",
      "default": "-",
      "required": true,
      "description": "Grid isteklerini merkezi fetch katmanina baglar."
    },
    {
      "name": "height",
      "type": "number | string",
      "default": "600",
      "required": false,
      "description": "Grid container yuksekligi."
    },
    {
      "name": "defaultColDef",
      "type": "ColDef",
      "default": "-",
      "required": false,
      "description": "Tum kolonlar icin ortak default davranislar."
    },
    {
      "name": "gridOptions",
      "type": "GridOptions",
      "default": "-",
      "required": false,
      "description": "Server-side row model ve cache davranisi icin ileri grid ayarlari."
    }
  ],
  "previewFocus": [
    "server datasource attach",
    "owner/resource dataset",
    "loading and fail handling"
  ],
  "regressionFocus": [
    "datasource success/fail parity",
    "rowCount fallback",
    "overlay visibility"
  ]
},
};

export default entry;
