import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DecisionMatrix",
  indexItem: {
    "name": "DecisionMatrix",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "strategy",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "karar matrisi, agirlikli puanlama, opsiyon degerlendirme",
    "demoMode": "live",
    "description": "Kriterlere gore opsiyonlari degerlendiren, agirlikli toplamlar ve kazanan vurgulama ile karar puanlama tablosu.",
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
    "importStatement": "import { DecisionMatrix } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "DecisionMatrix",
    "variantAxes": [
      "showWeightedTotals: true | false",
      "highlightWinner: true | false"
    ],
    "stateModel": [
      "default",
      "with-totals",
      "editable-scores"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "HTML table with options as columns, criteria as rows",
      "weight column with percentage display",
      "score cells color-coded by value ratio",
      "score bar visual indicator per cell",
      "inline score editing (click to change)",
      "weighted total calculation row",
      "winner column highlight (green)",
      "keyboard-accessible score cells"
    ],
    "props": [
      { "name": "options", "type": "DecisionOption[]", "default": "-", "required": true, "description": "Karar opsiyonlari (tablo sutunlari)." },
      { "name": "criteria", "type": "DecisionCriterion[]", "default": "-", "required": true, "description": "Degerlendirme kriterleri (tablo satirlari)." },
      { "name": "scores", "type": "DecisionScore[]", "default": "-", "required": true, "description": "Puan verileri." },
      { "name": "onScoreChange", "type": "(optionId: string, criterionId: string, score: number) => void", "default": "-", "required": false, "description": "Puan degistirildiginde tetiklenir." },
      { "name": "maxScore", "type": "number", "default": "10", "required": false, "description": "Maksimum puan degeri." },
      { "name": "showWeightedTotals", "type": "boolean", "default": "true", "required": false, "description": "Agirlikli toplam satirini gosterir." },
      { "name": "highlightWinner", "type": "boolean", "default": "true", "required": false, "description": "Kazanan sutunu vurgular." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "color-coded score cells",
      "winner column highlight",
      "weighted totals row"
    ],
    "regressionFocus": [
      "bos scores dizisi",
      "esit puanli opsiyonlar",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
