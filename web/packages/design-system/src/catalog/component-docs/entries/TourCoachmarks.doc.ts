import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TourCoachmarks",
  indexItem: {
  "name": "TourCoachmarks",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "overlays",
  "subgroup": "tour_coachmarks",
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
    "preview_before_release",
    "design_tokens",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "roadmapWaveId": "wave_8_overlay_extensions",
  "acceptanceContractId": "ui-library-wave-8-overlay-extensions-v1",
  "uxPrimaryThemeId": "onboarding_help_and_learnability",
  "uxPrimarySubthemeId": "process_tours_for_critical_flows",
  "importStatement": "import { TourCoachmarks } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ],
    "dependsOn": ["Button"]
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
    "previewStates": [
      "guided-active",
      "readonly-walkthrough",
      "dark-theme"
    ],
    "behaviorModel": [
      "closed / open",
      "step navigation",
      "finish callback",
      "readonly walkthrough",
      "theme-aware token resolution"
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
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay baslik icerigi."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay aciklama icerigi."
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
      "description": "Coachmark bubble boyut varyantini belirler."
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
