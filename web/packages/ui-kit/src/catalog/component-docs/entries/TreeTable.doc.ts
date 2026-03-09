import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TreeTable",
  indexItem: {
  "name": "TreeTable",
  "kind": "component",
  "importStatement": "import { TreeTable } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "data_display",
  "subgroup": "tree_table",
  "tags": [
    "beta",
    "data-display",
    "tree-table",
    "wave-4"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Tree / TreeTable",
  "demoMode": "live",
  "description": "TreeTable primitivei; owner, status ve scope verisini hiyerarsik satirlarla tablo halinde sunar.",
  "sectionIds": [
    "table_data_display",
    "documentation_standards",
    "integration_distribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "role_goal_task_mapping",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1"
},
  apiItem: {
  "name": "TreeTable",
  "variantAxes": [
    "density: comfortable | compact",
    "selection: passive | selectable",
    "surface: ownership matrix | compact review"
  ],
  "stateModel": [
    "expanded / collapsed rows",
    "selected row",
    "loading / empty state",
    "column-based comparison"
  ],
  "props": [
    {
      "name": "nodes",
      "type": "TreeTableNode[]",
      "default": "-",
      "required": true,
      "description": "Label, badges, meta ve child row verilerini tasiyan hiyerarsik satir listesi."
    },
    {
      "name": "columns",
      "type": "TreeTableColumn[]",
      "default": "-",
      "required": true,
      "description": "Agac kolonu yanindaki owner/status/scope gibi veri kolonlarini tanimlar."
    },
    {
      "name": "selectedKey",
      "type": "React.Key | null",
      "default": "-",
      "required": false,
      "description": "Secili hiyerarsik satiri controlled olarak yonetir."
    },
    {
      "name": "defaultExpandedKeys / expandedKeys",
      "type": "React.Key[]",
      "default": "[]",
      "required": false,
      "description": "Hangi satirlarin acik oldugunu kontrol eder."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Table skeleton satirlari ile data gelene kadar yer tutucu gosterir."
    }
  ],
  "previewFocus": [
    "ownership matrix",
    "compact review matrix",
    "loading / empty states"
  ],
  "regressionFocus": [
    "expanded row rendering",
    "selected row sync",
    "column value determinism"
  ]
},
};

export default entry;
