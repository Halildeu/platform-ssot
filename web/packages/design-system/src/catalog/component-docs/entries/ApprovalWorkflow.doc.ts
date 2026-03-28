import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ApprovalWorkflow",
  indexItem: {
    "name": "ApprovalWorkflow",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "workflow",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Onay sureci adim gosterge",
    "demoMode": "live",
    "description": "Coklu adimli onay sureci; onaylama, reddetme ve devretme eylemleri, atanan kisi bilgisi ve durum rozeti destegi sunar.",
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
    "importStatement": "import { ApprovalWorkflow } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ApprovalWorkflow",
    "variantAxes": [
      "orientation: horizontal | vertical",
      "compact: true | false"
    ],
    "stateModel": [
      "pending",
      "in-review",
      "approved",
      "rejected"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "step status icon rendering",
      "approve/reject/delegate actions on active step",
      "reject comment input",
      "assignee avatar display",
      "timestamp and comment display",
      "connector line between steps"
    ],
    "props": [
      { "name": "steps", "type": "ApprovalStep[]", "default": "-", "required": true, "description": "Sirali onay adimlari listesi." },
      { "name": "currentStepIndex", "type": "number", "default": "-", "required": false, "description": "Aktif adim indeksi (0-tabanli)." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "horizontal", "required": false, "description": "Is akisi adimlari yonu." },
      { "name": "compact", "type": "boolean", "default": "false", "required": false, "description": "Kompakt mod: zaman damgalari ve yorumlari gizler." },
      { "name": "access", "type": "AccessLevel", "default": "-", "required": false, "description": "Erisim seviyesi." },
      { "name": "accessReason", "type": "string", "default": "-", "required": false, "description": "Erisim kisitlama aciklamasi." },
      { "name": "onApprove", "type": "(stepId: string) => void", "default": "-", "required": false, "description": "Aktif adim onaylandiginda tetiklenir." },
      { "name": "onReject", "type": "(stepId: string, comment: string) => void", "default": "-", "required": false, "description": "Aktif adim reddedildiginde tetiklenir." },
      { "name": "onDelegate", "type": "(stepId: string, newAssignee: string) => void", "default": "-", "required": false, "description": "Aktif adim devredildiginde tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "step status progression",
      "approve/reject actions",
      "assignee avatars"
    ],
    "regressionFocus": [
      "bos steps dizisi",
      "tum adimlar approved durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
