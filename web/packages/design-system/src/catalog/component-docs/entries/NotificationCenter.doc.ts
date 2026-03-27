import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "NotificationCenter",
  indexItem: {
    "name": "NotificationCenter",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "feedback",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Bildirim paneli",
    "demoMode": "live",
    "description": "Okunmamis rozeti, tip bazli gruplama, kapatma, eylem destegi ve 'tumunu okundu isaretle' ozellikli bildirim akisi paneli.",
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
    "importStatement": "import { NotificationCenter } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "NotificationCenter",
    "variantAxes": [
      "groupByType: true | false"
    ],
    "stateModel": [
      "flat-list",
      "grouped",
      "empty"
    ],
    "previewStates": ["empty-state", "dark-theme"],
    "behaviorModel": [
      "unread badge counter",
      "type-based grouping with priority order",
      "mark all read action",
      "individual dismiss",
      "action button on action-type notifications",
      "show more/less pagination",
      "relative time formatting"
    ],
    "props": [
      { "name": "notifications", "type": "NotificationItem[]", "default": "-", "required": true, "description": "Gosterilecek bildirim ogeleri listesi." },
      { "name": "title", "type": "string", "default": "Bildirimler", "required": false, "description": "Panel baslik metni." },
      { "name": "groupByType", "type": "boolean", "default": "false", "required": false, "description": "Bildirimleri tiplerine gore gruplar." },
      { "name": "maxVisible", "type": "number", "default": "10", "required": false, "description": "Daha fazla goster oncesi gosterilen maksimum sayi." },
      { "name": "onMarkAllRead", "type": "() => void", "default": "-", "required": false, "description": "Tumunu okundu isaretle tiklandiginda tetiklenir." },
      { "name": "onDismiss", "type": "(id: string) => void", "default": "-", "required": false, "description": "Bildirim kapatildiginda tetiklenir." },
      { "name": "onAction", "type": "(id: string, payload: unknown) => void", "default": "-", "required": false, "description": "Eylem butonuna tiklandiginda tetiklenir." },
      { "name": "onNotificationClick", "type": "(id: string) => void", "default": "-", "required": false, "description": "Bildirim satirina tiklandiginda tetiklenir." },
      { "name": "localeText", "type": "NotificationCenterLocaleText", "default": "-", "required": false, "description": "Yerellestirilmis etiketler." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "unread badge display",
      "grouped vs flat view",
      "action button interaction"
    ],
    "regressionFocus": [
      "bos bildirim listesi",
      "maxVisible sinir kontrolu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
