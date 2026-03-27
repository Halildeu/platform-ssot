import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FunnelChart",
  indexItem: {
    "name": "FunnelChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Huni grafigi, donusum analizi",
    "demoMode": "live",
    "description": "Asamalar arasi donusum oranlari ile birlikte huni gorsellestirmesi sunar; dikey trapezoid ve yatay cubuk render modlari, animasyon ve ozel renkler destekler.",
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
    "importStatement": "import { FunnelChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FunnelChart",
    "variantAxes": [
      "orientation: vertical | horizontal",
      "animated: true | false"
    ],
    "stateModel": [
      "vertical",
      "horizontal",
      "animated"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "conversion rate calculation between stages",
      "vertical trapezoid shape rendering",
      "horizontal bar rendering",
      "entrance animation on mount",
      "stage hover highlight",
      "stage click interaction"
    ],
    "props": [
      { "name": "stages", "type": "FunnelStage[]", "default": "-", "required": true, "description": "En genisten en dara dogru sirali huni asamalari." },
      { "name": "orientation", "type": "'vertical' | 'horizontal'", "default": "vertical", "required": false, "description": "Render yonu." },
      { "name": "animated", "type": "boolean", "default": "true", "required": false, "description": "Grafik yuklendiginde giris animasyonunu etkinlestirir." },
      { "name": "formatOptions", "type": "FormatOptions", "default": "{}", "required": false, "description": "Asama degerleri icin sayi formatlama." },
      { "name": "onStageClick", "type": "(stage: FunnelStage) => void", "default": "-", "required": false, "description": "Huni asamasina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "vertical vs horizontal rendering",
      "conversion rate labels",
      "entrance animation"
    ],
    "regressionFocus": [
      "bos stages dizisi",
      "tek asamali huni",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
