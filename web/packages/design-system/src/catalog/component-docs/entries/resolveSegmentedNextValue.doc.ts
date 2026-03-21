import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resolveSegmentedNextValue",
  indexItem: {
  "name": "resolveSegmentedNextValue",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "segmented_toggle",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Single veya multiple segmented seciminde bir item tetiklendiginde yeni value dizisini deterministik olarak hesaplar.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resolveSegmentedNextValue } from '@mfe/design-system';",
  "whereUsed": [
    "web/packages/design-system/src/components/Segmented.tsx"
  ]
},
  apiItem: {
  "name": "resolveSegmentedNextValue",
  "variantAxes": [
    "selection: single | multiple",
    "empty-state: sticky | allow-empty"
  ],
  "stateModel": [
    "selection toggle resolution",
    "exclusive deselect fallback"
  ],
    "previewStates": [],
    "behaviorModel": [
      "selection toggle resolution",
      "exclusive deselect fallback"
    ],
  "props": [
    {
      "name": "currentValue",
      "type": "string | string[] | undefined",
      "default": "-",
      "required": false,
      "description": "Mevcut secim durumunu string veya string[] olarak alir."
    },
    {
      "name": "itemValue",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Etkilesime girilen segmented item degeridir."
    },
    {
      "name": "selectionMode / options.allowEmptySelection",
      "type": "'single' | 'multiple' / boolean",
      "default": "'single' / false",
      "required": false,
      "description": "Exclusive veya coklu toggle mantigini ve single modda secimin sifirlanip sifirlanamayacagini belirler."
    }
  ],
  "previewFocus": [
    "single selection switch",
    "multiple toggle resolution"
  ],
  "regressionFocus": [
    "allow-empty single parity",
    "multiple add-remove parity"
  ]
},
};

export default entry;
