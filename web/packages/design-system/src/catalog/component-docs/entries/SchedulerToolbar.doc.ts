import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SchedulerToolbar",
  indexItem: {
    "name": "SchedulerToolbar",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_scheduler",
    "subgroup": "scheduler",
    "taxonomyGroupId": "x_scheduler",
    "taxonomySubgroup": "Scheduler toolbar",
    "demoMode": "planned",
    "description": "Takvim gorunum modu degistirme, tarih navigasyonu ve bugune don aksiyonlarini barindiran ust toolbar bileseni.",
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
    "importStatement": "import { SchedulerToolbar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SchedulerToolbar",
    "variantAxes": [
      "layout: standard | compact"
    ],
    "stateModel": [
      "idle",
      "navigating"
    ],
    "previewStates": [
      "day-selected",
      "week-selected",
      "month-selected",
      "dark-theme"
    ],
    "behaviorModel": [
      "view mode segmented switching",
      "prev/next date navigation",
      "today quick-jump action",
      "locale-aware date formatting",
      "keyboard navigation support",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "view",
        "type": "'day' | 'week' | 'month'",
        "default": "week",
        "required": false,
        "description": "Aktif gorunum modunu belirler."
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
        "description": "Tarih navigasyonu yapildiginda tetiklenen callback."
      },
      {
        "name": "locale",
        "type": "string",
        "default": "tr",
        "required": false,
        "description": "Tarih formatlama icin yerellesme kodu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "todayLabel",
        "type": "string",
        "default": "Bugun",
        "required": false,
        "description": "Bugune don butonunun etiket metni."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Toolbar boyut varyantini belirler."
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
      "view mode switching interaction",
      "date navigation prev/next",
      "today button behavior"
    ],
    "regressionFocus": [
      "gorunum modu degisim callback dogrulugu",
      "tarih navigasyonu sinir kosuklari",
      "locale formatlamasi tutarliligi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
