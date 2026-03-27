import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AgingBuckets",
  indexItem: {
    "name": "AgingBuckets",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Yasi gruplama analizi",
    "demoMode": "live",
    "description": "Yas gruplama analizini kova kartlari, istifli yuzde cubugu ve toplamlarla gorsellestirir; yatay/dikey yonelim ve ton bazli renklendirme destekler.",
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
    "importStatement": "import { AgingBuckets } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "AgingBuckets",
    "variantAxes": [
      "orientation: horizontal | vertical",
      "showStackedBar: true | false"
    ],
    "stateModel": [
      "default",
      "with-stacked-bar",
      "vertical"
    ],
    "previewStates": ["default-grid", "data-loaded"],
    "behaviorModel": [
      "bucket card rendering with count and value",
      "stacked percentage bar",
      "tone-based color assignment",
      "bucket click interaction",
      "number formatting"
    ],
    "props": [
      { "name": "buckets", "type": "AgingBucket[]", "default": "-", "required": true, "description": "Gosterilecek yas gruplama veri ogeleri." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "horizontal", "required": false, "description": "Kova kartlari yonelimi." },
      { "name": "showStackedBar", "type": "boolean", "default": "false", "required": false, "description": "Kartlarin ustunde istifli yuzde cubugu gosterir." },
      { "name": "formatOptions", "type": "FormatOptions", "default": "{}", "required": false, "description": "Sayi formatlama secenekleri." },
      { "name": "onBucketClick", "type": "(bucket: AgingBucket) => void", "default": "-", "required": false, "description": "Kova karti veya cubuk segmentine tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "bucket card layout",
      "stacked bar rendering",
      "tone color assignment"
    ],
    "regressionFocus": [
      "bos buckets dizisi",
      "toplam deger sifir durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
