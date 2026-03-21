import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AgendaView",
  indexItem: {
    "name": "AgendaView",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "scheduler",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Scheduler Agenda",
    "demoMode": "planned",
    "description": "Takvim etkinliklerini kronolojik liste gorunumunde sunan agenda bileseni; gun bazli gruplama ve hizli filtre destegi saglar.",
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
    "importStatement": "import { AgendaView } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "AgendaView",
    "variantAxes": [
      "range: day | week | month",
      "groupBy: date | category"
    ],
    "stateModel": [
      "default",
      "empty",
      "loading"
    ],
    "previewStates": [
      "daily-agenda",
      "weekly-agenda",
      "empty-state",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "chronological event listing",
      "date-grouped sections",
      "event click navigation",
      "infinite scroll pagination",
      "filter by category",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "events",
        "type": "SchedulerEvent[]",
        "default": "[]",
        "required": true,
        "description": "Agenda listesinde gosterilecek etkinlik dizisi."
      },
      {
        "name": "range",
        "type": "'day' | 'week' | 'month'",
        "default": "week",
        "required": false,
        "description": "Agenda zaman araligi."
      },
      {
        "name": "startDate",
        "type": "Date",
        "default": "new Date()",
        "required": false,
        "description": "Agenda baslangic tarihi."
      },
      {
        "name": "onEventClick",
        "type": "(event: SchedulerEvent) => void",
        "default": "-",
        "required": false,
        "description": "Etkinlige tiklandiginda tetiklenen callback."
      },
      {
        "name": "groupBy",
        "type": "'date' | 'category'",
        "default": "date",
        "required": false,
        "description": "Etkinlik gruplama kriteri."
      },
      {
        "name": "emptyMessage",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Etkinlik bulunmadiginda gosterilecek mesaj."
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
        "description": "Agenda boyut varyantini belirler."
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
      "chronological event list",
      "date-grouped sections",
      "empty state rendering"
    ],
    "regressionFocus": [
      "tarih gruplama siralama dogrulugu",
      "bos durum mesaj gorunumu",
      "infinite scroll sayfalama",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
