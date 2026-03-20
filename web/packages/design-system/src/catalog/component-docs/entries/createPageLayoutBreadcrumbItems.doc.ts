import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createPageLayoutBreadcrumbItems",
  indexItem: {
  "name": "createPageLayoutBreadcrumbItems",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "page_blocks",
  "subgroup": "page_shell",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "String veya typed route girdilerini PageLayout breadcrumb item dizisine normalize eder ve current fallback'ini uygular.",
  "sectionIds": [
    "utility_components",
    "page_structure_blocks",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createPageLayoutBreadcrumbItems } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-access/src/pages/access/AccessPage.ui.tsx",
    "web/apps/mfe-reporting/src/app/reporting/ReportPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/runtime/ThemeMatrixPage.tsx",
    "web/apps/mfe-users/src/pages/users/UsersPage.ui.tsx"
  ]
},
  apiItem: {
  "name": "createPageLayoutBreadcrumbItems",
  "variantAxes": [
    "input: string[] | PageLayoutRouteInput[]",
    "current: auto-last | explicit"
  ],
  "stateModel": [
    "string to PageBreadcrumbItem normalization",
    "typed route to breadcrumb mapping with href/onClick",
    "auto-last current fallback when no explicit current",
    "explicit current override"
  ],
    "previewStates": [],
    "behaviorModel": [
      "string to PageBreadcrumbItem normalization",
      "typed route to breadcrumb mapping with href/onClick",
      "auto-last current fallback when no explicit current",
      "explicit current override"
    ],
  "props": [
    {
      "name": "inputs",
      "type": "PageLayoutRouteInput[]",
      "default": "-",
      "required": true,
      "description": "String veya typed route girdilerini PageLayout breadcrumb item dizisine normalize eder; son eleman otomatik current olarak isaretlenir."
    }
  ],
  "previewFocus": [
    "string array normalization",
    "typed route with href and onClick",
    "auto-last current fallback"
  ],
  "regressionFocus": [
    "explicit current flag override",
    "label vs title field fallback",
    "href vs path field mapping",
    "single item current flag"
  ]
},
};

export default entry;
