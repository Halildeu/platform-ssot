import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "StatWidget",
  indexItem: {
    "name": "StatWidget",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Stat",
    "demoMode": "planned",
    "description": "Istatistik ozet widget'i; ikon, deger, baslik ve karsilastirma bilgisini kompakt formatta sunar.",
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
      "charts",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { StatWidget } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "StatWidget",
    "variantAxes": [
      "layout: horizontal | vertical",
      "iconPosition: left | top"
    ],
    "stateModel": [
      "default",
      "loading",
      "highlighted"
    ],
    "previewStates": [
      "default",
      "horizontal-layout",
      "with-icon",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "stat value formatting",
      "comparison delta display",
      "icon slot rendering",
      "loading skeleton state",
      "highlighted accent state",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "Istatistik basligi."
      },
      {
        "name": "value",
        "type": "number | string",
        "default": "-",
        "required": true,
        "description": "Ana istatistik degeri."
      },
      {
        "name": "icon",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Sol veya ust konumda gosterilecek ikon."
      },
      {
        "name": "delta",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Karsilastirma donemi degisim metni."
      },
      {
        "name": "deltaType",
        "type": "'positive' | 'negative' | 'neutral'",
        "default": "neutral",
        "required": false,
        "description": "Delta degerinin olumlu/olumsuz/notr tipi."
      },
      {
        "name": "layout",
        "type": "'horizontal' | 'vertical'",
        "default": "vertical",
        "required": false,
        "description": "Widget icerik yerlesim yonu."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yuklenme durumunda skeleton gosterir."
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
        "description": "Widget boyut varyantini belirler."
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
      "horizontal vs vertical layout",
      "delta indicator rendering",
      "icon integration"
    ],
    "regressionFocus": [
      "delta tipi renk esleme dogrulugu",
      "loading skeleton gorunumu",
      "ikon pozisyon varyantlari",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
