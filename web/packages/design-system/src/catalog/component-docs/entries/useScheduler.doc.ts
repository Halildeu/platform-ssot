import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useScheduler",
  indexItem: {
    "name": "useScheduler",
    "kind": "hook",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_scheduler",
    "subgroup": "scheduler",
    "taxonomyGroupId": "hooks",
    "taxonomySubgroup": "X-Scheduler Hooks",
    "demoMode": "inspector",
    "description": "Scheduler state yonetimi, etkinlik CRUD islemleri ve gorunum gecislerini kapsayan hook.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
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
      "scheduler",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { useScheduler } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "useScheduler",
    "variantAxes": [
      "view-state: day | week | month",
      "event-state: idle | loading | error"
    ],
    "stateModel": [
      "view management",
      "date navigation state",
      "event collection state",
      "drag-drop coordination"
    ],
    "previewStates": [
      "idle",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "view and date state management",
      "event CRUD operations",
      "drag-drop state coordination",
      "event conflict detection",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "initialView",
        "type": "'day' | 'week' | 'month'",
        "default": "week",
        "required": false,
        "description": "Baslangic gorunum modunu belirler."
      },
      {
        "name": "initialDate",
        "type": "Date",
        "default": "new Date()",
        "required": false,
        "description": "Baslangic referans tarihini belirler."
      },
      {
        "name": "events",
        "type": "SchedulerEvent[]",
        "default": "[]",
        "required": false,
        "description": "Yonetilecek etkinlik nesneleri dizisi."
      }
    ],
    "previewFocus": [
      "state initialization and defaults",
      "view/date transition lifecycle",
      "event mutation callbacks"
    ],
    "regressionFocus": [
      "state gecis tutarliligi",
      "etkinlik cakisma algilama dogrulugu",
      "drag-drop koordinasyon paritesi",
      "bos etkinlik listesi edge case"
    ]
  },
};

export default entry;
