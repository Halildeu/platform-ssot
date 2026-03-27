import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createBreadcrumbItemsFromRoute",
  indexItem: {
  "name": "createBreadcrumbItemsFromRoute",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "breadcrumb",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "createBreadcrumbItemsFromRoute",
  "demoMode": "inspector",
  "description": "String veya typed route girdilerini BreadcrumbItem dizisine normalize eder ve current fallback'ini uygular.",
  "sectionIds": [
    "utility_components",
    "navigation_patterns",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createBreadcrumbItemsFromRoute } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "createBreadcrumbItemsFromRoute",
  "variantAxes": [
    "input: string[] | typed route objects",
    "current: auto-last | explicit"
  ],
  "stateModel": [
    "string to BreadcrumbItem normalization",
    "typed route to BreadcrumbItem mapping",
    "auto-last current fallback",
    "explicit current override"
  ],
    "previewStates": [],
    "behaviorModel": [
      "string to BreadcrumbItem normalization",
      "typed route to BreadcrumbItem mapping",
      "auto-last current fallback",
      "explicit current override"
    ],
  "props": [
    {
      "name": "routes",
      "type": "Array<string | { label: string; href?: string; current?: boolean }>",
      "default": "-",
      "required": true,
      "description": "String veya typed route girdilerini BreadcrumbItem dizisine cevirir; son eleman otomatik current olarak isaretlenir."
    }
  ],
  "previewFocus": [
    "string array normalization",
    "typed route with href mapping",
    "auto-last current fallback"
  ],
  "regressionFocus": [
    "explicit current override parity",
    "empty array edge case",
    "single item current flag"
  ]
},
};

export default entry;
