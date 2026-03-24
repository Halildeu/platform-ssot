import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "CommentThread",
  indexItem: {
    "name": "CommentThread",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "collaboration",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "tartisma, yorum dizisi, isbirligi",
    "demoMode": "live",
    "description": "Ic ice yanitlari, satir ici duzenlemeyi ve kullaniciya ozel islemleri destekleyen isbirligi tartisma dizisi bileseni. Jira/GitHub tarzi yorum etkilesimleri icin uygundur.",
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
    "importStatement": "import { CommentThread } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "CommentThread",
    "variantAxes": [
      "showReplyForm: true | false",
      "maxDepth: number"
    ],
    "stateModel": [
      "default",
      "empty",
      "readonly"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "nested reply rendering with indentation",
      "relative timestamp display",
      "edit/delete actions for current user",
      "reply form with textarea + submit",
      "avatar with initials fallback",
      "edited badge display"
    ],
    "props": [
      { "name": "comments", "type": "Comment[]", "default": "-", "required": true, "description": "Ust duzey yorumlar dizisi." },
      { "name": "onReply", "type": "(parentId: string, content: string) => void", "default": "-", "required": false, "description": "Yanit gonderildiginde tetiklenir." },
      { "name": "onEdit", "type": "(id: string, content: string) => void", "default": "-", "required": false, "description": "Yorum duzenlendiginde tetiklenir." },
      { "name": "onDelete", "type": "(id: string) => void", "default": "-", "required": false, "description": "Yorum silindiginde tetiklenir." },
      { "name": "currentUser", "type": "{ name: string; avatar?: string }", "default": "-", "required": false, "description": "Oturum acmis kullanici bilgisi." },
      { "name": "maxDepth", "type": "number", "default": "3", "required": false, "description": "Yanit ic ice derinlik siniri." },
      { "name": "showReplyForm", "type": "boolean", "default": "true", "required": false, "description": "Ust duzey yanit formunu gosterir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "nested replies with indentation",
      "avatar initials fallback",
      "edit/delete actions"
    ],
    "regressionFocus": [
      "bos yorum dizisi",
      "derin ic ice yanitlar",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
