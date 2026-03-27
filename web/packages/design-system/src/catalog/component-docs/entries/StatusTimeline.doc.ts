import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "StatusTimeline",
  indexItem: {
    "name": "StatusTimeline",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Durum degisim gecmisi timeline",
    "demoMode": "live",
    "description": "Kronolojik durum degisiklik olaylarini sure gostergeleri, ozel renk haritasi ve kompakt mod ile gosteren zaman cizelgesi bileseni.",
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
    "importStatement": "import { StatusTimeline } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "StatusTimeline",
    "variantAxes": [
      "orientation: horizontal | vertical",
      "compact: true | false"
    ],
    "stateModel": [
      "vertical-default",
      "horizontal",
      "compact"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "chronological event ordering",
      "duration calculation between events",
      "status-based color coding",
      "custom color mapping",
      "compact mode with minimal details",
      "event click interaction"
    ],
    "props": [
      { "name": "events", "type": "StatusTimelineEvent[]", "default": "-", "required": true, "description": "Gosterilecek sirali durum olaylari listesi." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "vertical", "required": false, "description": "Zaman cizelgesi yerlesim yonu." },
      { "name": "compact", "type": "boolean", "default": "false", "required": false, "description": "Aktor adlarini, aciklamalari ve sure etiketlerini gizler." },
      { "name": "statusColors", "type": "Record<string, string>", "default": "-", "required": false, "description": "Durum stringinden hex renge ozel renk eslemesi." },
      { "name": "onEventClick", "type": "(eventId: string) => void", "default": "-", "required": false, "description": "Zaman cizelgesi olay kartina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "vertical vs horizontal layout",
      "duration indicators",
      "status color badges"
    ],
    "regressionFocus": [
      "bos events dizisi",
      "gecersiz timestamp formati",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
