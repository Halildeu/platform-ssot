import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TreeDataGrid",
  indexItem: {
    "name": "TreeDataGrid",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Tree",
    "demoMode": "planned",
    "description": "Hiyerarsik agac yapisi icinde veri gosteren grid bileseni; parent-child iliskileri ile genisletilebilir satir yapisi saglar.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "data-grid",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { TreeDataGrid } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "TreeDataGrid",
    "variantAxes": [
      "treeColumn: auto | custom",
      "indentGuides: visible | hidden"
    ],
    "stateModel": [
      "collapsed-all",
      "expanded-all",
      "partial-expanded"
    ],
    "previewStates": [
      "collapsed-all",
      "expanded-tree",
      "deep-nesting",
      "with-indent-guides",
      "dark-theme"
    ],
    "behaviorModel": [
      "hierarchical row expansion",
      "parent-child data path resolution",
      "indent level rendering",
      "expand/collapse all toggle",
      "keyboard tree navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "rowData",
        "type": "any[]",
        "default": "[]",
        "required": true,
        "description": "Agac yapisi satir verileri dizisi."
      },
      {
        "name": "columnDefs",
        "type": "ColDef[]",
        "default": "[]",
        "required": true,
        "description": "Grid kolon tanimlari."
      },
      {
        "name": "treeDataPath",
        "type": "(data: any) => string[]",
        "default": "-",
        "required": true,
        "description": "Her satir icin hiyerarsi yolunu donduren fonksiyon."
      },
      {
        "name": "showIndentGuides",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Agac seviye cizgilerini gosterir veya gizler."
      },
      {
        "name": "defaultExpanded",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Baslangicta tum dugumlerin acik olup olmadigini belirler."
      },
      {
        "name": "onNodeExpand",
        "type": "(nodePath: string[]) => void",
        "default": "-",
        "required": false,
        "description": "Dugum genisletildiginde tetiklenen callback."
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
        "description": "Grid boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "hierarchical expansion",
      "indent guide rendering",
      "deep nesting levels"
    ],
    "regressionFocus": [
      "agac yolu cozumleme dogrulugu",
      "derin yuvalama performansi",
      "expand/collapse all toggle",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
