import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tree",
  indexItem: {
  "name": "Tree",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "data_display",
  "subgroup": "tree_table",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Tree / TreeTable",
  "demoMode": "live",
  "description": "Tree primitivei; policy, release ve ownership hiyerarsilerini secim ve readonly modlariyla sunar.",
  "sectionIds": [
    "table_data_display",
    "documentation_standards",
    "navigation_patterns"
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
    "tree"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "deep_link_and_shareable_state",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { Tree } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ],
    "dependsOn": ["Badge","EmptyState","Skeleton","Text"]
},
  apiItem: {
  "name": "Tree",
  "variantAxes": [
    "density: comfortable | compact",
    "selection: passive | selectable",
    "surface: default | readonly review"
  ],
  "stateModel": [
    "expanded / collapsed nodes",
    "selected node",
    "loading / empty state",
    "readonly / disabled interaction"
  ],
    "previewStates": ["expanded", "collapsed", "loading", "disabled", "dark-theme"],
    "behaviorModel": [
      "expanded / collapsed nodes",
      "selected node",
      "loading / empty state",
      "readonly / disabled interaction"
    ],
  "props": [
    {
      "name": "nodes",
      "type": "TreeNode[]",
      "default": "-",
      "required": true,
      "description": "Hiyerarsik dugum listesi; label, description, badges ve child dallarini tasir."
    },
    {
      "name": "selectedKey",
      "type": "React.Key | null",
      "default": "-",
      "required": false,
      "description": "Secili node bilgisini controlled olarak yonetir."
    },
    {
      "name": "onNodeSelect",
      "type": "(key: React.Key) => void",
      "default": "-",
      "required": false,
      "description": "Node secildiginde event uretir."
    },
    {
      "name": "defaultExpandedKeys / expandedKeys",
      "type": "React.Key[]",
      "default": "[]",
      "required": false,
      "description": "Expand/collapse davranisini uncontrolled veya controlled sekilde yonetir."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Skeleton tree state gosterir ve gercek node yerine gecici satirlar render eder."
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
    },
    {
      "name": "aria-label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilirlik icin agac bilesenine etiket."
    }
  ],
  "previewFocus": [
    "release governance hierarchy",
    "readonly audit tree",
    "loading / empty states"
  ],
  "regressionFocus": [
    "expand collapse determinism",
    "selected node sync",
    "readonly interaction guard"
  ]
},
};

export default entry;
