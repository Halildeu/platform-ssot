import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RecommendationCard",
  indexItem: {
  "name": "RecommendationCard",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "ai_helpers",
  "subgroup": "recommendations",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Recommendation / Confidence",
  "demoMode": "live",
  "description": "AI onerilerini confidence, kaynak ve human action butonlari ile ayni kart kontratina baglar.",
  "sectionIds": [
    "component_library_management",
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
    "recommendation"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "contextual_recommendation_cards",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1",
  "importStatement": "import { RecommendationCard } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "RecommendationCard",
  "variantAxes": [
    "tone: info | success | warning",
    "layout: default | compact",
    "actions: primary + secondary | readonly"
  ],
  "stateModel": [
    "confidence-aware card",
    "citation list",
    "actionable vs readonly review"
  ],
    "previewStates": [
      "disabled",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "confidence-aware card",
      "citation list",
      "actionable vs readonly review"
    ],
  "props": [
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Oneri kartinin ana basligi."
    },
    {
      "name": "summary",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "AI ozetini veya tavsiyeyi aciklar."
    },
    {
      "name": "rationale",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Oneriyi destekleyen ana gerekce listesi."
    },
    {
      "name": "citations",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Kaynak veya evidence etiketlerini listeler."
    },
    {
      "name": "confidenceLevel / confidenceScore",
      "type": "ConfidenceLevel / number",
      "default": "medium / -",
      "required": false,
      "description": "ConfidenceBadge ile birlikte seffaf skor gosterir."
    },
    {
      "name": "primaryActionLabel / secondaryActionLabel",
      "type": "string",
      "default": "Apply / Review",
      "required": false,
      "description": "Kart aksiyon butonlarini adlandirir."
    },
    {
      "name": "onPrimaryAction / onSecondaryAction",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Insan onayi veya detay inceleme aksiyonlarini bildirir."
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
      "description": "Recommendation card boyut varyanti."
    }
  ],
  "previewFocus": [
    "policy recommendation card",
    "risk review card",
    "readonly governance state"
  ],
  "regressionFocus": [
    "action button guard",
    "confidence badge composition",
    "citation and rationale rendering"
  ]
},
};

export default entry;
