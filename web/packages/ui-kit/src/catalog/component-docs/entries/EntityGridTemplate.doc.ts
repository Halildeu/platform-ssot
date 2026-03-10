import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EntityGridTemplate",
  indexItem: {
  "name": "EntityGridTemplate",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "data_display",
  "subgroup": "data_grid",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Data Grid (AG Grid / EntityGrid)",
  "demoMode": "live",
  "description": "ERP liste ekranlari icin ana grid kompoziti.",
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
    "entity-grid"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "role_goal_task_mapping",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { EntityGridTemplate } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "EntityGridTemplate",
  "variantAxes": [
    "mode: client | server",
    "theme: quartz | balham | material | alpine",
    "density: comfortable | compact"
  ],
  "stateModel": [
    "client pagination",
    "server datasource attach",
    "variant management",
    "toolbar export actions",
    "theme and density sync"
  ],
  "props": [
    {
      "name": "gridId",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Variant ve preference owner kimligini belirler."
    },
    {
      "name": "columnDefs",
      "type": "ColDef[]",
      "default": "-",
      "required": true,
      "description": "Grid kolon yapisi ve davranislari."
    },
    {
      "name": "dataSourceMode",
      "type": "'server' | 'client'",
      "default": "server",
      "required": false,
      "description": "Gridin client-side veya server-side calisma modunu belirler."
    },
    {
      "name": "rowData / total / page / pageSize",
      "type": "RowData[] / number",
      "default": "-",
      "required": false,
      "description": "Client-side liste ve pagination girdileri."
    },
    {
      "name": "createServerSideDatasource",
      "type": "(params) => IServerSideDatasource",
      "default": "-",
      "required": false,
      "description": "Server-side mod icin datasource baglayicisi."
    },
    {
      "name": "toolbarExtras",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Grid toolbarina urune ozel aksiyon ekler."
    }
  ],
  "previewFocus": [
    "client-side entity list",
    "server datasource mode",
    "toolbar and variant controls"
  ],
  "regressionFocus": [
    "mode switch parity",
    "server datasource attach",
    "variant selector rendering",
    "pagination summary"
  ]
},
};

export default entry;
