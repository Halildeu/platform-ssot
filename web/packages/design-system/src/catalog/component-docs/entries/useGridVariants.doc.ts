import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useGridVariants",
  indexItem: {
  "name": "useGridVariants",
  "kind": "hook",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "data-grid",
  "subgroup": "variants",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Hooks (useX)",
  "demoMode": "inspector",
  "description": "Grid varyantlarini kullanip durum yoneten hook.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { useGridVariants } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "useGridVariants",
  "variantAxes": [
    "grid-scope: per-gridId",
    "query-state: loading | success | error",
    "mutations: create | update | delete | clone | preference"
  ],
  "stateModel": [
    "variants query cache",
    "optimistic preference mutation",
    "query invalidation",
    "sorted variant collection"
  ],
    "previewStates": [],
    "behaviorModel": [
      "variants query cache",
      "optimistic preference mutation",
      "query invalidation",
      "sorted variant collection"
    ],
  "props": [
    {
      "name": "gridId",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "React Query cache ve varyant servis cagrilarinin ait oldugu grid kimligini belirler."
    }
  ],
  "previewFocus": [
    "variant list query lifecycle",
    "create/update/delete/clone actions",
    "preference optimistic update"
  ],
  "regressionFocus": [
    "query invalidation parity",
    "personal/global default mutation behavior",
    "sorted result stability"
  ]
},
};

export default entry;
