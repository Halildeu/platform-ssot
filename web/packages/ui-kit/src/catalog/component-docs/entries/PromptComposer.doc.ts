import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PromptComposer",
  indexItem: {
  "name": "PromptComposer",
  "kind": "component",
  "importStatement": "import { PromptComposer } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "ai_helpers",
  "subgroup": "citations_prompting",
  "tags": [
    "ai-native-helpers",
    "beta",
    "prompt",
    "wave-6"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Citations / Prompting",
  "demoMode": "live",
  "description": "Scope-safe prompt yazimi, tone guardrail ve source anchors yuzeyini tek composer primitive ile sunar.",
  "sectionIds": [
    "documentation_standards",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "ux_writing_and_microcopy",
  "uxPrimarySubthemeId": "ai_message_tone_guardrails",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1"
},
  apiItem: {
  "name": "PromptComposer",
  "variantAxes": [
    "scope: general | approval | policy | release",
    "tone: neutral | strict | exploratory",
    "mode: editable | readonly"
  ],
  "stateModel": [
    "controlled / uncontrolled subject",
    "controlled / uncontrolled body",
    "scope and tone guardrails"
  ],
  "props": [
    {
      "name": "subject / defaultSubject",
      "type": "string",
      "default": "\"\"",
      "required": false,
      "description": "Prompt amacini tek satirda controlled veya uncontrolled sekilde tutar."
    },
    {
      "name": "value / defaultValue",
      "type": "string",
      "default": "\"\"",
      "required": false,
      "description": "Ana prompt govdesini controlled veya uncontrolled sekilde yonetir."
    },
    {
      "name": "scope / tone",
      "type": "PromptComposerScope / PromptComposerTone",
      "default": "general / neutral",
      "required": false,
      "description": "Prompt execution boundary ve tone guardrail kararini belirler."
    },
    {
      "name": "guardrails / citations",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Promptun policy ve source anchor kontratini gorunur kilar."
    },
    {
      "name": "maxLength",
      "type": "number",
      "default": "1200",
      "required": false,
      "description": "Body alaninin karakter ust sinirini belirler."
    }
  ],
  "previewFocus": [
    "controlled prompt authoring",
    "readonly review mode"
  ],
  "regressionFocus": [
    "readonly body guard",
    "scope and tone selection parity",
    "guardrail/citation rendering"
  ]
},
};

export default entry;
