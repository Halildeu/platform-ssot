import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TourCoachmarks",
  indexItem: {
  "name": "TourCoachmarks",
  "kind": "component",
  "importStatement": "import { TourCoachmarks } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "overlays",
  "subgroup": "tour_coachmarks",
  "tags": [],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Tour / Coachmarks",
  "demoMode": "live",
  "description": "TourCoachmarks guided onboarding ve compliance walkthrough akislari icin overlay extension primitive’i.",
  "sectionIds": [
    "component_library_management",
    "overlay_components",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "backlog_contract",
    "preview_before_release"
  ],
  "uxPrimaryThemeId": "onboarding_help_and_learnability",
  "uxPrimarySubthemeId": "process_tours_for_critical_flows",
  "roadmapWaveId": "wave_8_overlay_extensions",
  "acceptanceContractId": "ui-library-wave-8-overlay-extensions-v1"
},
  apiItem: {
  "name": "TourCoachmarks",
  "variantAxes": [
    "mode: guided | readonly",
    "allowSkip: true | false",
    "showProgress: true | false"
  ],
  "stateModel": [
    "closed / open",
    "step navigation",
    "finish callback",
    "readonly walkthrough"
  ],
  "props": [
    {
      "name": "steps",
      "type": "TourCoachmarkStep[]",
      "default": "[]",
      "required": true,
      "description": "Her adım için id, title, description, meta ve tone bilgisini taşır."
    },
    {
      "name": "mode",
      "type": "'guided' | 'readonly'",
      "default": "guided",
      "required": false,
      "description": "Etkileşimli tur veya yalnız inceleme walkthrough modunu seçer."
    },
    {
      "name": "allowSkip",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Skip / kapat aksiyonunun görünürlüğünü belirler."
    },
    {
      "name": "showProgress",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Adım sayacı rozetini görünür tutar."
    },
    {
      "name": "currentStep / defaultStep",
      "type": "number",
      "default": "0",
      "required": false,
      "description": "Controlled veya uncontrolled adım ilerleme durumunu yönetir."
    },
    {
      "name": "onStepChange / onFinish",
      "type": "(index:number)=>void / ()=>void",
      "default": "-",
      "required": false,
      "description": "Tur ilerleme ve tamamlanma aksiyonlarını dışarıya taşır."
    }
  ],
  "previewFocus": [
    "guided onboarding",
    "readonly compliance walkthrough",
    "progress visibility",
    "finish state"
  ],
  "regressionFocus": [
    "next previous navigation",
    "finish callback",
    "hidden access guard",
    "readonly mode action rules"
  ]
},
};

export default entry;
