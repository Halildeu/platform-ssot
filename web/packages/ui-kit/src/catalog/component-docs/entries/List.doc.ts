import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "List",
  indexItem: {
  "name": "List",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "data_display",
  "subgroup": "list",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "List",
  "demoMode": "live",
  "description": "Görev, onay ve operasyon listeleri için badge/meta/selection destekli hafif liste primitivei.",
  "sectionIds": [
    "table_data_display",
    "documentation_standards",
    "state_feedback"
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
    "list"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { List } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "List",
  "variantAxes": [
    "density: comfortable | compact",
    "selection: passive | selectable",
    "tone: default | info | success | warning | danger"
  ],
  "stateModel": [
    "loading",
    "empty",
    "selected item",
    "disabled / blocked interaction"
  ],
  "props": [
    {
      "name": "items",
      "type": "ListItem[]",
      "default": "-",
      "required": true,
      "description": "Title, description, meta, badge ve tone bilgisini taşıyan kayıt listesi."
    },
    {
      "name": "density",
      "type": "'comfortable' | 'compact'",
      "default": "comfortable",
      "required": false,
      "description": "Liste satır yüksekliği ve bilgi yoğunluğu."
    },
    {
      "name": "selectedKey",
      "type": "React.Key | null",
      "default": "null",
      "required": false,
      "description": "Seçili öğeyi controlled state ile belirler."
    },
    {
      "name": "onItemSelect",
      "type": "(key) => void",
      "default": "-",
      "required": false,
      "description": "Satır seçimini parent state ile yönetir."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Liste yüklenirken skeleton satırları gösterir ve aria-busy işaretler."
    }
  ],
  "previewFocus": [
    "operational inbox",
    "compact selectable list",
    "loading / empty states"
  ],
  "regressionFocus": [
    "loading state evidence",
    "selected item sync",
    "blocked interaction guard"
  ]
},
};

export default entry;
