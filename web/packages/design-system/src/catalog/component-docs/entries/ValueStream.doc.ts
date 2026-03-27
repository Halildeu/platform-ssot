import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ValueStream",
  indexItem: {
    "name": "ValueStream",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "diagrams",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Lean deger akisi haritasi",
    "demoMode": "live",
    "description": "Surec adimlari, bekleme sureleri ve PCE metriklerini gosteren lean deger akisi haritasi; kategori bazli renklendirme ve zaman cubugu sunar.",
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
    "importStatement": "import { ValueStream } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ValueStream",
    "variantAxes": [
      "timeUnit: minutes | hours | days"
    ],
    "stateModel": [
      "default",
      "with-waits",
      "categorized"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "process step box rendering with category colors",
      "wait arrow connectors with duration",
      "PCE timeline bar calculation",
      "step click interaction",
      "time unit formatting"
    ],
    "props": [
      { "name": "steps", "type": "ValueStreamStep[]", "default": "-", "required": true, "description": "Deger akisindaki surec adimlari." },
      { "name": "waits", "type": "ValueStreamWait[]", "default": "[]", "required": false, "description": "Ardisik adimlar arasi bekleme/kuyruk sureleri." },
      { "name": "timeUnit", "type": "TimeUnit", "default": "minutes", "required": false, "description": "Tum zaman degerleri icin olcum birimi." },
      { "name": "onStepClick", "type": "(stepId: string) => void", "default": "-", "required": false, "description": "Surec adimi tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "step category color coding",
      "wait time arrows",
      "PCE metrics bar"
    ],
    "regressionFocus": [
      "bos steps dizisi",
      "waits uzunlugu steps-1 den farkli",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
