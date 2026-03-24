import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "GanttTimeline",
  indexItem: {
    "name": "GanttTimeline",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Gantt chart zaman cizelgesi",
    "demoMode": "live",
    "description": "Gorev cubuklari, ilerleme gostergeleri, bagimlilk oklari ve gun/hafta/ay/ceyrek gorunum modlari sunan Gantt zaman cizelgesi bileseni.",
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
    "importStatement": "import { GanttTimeline } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "GanttTimeline",
    "variantAxes": [
      "viewMode: day | week | month | quarter"
    ],
    "stateModel": [
      "day-view",
      "week-view",
      "month-view",
      "quarter-view"
    ],
    "previewStates": ["day-view", "week-view", "month-view", "dark-theme"],
    "behaviorModel": [
      "time axis header rendering per view mode",
      "task bar proportional positioning",
      "progress fill overlay",
      "milestone diamond shape",
      "dependency arrow rendering",
      "group-by row grouping",
      "task click and drag interactions"
    ],
    "props": [
      { "name": "tasks", "type": "GanttTask[]", "default": "-", "required": true, "description": "Zaman cizelgesinde gosterilecek gorev verileri." },
      { "name": "viewMode", "type": "GanttViewMode", "default": "-", "required": false, "description": "Zaman ekseni ayrintisi." },
      { "name": "groupBy", "type": "'group'", "default": "-", "required": false, "description": "Gorevleri belirtilen alana gore gruplar." },
      { "name": "showDependencies", "type": "boolean", "default": "-", "required": false, "description": "Gorevler arasi bagimlilk oklarini render eder." },
      { "name": "onTaskClick", "type": "(task: GanttTask) => void", "default": "-", "required": false, "description": "Gorev cubuguna tiklandiginda tetiklenir." },
      { "name": "onTaskDrag", "type": "(task: GanttTask, newStart: Date, newEnd: Date) => void", "default": "-", "required": false, "description": "Gorev cubugu suruklendiginde tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "view mode switching",
      "dependency arrows",
      "task progress overlay"
    ],
    "regressionFocus": [
      "bos tasks dizisi",
      "tarih araligi disindaki gorevler",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
