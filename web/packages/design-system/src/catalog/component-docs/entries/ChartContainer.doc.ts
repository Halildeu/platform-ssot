import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ChartContainer",
  indexItem: {
    "name": "ChartContainer",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Container",
    "demoMode": "live",
    "description": "Tum chart bilesenleri icin ortak sarmalayici; baslik, aciklama, loading, error ve empty state yonetimini tek noktadan saglar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback",
      "responsive_layout"
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
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { ChartContainer } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ChartContainer",
    "variantAxes": [
      "state: loading | error | empty | populated"
    ],
    "stateModel": [
      "loading",
      "error",
      "empty",
      "populated"
    ],
    "previewStates": [
      "loading",
      "error",
      "empty",
      "populated",
      "dark-theme"
    ],
    "behaviorModel": [
      "state-driven content switching",
      "loading skeleton overlay",
      "error boundary with retry",
      "empty state illustration",
      "responsive height calculation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Chart baslik metni."
      },
      {
        "name": "description",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Chart aciklama metni."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yukleniyor durumunu aktif eder ve skeleton overlay gosterir."
      },
      {
        "name": "error",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hata durumunu aktif eder ve error mesaji gosterir."
      },
      {
        "name": "empty",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Bos veri durumunu aktif eder ve empty state gosterir."
      },
      {
        "name": "emptyLabel",
        "type": "string",
        "default": "Veri bulunamadi",
        "required": false,
        "description": "Bos durum mesaj metni."
      },
      {
        "name": "height",
        "type": "number | string",
        "default": "300",
        "required": false,
        "description": "Chart alani yuksekligi (px veya CSS degeri)."
      },
      {
        "name": "actions",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Baslik satiri sag tarafina yerlestirilen aksiyon slot alani."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Chart icerik alani; populated durumunda goruntulenir."
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
        "description": "Container boyut varyantini belirler."
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
      "loading skeleton transition",
      "error state with retry",
      "empty state illustration",
      "populated chart content"
    ],
    "regressionFocus": [
      "state gecis onceligi (loading > error > empty > populated)",
      "responsive height hesaplama",
      "action slot layout stabilitesi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
