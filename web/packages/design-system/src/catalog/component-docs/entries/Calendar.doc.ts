import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Calendar",
  indexItem: {
    "name": "Calendar",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "date",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Date & Time",
    "demoMode": "live",
    "description": "Tarih secim componenti; single/multiple/range modu, klavye navigasyonu, hafta numaralari, event dots ve locale destegi sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback",
      "accessibility_compliance"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-3",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { Calendar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Calendar",
    "variantAxes": [
      "mode: single | multiple | range",
      "size: sm | md | lg",
      "numberOfMonths: 1 | 2 | 3"
    ],
    "stateModel": [
      "single / multiple / range selection",
      "month navigation",
      "keyboard focus management",
      "range hover preview"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "range-selection",
      "dark-theme"
    ],
    "behaviorModel": [
      "single / multiple / range date selection",
      "month navigation via prev/next buttons",
      "keyboard arrow navigation with focus management",
      "range selection hover preview",
      "min/max date clamping",
      "disabled date predicate"
    ],
    "props": [
      {
        "name": "value",
        "type": "Date | Date[] | null",
        "default": "-",
        "required": false,
        "description": "Secili tarih(ler)."
      },
      {
        "name": "defaultValue",
        "type": "Date | null",
        "default": "-",
        "required": false,
        "description": "Uncontrolled baslangic degeri."
      },
      {
        "name": "mode",
        "type": "'single' | 'multiple' | 'range'",
        "default": "single",
        "required": false,
        "description": "Secim modunu belirler."
      },
      {
        "name": "month",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Controlled gorunen ay."
      },
      {
        "name": "defaultMonth",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Varsayilan gorunen ay."
      },
      {
        "name": "minDate",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Secilebilecek minimum tarih."
      },
      {
        "name": "maxDate",
        "type": "Date",
        "default": "-",
        "required": false,
        "description": "Secilebilecek maksimum tarih."
      },
      {
        "name": "disabledDates",
        "type": "(date: Date) => boolean",
        "default": "-",
        "required": false,
        "description": "Belirli tarihleri devre disi birakan predicate fonksiyonu."
      },
      {
        "name": "highlightedDates",
        "type": "Date[]",
        "default": "-",
        "required": false,
        "description": "Vurgulanan tarih listesi."
      },
      {
        "name": "firstDayOfWeek",
        "type": "0 | 1",
        "default": "1",
        "required": false,
        "description": "Haftanin ilk gunu (0=Pazar, 1=Pazartesi)."
      },
      {
        "name": "showWeekNumbers",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hafta numaralarini gosterir."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Boyut varyanti."
      },
      {
        "name": "showOutsideDays",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Onceki/sonraki ay gunlerini gosterir."
      },
      {
        "name": "numberOfMonths",
        "type": "1 | 2 | 3",
        "default": "1",
        "required": false,
        "description": "Ayni anda gosterilecek ay sayisi."
      },
      {
        "name": "renderDay",
        "type": "(date: Date) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Ozel gun render fonksiyonu."
      },
      {
        "name": "events",
        "type": "CalendarEvent[]",
        "default": "-",
        "required": false,
        "description": "Gun bazinda event dots/badge bilgileri."
      },
      {
        "name": "localeText",
        "type": "CalendarLocaleText",
        "default": "-",
        "required": false,
        "description": "Locale metinleri (ay isimleri, gun isimleri vb.)."
      },
      {
        "name": "onValueChange",
        "type": "(value: Date | Date[] | null) => void",
        "default": "-",
        "required": false,
        "description": "Deger degistiginde cagrilacak callback."
      },
      {
        "name": "onMonthChange",
        "type": "(month: Date) => void",
        "default": "-",
        "required": false,
        "description": "Gorunen ay degistiginde cagrilacak callback."
      },
      {
        "name": "access",
        "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
        "default": "full",
        "required": false,
        "description": "Policy tabanli gorunurluk ve etkilesim kontrolu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      }
    ],
    "previewFocus": [
      "mode matrisi (single / multiple / range)",
      "multi-month layout",
      "event dots ve week numbers"
    ],
    "regressionFocus": [
      "range selection hover preview",
      "keyboard navigation across months",
      "min/max date boundary enforcement",
      "focus management"
    ]
  },
};

export default entry;
