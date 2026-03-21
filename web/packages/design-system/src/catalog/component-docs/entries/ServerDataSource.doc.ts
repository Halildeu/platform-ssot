import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ServerDataSource",
  indexItem: {
    "name": "ServerDataSource",
    "kind": "function",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Server Utilities",
    "demoMode": "live",
    "description": "X-Data-Grid icin server-side veri kaynagi olusturan fabrika fonksiyonu; sayfalama, siralama ve cache yonetimini soyutlar.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "integration_distribution"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "data-grid",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { ServerDataSource } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ServerDataSource",
    "variantAxes": [
      "fetch-state: idle | loading | loaded | error",
      "cache-strategy: block | none"
    ],
    "stateModel": [
      "loading",
      "loaded",
      "error"
    ],
    "previewStates": [
      "loading",
      "loaded",
      "error"
    ],
    "behaviorModel": [
      "server-side row fetching",
      "cache block management",
      "error state propagation",
      "pagination parameter forwarding",
      "sort model serialization",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "fetchRows",
        "type": "(params: FetchRowsParams) => Promise<FetchRowsResult>",
        "default": "-",
        "required": true,
        "description": "Sayfa, siralama ve filtre parametrelerine gore satir verisi ceken asenkron fonksiyon."
      },
      {
        "name": "cacheBlockSize",
        "type": "number",
        "default": "100",
        "required": false,
        "description": "Tek seferde onbellege alinacak satir blogu boyutu."
      }
    ],
    "previewFocus": [
      "loading skeleton transition",
      "loaded data render",
      "error fallback display"
    ],
    "regressionFocus": [
      "cache block invalidation",
      "concurrent fetch race condition",
      "error state recovery",
      "pagination parameter dogrulugu"
    ]
  },
};

export default entry;
