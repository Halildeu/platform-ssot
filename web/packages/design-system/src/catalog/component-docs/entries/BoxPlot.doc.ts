import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "BoxPlot",
  indexItem: {
    "name": "BoxPlot",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "istatistik, kutu grafik, dagilim analizi",
    "demoMode": "live",
    "description": "Whisker cizgileri, IQR kutusu, medyan cizgisi, aykiri nokta noktaciklari ve istege bagli ortalama elmas isaretleyicisi ile dagilim verilerini gosteren istatistiksel kutu-ve-biyik grafigi.",
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
    "importStatement": "import { BoxPlot } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "BoxPlot",
    "variantAxes": [
      "orientation: vertical | horizontal",
      "showOutliers: true | false",
      "showMean: true | false"
    ],
    "stateModel": [
      "default",
      "with-outliers",
      "with-mean",
      "horizontal"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "whisker lines (min-Q1, Q3-max)",
      "box rect (Q1-Q3) with fill",
      "median line inside box",
      "outlier dots beyond whiskers",
      "mean diamond marker",
      "Y-axis with auto scale",
      "X-axis with labels",
      "hover tooltip",
      "box click interaction"
    ],
    "props": [
      { "name": "data", "type": "BoxPlotData[]", "default": "-", "required": true, "description": "Kutu grafik veri dizisi." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "'vertical'", "required": false, "description": "Grafik yonu." },
      { "name": "showOutliers", "type": "boolean", "default": "true", "required": false, "description": "Aykiri nokta noktaciklarini gosterir." },
      { "name": "showMean", "type": "boolean", "default": "false", "required": false, "description": "Ortalama elmas isaretleyicisini gosterir." },
      { "name": "width", "type": "number | string", "default": "-", "required": false, "description": "Grafik genisligi." },
      { "name": "height", "type": "number | string", "default": "400", "required": false, "description": "Grafik yuksekligi." },
      { "name": "onBoxClick", "type": "(item: BoxPlotData) => void", "default": "-", "required": false, "description": "Kutuya tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "whisker + box rendering",
      "outlier dots",
      "mean diamond marker"
    ],
    "regressionFocus": [
      "bos data dizisi",
      "tek ogeli grafik",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
