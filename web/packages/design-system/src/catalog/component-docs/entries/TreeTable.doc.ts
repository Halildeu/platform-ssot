import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TreeTable",
  indexItem: {
  "name": "TreeTable",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "data_display",
  "subgroup": "tree_table",
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
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-4",
    "data-display",
    "beta",
    "tree-table"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "role_goal_task_mapping",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { TreeTable } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
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
    "previewStates": ["expanded-rows", "loading", "selected-row", "dark-theme"],
    "behaviorModel": [
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
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
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
