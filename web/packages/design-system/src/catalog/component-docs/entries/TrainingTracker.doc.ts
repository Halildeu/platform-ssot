import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TrainingTracker",
  indexItem: {
    "name": "TrainingTracker",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Egitim takip listesi",
    "demoMode": "live",
    "description": "Ilerleme cubuklari, durum filtreleri ve katlanabilir gruplarla egitim uyumlulugu takip bileseni; kategori, durum veya atanan kisi bazinda gruplama destekler.",
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
    "importStatement": "import { TrainingTracker } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "TrainingTracker",
    "variantAxes": [
      "groupBy: category | status | assignee"
    ],
    "stateModel": [
      "ungrouped",
      "grouped-category",
      "grouped-status"
    ],
    "previewStates": ["default-grid", "data-loaded"],
    "behaviorModel": [
      "progress bar per training item",
      "status badge rendering",
      "collapsible group sections",
      "status filter chips",
      "overdue date detection",
      "item click interaction"
    ],
    "props": [
      { "name": "items", "type": "TrainingItem[]", "default": "-", "required": true, "description": "Gosterilecek egitim ogeleri." },
      { "name": "groupBy", "type": "'category' | 'status' | 'assignee'", "default": "-", "required": false, "description": "Ogelerin gruplama stratejisi." },
      { "name": "filterStatuses", "type": "TrainingStatus[]", "default": "tum durumlar", "required": false, "description": "Baslangicta aktif durum filtreleri." },
      { "name": "onItemClick", "type": "(item: TrainingItem) => void", "default": "-", "required": false, "description": "Egitim ogesi satirina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "progress bar rendering",
      "group collapse/expand",
      "status filter interaction"
    ],
    "regressionFocus": [
      "bos items dizisi",
      "tum durumlar filtrelenmis",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
