import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Scheduler",
  indexItem: {
    "name": "Scheduler",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "scheduler",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Scheduler",
    "demoMode": "planned",
    "description": "Takvim tabanli etkinlik ve kaynak yonetimi icin ana container bileseni. Gun, hafta ve ay gorunumlerini destekler.",
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
    "importStatement": "import { Scheduler } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Scheduler",
    "variantAxes": [
      "view: day | week | month"
    ],
    "stateModel": [
      "empty",
      "loaded",
      "dragging"
    ],
    "previewStates": [
      "day-view",
      "week-view",
      "month-view",
      "dark-theme"
    ],
    "behaviorModel": [
      "multi-view calendar rendering",
      "event drag-and-drop repositioning",
      "slot click for new event creation",
      "resource-based row grouping",
      "keyboard date navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "events",
        "type": "SchedulerEvent[]",
        "default": "[]",
        "required": true,
        "description": "Takvimde goruntulecek etkinlik nesneleri dizisi."
      },
      {
        "name": "resources",
        "type": "SchedulerResource[]",
        "default": "-",
        "required": false,
        "description": "Kaynak bazli gruplama icin kaynak nesneleri dizisi."
      },
      {
        "name": "view",
        "type": "'day' | 'week' | 'month'",
        "default": "week",
        "required": false,
        "description": "Aktif takvim gorunum modu."
      },
      {
        "name": "date",
        "type": "Date",
        "default": "new Date()",
        "required": false,
        "description": "Takvimin odaklandigi referans tarih."
      },
      {
        "name": "onViewChange",
        "type": "(view: string) => void",
        "default": "-",
        "required": false,
        "description": "Gorunum modu degistiginde tetiklenen callback."
      },
      {
        "name": "onDateChange",
        "type": "(date: Date) => void",
        "default": "-",
        "required": false,
        "description": "Referans tarih degistiginde tetiklenen callback."
      },
      {
        "name": "onEventClick",
        "type": "(event: SchedulerEvent) => void",
        "default": "-",
        "required": false,
        "description": "Etkinlige tiklandiginda tetiklenen callback."
      },
      {
        "name": "onEventDrop",
        "type": "(event: SchedulerEvent, start: Date, end: Date) => void",
        "default": "-",
        "required": false,
        "description": "Etkinlik surukle-birak ile tasindiktan sonra tetiklenen callback."
      },
      {
        "name": "onSlotClick",
        "type": "(slotInfo: SlotInfo) => void",
        "default": "-",
        "required": false,
        "description": "Bos zaman dilimi tiklandiginda tetiklenen callback."
      },
      {
        "name": "locale",
        "type": "string",
        "default": "tr",
        "required": false,
        "description": "Tarih ve saat formatlama icin yerellesme kodu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "hourStart",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Gun gorunumunde goruntulenen baslangic saati (0-23)."
      },
      {
        "name": "hourEnd",
        "type": "number",
        "default": "24",
        "required": false,
        "description": "Gun gorunumunde goruntulenen bitis saati (1-24)."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Scheduler boyut varyantini belirler."
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
      "day/week/month view transitions",
      "event rendering and overlap handling",
      "drag-and-drop repositioning"
    ],
    "regressionFocus": [
      "gorunum gecis animasyonlari",
      "etkinlik cakisma hesaplamalari",
      "drag-drop sonrasi callback dogrulugu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
