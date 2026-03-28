import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "HistogramChart",
  indexItem: {
    "name": "HistogramChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "histogram, frekans dagilimi, istatistik",
    "demoMode": "live",
    "description": "Ham veriden otomatik olarak kutu hesaplayan, her frekans kutusu icin dikey cubuklar olusturan ve istege bagli olarak normal dagilim egrisi ve ortalama/medyan referans cizgileri ekleyen frekans dagilimi histogrami.",
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
    "importStatement": "import { HistogramChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "HistogramChart",
    "variantAxes": [
      "showNormalCurve: true | false",
      "showMean: true | false",
      "showMedian: true | false"
    ],
    "stateModel": [
      "default",
      "with-normal-curve",
      "with-mean-median"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "auto bin calculation (Sturges formula)",
      "vertical bars for each frequency bin",
      "X-axis with bin ranges",
      "Y-axis with frequency count",
      "normal distribution overlay curve",
      "mean vertical reference line",
      "median vertical reference line",
      "bin hover highlight with count",
      "bin click interaction"
    ],
    "props": [
      { "name": "data", "type": "number[]", "default": "-", "required": true, "description": "Histogram hesaplanacak ham sayisal veri." },
      { "name": "bins", "type": "number", "default": "-", "required": false, "description": "Kutu sayisi (belirtilmezse Sturges formulu ile hesaplanir)." },
      { "name": "binWidth", "type": "number", "default": "-", "required": false, "description": "Sabit kutu genisligi (bins yerine kullanilir)." },
      { "name": "showNormalCurve", "type": "boolean", "default": "false", "required": false, "description": "Normal dagilim egrisi gosterir." },
      { "name": "showMean", "type": "boolean", "default": "false", "required": false, "description": "Dikey ortalama cizgisi gosterir." },
      { "name": "showMedian", "type": "boolean", "default": "false", "required": false, "description": "Dikey medyan cizgisi gosterir." },
      { "name": "xLabel", "type": "string", "default": "-", "required": false, "description": "X ekseni etiketi." },
      { "name": "yLabel", "type": "string", "default": "-", "required": false, "description": "Y ekseni etiketi." },
      { "name": "color", "type": "string", "default": "-", "required": false, "description": "Cubuk dolgu rengi." },
      { "name": "onBinClick", "type": "(bin: HistogramBin) => void", "default": "-", "required": false, "description": "Kutu cubuguna tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "auto bin calculation",
      "normal curve overlay",
      "mean/median lines"
    ],
    "regressionFocus": [
      "bos data dizisi",
      "tek degerli veri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
