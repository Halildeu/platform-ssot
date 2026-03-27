import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "toggleVariantDefault",
  indexItem: {
  "name": "toggleVariantDefault",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "data-grid",
  "subgroup": "variants",
  "taxonomyGroupId": "theme_setters",
  "taxonomySubgroup": "toggleVariantDefault",
  "demoMode": "inspector",
  "description": "Grid default varyantini belirleyen utility.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { toggleVariantDefault } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "toggleVariantDefault",
  "variantAxes": [
    "variant-scope: personal | global",
    "default-state: on | off",
    "persistence-path: updateVariant | updatePreference"
  ],
  "stateModel": [
    "personal variant update path",
    "global preference update path",
    "selected/default coupling for global variants"
  ],
    "previewStates": [],
    "behaviorModel": [
      "personal variant update path",
      "global preference update path",
      "selected/default coupling for global variants"
    ],
  "props": [
    {
      "name": "variant / makeDefault",
      "type": "GridVariant / boolean",
      "default": "- / false",
      "required": true,
      "description": "Hangi varyantin varsayilan yapilacagini ve hedef state'i tanimlar."
    },
    {
      "name": "deps.updateVariant / deps.updatePreference",
      "type": "(payload) => Promise<GridVariant>",
      "default": "-",
      "required": true,
      "description": "Personal varyantlarda updateVariant, global varyantlarda updatePreference akisini cagirir."
    }
  ],
  "previewFocus": [
    "personal default toggle",
    "global preference toggle"
  ],
  "regressionFocus": [
    "personal/global branch parity",
    "gridId forwarding for personal variants",
    "isSelected coupling for global variants"
  ]
},
};

export default entry;
