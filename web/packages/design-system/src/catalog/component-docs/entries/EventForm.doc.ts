import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EventForm",
  indexItem: {
    "name": "EventForm",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_scheduler",
    "subgroup": "scheduler",
    "taxonomyGroupId": "x_scheduler",
    "taxonomySubgroup": "Event form",
    "demoMode": "planned",
    "description": "Takvim etkinligi olusturma ve duzenleme formu; tarih/saat, tekrar, katilimci ve hatirlatici alanlari icerir.",
    "sectionIds": [
      "component_library_management",
      "form_controls",
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
    "importStatement": "import { EventForm } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EventForm",
    "variantAxes": [
      "mode: create | edit",
      "layout: inline | modal"
    ],
    "stateModel": [
      "idle",
      "editing",
      "submitting",
      "error"
    ],
    "previewStates": [
      "create-mode",
      "edit-mode",
      "with-recurrence",
      "validation-error",
      "dark-theme"
    ],
    "behaviorModel": [
      "date/time range selection",
      "recurrence rule configuration",
      "attendee picker integration",
      "reminder setup",
      "form validation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "event",
        "type": "SchedulerEvent | null",
        "default": "null",
        "required": false,
        "description": "Duzenleme modunda mevcut etkinlik verisi; null ise olusturma modu."
      },
      {
        "name": "onSubmit",
        "type": "(event: SchedulerEvent) => Promise<void>",
        "default": "-",
        "required": true,
        "description": "Form gonderildiginde tetiklenen async callback."
      },
      {
        "name": "onCancel",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Iptal butonuna basildiginda tetiklenen callback."
      },
      {
        "name": "defaultStart",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Olusturma modunda varsayilan baslangic tarihi/saati."
      },
      {
        "name": "defaultEnd",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Olusturma modunda varsayilan bitis tarihi/saati."
      },
      {
        "name": "enableRecurrence",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Tekrar kurali yapilandirma alanini gosterir veya gizler."
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
        "description": "Form boyut varyantini belirler."
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
      "create vs edit mode",
      "recurrence configuration",
      "validation error display"
    ],
    "regressionFocus": [
      "tarih/saat validasyon dogrulugu",
      "tekrar kurali olusturma",
      "form submit/cancel akisi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
