import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "createPageLayoutPreset",
  indexItem: {
  "name": "createPageLayoutPreset",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "page_blocks",
  "subgroup": "page_shell",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Functions",
  "demoMode": "inspector",
  "description": "Content-only, detail-sidebar ve ops-workspace gibi canonical PageLayout preset varsayimlarini dondurur.",
  "sectionIds": [
    "utility_components",
    "page_structure_blocks",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { createPageLayoutPreset } from '@mfe/design-system';",
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
  "name": "createPageLayoutPreset",
  "variantAxes": [
    "preset: content-only | detail-sidebar | ops-workspace"
  ],
  "stateModel": [
    "preset to PageLayout props mapping",
    "pageWidth default resolution",
    "stickyHeader default resolution",
    "responsive detail collapse configuration"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preset to PageLayout props mapping",
      "pageWidth default resolution",
      "stickyHeader default resolution",
      "responsive detail collapse configuration"
    ],
  "props": [
    {
      "name": "options",
      "type": "PageLayoutPresetOptions",
      "default": "-",
      "required": true,
      "description": "Preset turunu ve opsiyonel override alanlari (pageWidth, stickyHeader, currentBreadcrumbMode, responsiveDetailBreakpoint) tasir."
    },
    {
      "name": "options.preset",
      "type": "'content-only' | 'detail-sidebar' | 'ops-workspace'",
      "default": "-",
      "required": true,
      "description": "Canonical PageLayout preset varsayimlarini belirler."
    }
  ],
  "previewFocus": [
    "content-only minimal layout",
    "detail-sidebar responsive collapse",
    "ops-workspace full-width sticky"
  ],
  "regressionFocus": [
    "preset output prop parity",
    "override field precedence",
    "responsive breakpoint default"
  ]
},
};

export default entry;
