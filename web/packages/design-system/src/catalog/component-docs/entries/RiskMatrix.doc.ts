import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RiskMatrix",
  indexItem: {
    "name": "RiskMatrix",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Risk degerlendirme matrisi",
    "demoMode": "live",
    "description": "5x5 olasilik-etki gridinde risk ogelerini gorselestiren matris; renk kodlu hucre arka planlari, tooltip, legend ve boyut varyantlari sunar.",
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
    "importStatement": "import { RiskMatrix } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "RiskMatrix",
    "variantAxes": [
      "size: sm | md | lg",
      "showLegend: true | false"
    ],
    "stateModel": [
      "default",
      "hover-cell",
      "with-legend"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "5x5 grid cell rendering with risk level colors",
      "risk item badge per cell",
      "tooltip on cell hover",
      "cell click with risk items payload",
      "color legend display",
      "customizable axis labels"
    ],
    "props": [
      { "name": "risks", "type": "RiskItem[]", "default": "-", "required": true, "description": "Matris gridine yerlestirilecek risk ogeleri." },
      { "name": "likelihoodLabels", "type": "[string, string, string, string, string]", "default": "['Rare','Unlikely','Possible','Likely','Almost Certain']", "required": false, "description": "Olasilik ekseni etiketleri." },
      { "name": "impactLabels", "type": "[string, string, string, string, string]", "default": "['Insignificant','Minor','Moderate','Major','Catastrophic']", "required": false, "description": "Etki ekseni etiketleri." },
      { "name": "showLegend", "type": "boolean", "default": "-", "required": false, "description": "Matris altinda renk legend'ini gosterir." },
      { "name": "size", "type": "RiskMatrixSize", "default": "-", "required": false, "description": "Hucre boyutlari ve yazi boyutu kontrolu." },
      { "name": "access", "type": "AccessLevel", "default": "-", "required": false, "description": "Erisim seviyesi." },
      { "name": "accessReason", "type": "string", "default": "-", "required": false, "description": "Erisim kisitlama aciklamasi." },
      { "name": "onCellClick", "type": "(risks: RiskItem[], likelihood: number, impact: number) => void", "default": "-", "required": false, "description": "Matris hucresine tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "risk level color coding",
      "cell badge counts",
      "axis label customization"
    ],
    "regressionFocus": [
      "bos risks dizisi",
      "ayni hucrede birden fazla risk",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
