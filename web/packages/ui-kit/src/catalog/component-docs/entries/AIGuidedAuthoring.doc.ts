import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AIGuidedAuthoring",
  indexItem: {
  "name": "AIGuidedAuthoring",
  "kind": "component",
  "importStatement": "import { AIGuidedAuthoring } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "ai_helpers",
  "subgroup": "authoring",
  "tags": [
    "ai-authoring",
    "beta",
    "recipes",
    "wave-11"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "AI authoring workflows",
  "demoMode": "live",
  "description": "Prompt yazimi, recommendation stack ve command palette akisini reusable authoring recipe yuzeyinde toplar.",
  "sectionIds": [
    "governance_contribution",
    "documentation_standards",
    "integration_distribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "safe_prompt_templates_and_scope",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1"
},
  apiItem: {
  "name": "AIGuidedAuthoring",
  "variantAxes": [
    "surface: focused-authoring | command-assisted",
    "recommendations: empty | populated",
    "palette: closed | open"
  ],
  "stateModel": [
    "prompt composer state",
    "recommendation action dispatch",
    "command palette visibility"
  ],
  "props": [
    {
      "name": "promptComposerProps",
      "type": "Partial<PromptComposerProps>",
      "default": "{}",
      "required": false,
      "description": "Prompt composer icindeki subject, body ve guardrail davranisini recipe seviyesinde devreder."
    },
    {
      "name": "recommendations",
      "type": "AIGuidedAuthoringRecommendation[]",
      "default": "[]",
      "required": false,
      "description": "Yan panelde gosterilecek canonical recommendation kartlarini tasir."
    },
    {
      "name": "commandItems / paletteOpen",
      "type": "CommandPaletteItem[] / boolean",
      "default": "[] / false",
      "required": false,
      "description": "Command palette aksiyonlarini ve acik/kapali durumunu kontrol eder."
    },
    {
      "name": "onApplyRecommendation / onReviewRecommendation",
      "type": "(id, item) => void",
      "default": "-",
      "required": false,
      "description": "Recommendation aksiyonlarini consumer katmana cikarir."
    }
  ],
  "previewFocus": [
    "prompt + recommendation workspace",
    "command-assisted authoring"
  ],
  "regressionFocus": [
    "palette open-close parity",
    "recommendation callback wiring",
    "readonly access guard"
  ]
},
};

export default entry;
