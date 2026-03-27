import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "buildEntityGridQueryParams",
  indexItem: {
  "name": "buildEntityGridQueryParams",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "data-grid",
  "subgroup": "entity-grid",
  "taxonomyGroupId": "utilities",
  "taxonomySubgroup": "buildEntityGridQueryParams",
  "demoMode": "inspector",
  "description": "Grid state bilgisini backend query param’lerine ceviren helper.",
  "sectionIds": [
    "table_data_display",
    "utility_components",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { buildEntityGridQueryParams } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "buildEntityGridQueryParams",
  "variantAxes": [
    "search: empty | populated",
    "sort: single | multi-column",
    "filters: native | mapped-advanced"
  ],
  "stateModel": [
    "page/pageSize derivation",
    "quick filter normalization",
    "sort serialization",
    "filter and advancedFilter merge"
  ],
    "previewStates": [],
    "behaviorModel": [
      "page/pageSize derivation",
      "quick filter normalization",
      "sort serialization",
      "filter and advancedFilter merge"
    ],
  "props": [
    {
      "name": "options.request",
      "type": "IServerSideGetRowsRequest",
      "default": "-",
      "required": true,
      "description": "AG Grid server-side request nesnesinden page, pageSize, sort ve filter bilgisini turetir."
    },
    {
      "name": "options.quickFilterText",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Trimlenmis quick filter metnini search query param'ina cevirir."
    },
    {
      "name": "options.mapFilterModel",
      "type": "(filterModel) => Partial<EntityGridQueryParams>",
      "default": "-",
      "required": false,
      "description": "Grid filterModel yapisini backend'e uygun ek query param'lere map eder."
    },
    {
      "name": "options.mapAdvancedFilter",
      "type": "(advancedFilterModel) => Record<string, unknown> | null",
      "default": "-",
      "required": false,
      "description": "Advanced filter payload'ini JSON + encodeURIComponent ile advancedFilter alanina yazar."
    }
  ],
  "previewFocus": [
    "grid request to query params",
    "multi-sort serialization",
    "advanced filter mapping"
  ],
  "regressionFocus": [
    "page/pageSize math",
    "sort join stability",
    "advanced filter encode fallback"
  ]
},
};

export default entry;
