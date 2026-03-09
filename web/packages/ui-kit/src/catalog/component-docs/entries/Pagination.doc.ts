import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Pagination",
  indexItem: {
  "name": "Pagination",
  "kind": "component",
  "importStatement": "import { Pagination } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "navigation",
  "subgroup": "pagination",
  "tags": [
    "beta",
    "flow-navigation",
    "navigation",
    "wave-2"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Pagination",
  "demoMode": "live",
  "description": "Pagination primitivei; server/client modlari, compact sayfalama ve bilgi yogun dataset gezintisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1"
},
  apiItem: {
  "name": "Pagination",
  "variantAxes": [
    "mode: server | client",
    "size: sm | md",
    "density: default | compact"
  ],
  "stateModel": [
    "controlled",
    "uncontrolled",
    "ellipsis range",
    "prev-next guard"
  ],
  "props": [
    {
      "name": "totalItems",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Toplam kayit sayisi ve sayfa sayisi hesabinin kaynagidir."
    },
    {
      "name": "pageSize",
      "type": "number",
      "default": "10",
      "required": false,
      "description": "Tek sayfada gosterilen kayit adedi."
    },
    {
      "name": "page / defaultPage",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Controlled veya uncontrolled page state secimi."
    },
    {
      "name": "mode",
      "type": "'server' | 'client'",
      "default": "server",
      "required": false,
      "description": "Dataset kaynagina gore bilgi etiketi ve davranis tonunu belirler."
    },
    {
      "name": "compact / showPageInfo",
      "type": "boolean",
      "default": "false / true",
      "required": false,
      "description": "Yoğun grid ve liste ekranlari icin bilgi yogunlugunu ayarlar."
    }
  ],
  "previewFocus": [
    "server-side matrix",
    "compact client-side",
    "ellipsis behavior"
  ],
  "regressionFocus": [
    "page clamp",
    "aria-current",
    "prev-next disabled guards"
  ]
},
};

export default entry;
