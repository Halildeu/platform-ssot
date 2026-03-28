import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ControlChart",
  indexItem: {
    "name": "ControlChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "SPC, kontrol grafigi, istatistiksel proses kontrol",
    "demoMode": "live",
    "description": "UCL/LCL kesikli kontrol sinir cizgileri, merkez/hedef cizgisi, A/B/C bolge golgelemesi ve kontrol disi nokta vurgulama ile veri noktalarini cizen Istatistiksel Proses Kontrol (SPC) grafigi.",
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
    "importStatement": "import { ControlChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ControlChart",
    "variantAxes": [
      "showZones: true | false",
      "showViolations: true | false"
    ],
    "stateModel": [
      "default",
      "with-zones",
      "with-violations"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "data points connected by line",
      "UCL/LCL dashed control limit lines (red)",
      "center/target line (green)",
      "A/B/C zone shading (1/2/3 sigma)",
      "violation point highlighting (red ring)",
      "auto-calculate mean/stddev from data",
      "hover tooltip with coordinates",
      "point click interaction"
    ],
    "props": [
      { "name": "data", "type": "Array<{ x: string | number; y: number }>", "default": "-", "required": true, "description": "Veri noktasi dizisi." },
      { "name": "ucl", "type": "number", "default": "mean + 3sigma", "required": false, "description": "Ust Kontrol Siniri (verilmezse otomatik hesaplanir)." },
      { "name": "lcl", "type": "number", "default": "mean - 3sigma", "required": false, "description": "Alt Kontrol Siniri (verilmezse otomatik hesaplanir)." },
      { "name": "target", "type": "number", "default": "mean", "required": false, "description": "Merkez/hedef cizgisi (verilmezse ortalama kullanilir)." },
      { "name": "showZones", "type": "boolean", "default": "false", "required": false, "description": "A/B/C bolgelerini gosterir." },
      { "name": "showViolations", "type": "boolean", "default": "true", "required": false, "description": "Kontrol disi noktalari vurgular." },
      { "name": "xLabel", "type": "string", "default": "-", "required": false, "description": "X ekseni etiketi." },
      { "name": "yLabel", "type": "string", "default": "-", "required": false, "description": "Y ekseni etiketi." },
      { "name": "onPointClick", "type": "(point: ControlChartPoint) => void", "default": "-", "required": false, "description": "Veri noktasina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "UCL/LCL dashed lines",
      "zone shading A/B/C",
      "violation point highlights"
    ],
    "regressionFocus": [
      "bos data dizisi",
      "tum noktalar kontrol ici",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
