import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ConfidenceBadge",
  indexItem: {
  "name": "ConfidenceBadge",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "ai_helpers",
  "subgroup": "recommendations",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Recommendation / Confidence",
  "demoMode": "live",
  "description": "Confidence seviyesini, skorunu ve kaynak sayisini tek badge primitive ile gosterir.",
  "sectionIds": [
    "state_feedback",
    "documentation_standards",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-6",
    "ai-native-helpers",
    "beta",
    "confidence"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "confidence_and_source_transparency",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1",
  "importStatement": "import { ConfidenceBadge } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "ConfidenceBadge",
  "variantAxes": [
    "level: low | medium | high | very-high",
    "layout: default | compact",
    "visibility: score | sources"
  ],
  "stateModel": [
    "confidence label",
    "score surface",
    "source transparency"
  ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "confidence label",
      "score surface",
      "source transparency"
    ],
  "props": [
    {
      "name": "level",
      "type": "'low' | 'medium' | 'high' | 'very-high'",
      "default": "medium",
      "required": false,
      "description": "Semantic confidence seviyesini belirler."
    },
    {
      "name": "score",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Yuzdesel confidence degerini gosterir."
    },
    {
      "name": "sourceCount",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Confidence hesabina giren kaynak sayisini gosterir."
    },
    {
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Kaynak sayisini gizleyip kompakt badge yuzeyi uretir."
    },
    {
      "name": "showScore",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Score gosterimini acip kapatir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "aria-label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilirlik icin aciklayici etiket."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Badge boyut varyanti."
    }
  ],
  "previewFocus": [
    "confidence matrix",
    "score + source transparency",
    "compact list usage"
  ],
  "regressionFocus": [
    "level to tone mapping",
    "compact output formatting",
    "hidden access rendering"
  ]
},
};

export default entry;
