import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SchedulerEvent",
  indexItem: {
    "name": "SchedulerEvent",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_scheduler",
    "subgroup": "scheduler",
    "taxonomyGroupId": "x_scheduler",
    "taxonomySubgroup": "Scheduler event",
    "demoMode": "planned",
    "description": "Takvim uzerinde tek bir etkinligi gorsel olarak temsil eden bilesen. Compact ve standart gorunum modlarini destekler.",
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
    "importStatement": "import { SchedulerEvent } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SchedulerEvent",
    "variantAxes": [
      "display: standard | compact"
    ],
    "stateModel": [
      "idle",
      "hovered",
      "dragging"
    ],
    "previewStates": [
      "standard",
      "compact",
      "dragging",
      "dark-theme"
    ],
    "behaviorModel": [
      "event visual representation",
      "compact mode for narrow time slots",
      "drag initiation for repositioning",
      "click interaction for detail view",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "event",
        "type": "SchedulerEvent",
        "default": "-",
        "required": true,
        "description": "Goruntulecek etkinlik nesnesinin tum verilerini icerir."
      },
      {
        "name": "compact",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Dar zaman dilimlerinde kisaltilmis gorunum modunu aktif eder."
      },
      {
        "name": "onClick",
        "type": "(event: SchedulerEvent) => void",
        "default": "-",
        "required": false,
        "description": "Etkinlige tiklandiginda tetiklenen callback."
      },
      {
        "name": "onDragStart",
        "type": "(event: SchedulerEvent) => void",
        "default": "-",
        "required": false,
        "description": "Surukle-birak islemi basladiginda tetiklenen callback."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Etkinlik karti boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "standard vs compact rendering",
      "drag handle interaction",
      "event color coding"
    ],
    "regressionFocus": [
      "compact mod tasma kontrolu",
      "drag-start callback dogrulugu",
      "hover state token uyumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
