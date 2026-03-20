import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useAgGridTablePagination",
  indexItem: {
  "name": "useAgGridTablePagination",
  "kind": "hook",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "data-grid",
  "subgroup": "pagination",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Hooks (useX)",
  "demoMode": "inspector",
  "description": "AG Grid pagination API'sini TablePagination ile esitler ve grid footer state'ini tek hook uzerinden yonetir.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { useAgGridTablePagination } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-access/src/widgets/access-management/ui/AccessGrid.ui.tsx",
    "web/apps/mfe-audit/src/app/components/AuditEventFeed.tsx"
  ]
},
  apiItem: {
  "name": "useAgGridTablePagination",
  "variantAxes": [
    "grid-source: row-count | displayed-count | custom-resolver",
    "page-size-sync: passive | imperative",
    "mode: controlled-grid-api snapshot"
  ],
  "stateModel": [
    "registered grid api ref",
    "pagination snapshot cache",
    "page-size sync to grid",
    "derived total-items resolution"
  ],
    "previewStates": [],
    "behaviorModel": [
      "registered grid api ref",
      "pagination snapshot cache",
      "page-size sync to grid",
      "derived total-items resolution"
    ],
  "props": [
    {
      "name": "initialPageSize / totalItems",
      "type": "number / number",
      "default": "10 / 0",
      "required": false,
      "description": "Grid footer snapshot'inin ilk page-size degerini ve fallback toplam kayit sayisini belirler."
    },
    {
      "name": "resolveTotalItems",
      "type": "(api, context) => number",
      "default": "-",
      "required": false,
      "description": "Grid API veya uygulama baglamina gore toplam kayit sayisini kanonik olarak hesaplar."
    },
    {
      "name": "syncPageSizeToGrid",
      "type": "(api, pageSize) => void",
      "default": "-",
      "required": false,
      "description": "Page-size degisimi oldugunda grid'e imperative sink uygulanmasini saglar."
    }
  ],
  "previewFocus": [
    "grid api registration",
    "table footer snapshot parity",
    "page-size to grid sync"
  ],
  "regressionFocus": [
    "snapshot refresh parity",
    "total-items resolver fallback",
    "page-change grid api wiring"
  ]
},
};

export default entry;
