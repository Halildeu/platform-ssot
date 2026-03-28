import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ActivityFeed",
  indexItem: {
    "name": "ActivityFeed",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "collaboration",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "aktivite akisi, sosyal bildirim, zaman cizgisi",
    "demoMode": "live",
    "description": "Tur bazli simgeler, aktor avatarlari, goreli zaman damgalari ve istege bagli tarih gruplama ile kronolojik olaylari gosteren sosyal tarzi aktivite akisi.",
    "sectionIds": [
      "component_library_management"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility"
    ],
    "tags": [
      "enterprise",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_14_enterprise_suite",
    "acceptanceContractId": "ui-library-wave-14-enterprise-suite-v1",
    "importStatement": "import { ActivityFeed } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ActivityFeed",
    "variantAxes": [
      "groupByDate: true | false",
      "showLoadMore: true | false"
    ],
    "stateModel": [
      "default",
      "grouped-by-date",
      "with-pagination"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "type-based icon and color mapping",
      "relative timestamp display",
      "date grouping (Bugun, Dun, X gun once)",
      "load more pagination",
      "actor avatar with initials fallback",
      "connector line between items",
      "item click interaction"
    ],
    "props": [
      { "name": "items", "type": "ActivityItem[]", "default": "-", "required": true, "description": "Goruntulenecek aktivite ogeleri." },
      { "name": "onItemClick", "type": "(item: ActivityItem) => void", "default": "-", "required": false, "description": "Oge tiklandiginda tetiklenir." },
      { "name": "maxVisible", "type": "number", "default": "-", "required": false, "description": "Baslangicta gorunen maksimum oge sayisi." },
      { "name": "showLoadMore", "type": "boolean", "default": "false", "required": false, "description": "Daha fazla yukle dugmesini gosterir." },
      { "name": "onLoadMore", "type": "() => void", "default": "-", "required": false, "description": "Daha fazla oge yuklemek icin callback." },
      { "name": "groupByDate", "type": "boolean", "default": "false", "required": false, "description": "Ogeleri tarihe gore gruplar." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "type-based icon colors",
      "date grouping headers",
      "connector lines"
    ],
    "regressionFocus": [
      "bos aktivite listesi",
      "tek ogeli akis",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
