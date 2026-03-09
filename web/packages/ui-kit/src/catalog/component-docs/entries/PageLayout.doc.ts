import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PageLayout",
  indexItem: {
  "name": "PageLayout",
  "kind": "component",
  "importStatement": "import { PageLayout } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-access/src/pages/access/AccessPage.ui.tsx",
    "web/apps/mfe-reporting/src/app/reporting/ReportPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx",
    "web/apps/mfe-shell/src/pages/runtime/ThemeMatrixPage.tsx",
    "web/apps/mfe-users/src/pages/users/UsersPage.ui.tsx"
  ],
  "group": "page_blocks",
  "subgroup": "page_shell",
  "tags": [
    "layout",
    "page-blocks",
    "page-shell",
    "stable",
    "wave-7"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Page Shell",
  "demoMode": "live",
  "description": "Route seviyesinde breadcrumb, title, actions, filters ve detail shell davranisini standartlastirir.",
  "sectionIds": [
    "component_library_management",
    "responsive_layout",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "domain_based_information_architecture",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1"
},
  apiItem: {
  "name": "PageLayout",
  "variantAxes": [
    "surface: content-only | detail-sidebar",
    "header: title-only | actions | filters",
    "footer: none | sticky-summary"
  ],
  "stateModel": [
    "breadcrumb visibility",
    "header action wrap",
    "detail rail presence",
    "filter bar slot rendering"
  ],
  "props": [
    {
      "name": "title / description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header title ve aciklama alani."
    },
    {
      "name": "breadcrumbItems",
      "type": "PageBreadcrumbItem[]",
      "default": "-",
      "required": false,
      "description": "Route breadcrumb kaynagi."
    },
    {
      "name": "actions / headerExtra",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Sag ust aksiyon ve ek bilgi alani."
    },
    {
      "name": "filterBar",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Sayfa filtre shell slotu."
    },
    {
      "name": "detail / footer",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Detail rail ve footer slotlari."
    }
  ],
  "previewFocus": [
    "directory page shell",
    "detail sidebar layout",
    "header action wrap"
  ],
  "regressionFocus": [
    "breadcrumb render parity",
    "detail slot sizing",
    "filter bar placement"
  ]
},
};

export default entry;
