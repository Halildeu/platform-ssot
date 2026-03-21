import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ResourceView",
  indexItem: {
    "name": "ResourceView",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "scheduler",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Scheduler Resource",
    "demoMode": "planned",
    "description": "Kaynak bazli takvim gorunumu; her kaynak icin ayri satir ile etkinlikleri zaman cizgisi uzerinde gorsellestirir.",
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
    "importStatement": "import { ResourceView } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ResourceView",
    "variantAxes": [
      "timeScale: hour | day | week",
      "resourceLayout: rows | columns"
    ],
    "stateModel": [
      "default",
      "empty",
      "loading"
    ],
    "previewStates": [
      "multi-resource",
      "single-resource",
      "empty-timeline",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "resource row rendering",
      "timeline event positioning",
      "drag-to-create event",
      "event resize on timeline",
      "resource filter/search",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "resources",
        "type": "Resource[]",
        "default": "[]",
        "required": true,
        "description": "Zaman cizgisi satirlarinda gosterilecek kaynak dizisi."
      },
      {
        "name": "events",
        "type": "SchedulerEvent[]",
        "default": "[]",
        "required": true,
        "description": "Kaynaklara atanmis etkinlik dizisi."
      },
      {
        "name": "timeScale",
        "type": "'hour' | 'day' | 'week'",
        "default": "day",
        "required": false,
        "description": "Zaman cizgisi olcek birimi."
      },
      {
        "name": "startDate",
        "type": "Date",
        "default": "new Date()",
        "required": false,
        "description": "Gorunum baslangic tarihi."
      },
      {
        "name": "onEventCreate",
        "type": "(resourceId: string, start: Date, end: Date) => void",
        "default": "-",
        "required": false,
        "description": "Surukleyerek yeni etkinlik olusturuldigunda tetiklenen callback."
      },
      {
        "name": "onEventResize",
        "type": "(eventId: string, start: Date, end: Date) => void",
        "default": "-",
        "required": false,
        "description": "Etkinlik boyutu degistirildiginde tetiklenen callback."
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
        "description": "Gorunum boyut varyantini belirler."
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
      "resource row timeline",
      "drag-to-create interaction",
      "event resize behavior"
    ],
    "regressionFocus": [
      "etkinlik pozisyon hesaplama dogrulugu",
      "drag-to-create zaman dilimi hizalama",
      "bos kaynak satir gorunumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
