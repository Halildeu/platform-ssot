import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ApprovalCheckpoint",
  indexItem: {
  "name": "ApprovalCheckpoint",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "ai_helpers",
  "subgroup": "approval_audit",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Approval / Audit",
  "demoMode": "live",
  "description": "Human approval checkpoint, evidence seti ve karar aksiyonlarini tek governance kartinda toplar.",
  "sectionIds": [
    "governance_contribution",
    "integration_distribution",
    "documentation_standards"
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
    "approval"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "human_approval_checkpoints",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1",
  "importStatement": "import { ApprovalCheckpoint } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "ApprovalCheckpoint",
  "variantAxes": [
    "status: pending | approved | rejected | blocked",
    "mode: actionable | readonly",
    "layout: evidence-rich | compact review"
  ],
  "stateModel": [
    "checkpoint status",
    "checklist progression",
    "primary / secondary decision actions"
  ],
    "previewStates": [
      "pending",
      "approved",
      "rejected",
      "blocked",
      "disabled",
      "readonly",
      "dark-theme"
    ],
    "behaviorModel": [
      "checkpoint status",
      "checklist progression",
      "primary / secondary decision actions"
    ],
  "props": [
    {
      "name": "title / summary",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Checkpoint basligi ve karar ozetini tanimlar."
    },
    {
      "name": "status",
      "type": "'pending' | 'approved' | 'rejected' | 'blocked'",
      "default": "pending",
      "required": false,
      "description": "Genel approval state badge tonunu belirler."
    },
    {
      "name": "steps",
      "type": "ApprovalCheckpointItem[]",
      "default": "[]",
      "required": false,
      "description": "Checklist, owner ve step status bilgisini gosterir."
    },
    {
      "name": "evidenceItems / citations",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Karari destekleyen evidence ve kaynak etiketlerini listeler."
    },
    {
      "name": "onPrimaryAction / onSecondaryAction",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Insan onayi ve review talebi aksiyonlarini tetikler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "interactive human checkpoint",
    "readonly review queue"
  ],
  "regressionFocus": [
    "readonly action guard",
    "status to badge tone mapping",
    "checklist rendering stability"
  ]
},
};

export default entry;
