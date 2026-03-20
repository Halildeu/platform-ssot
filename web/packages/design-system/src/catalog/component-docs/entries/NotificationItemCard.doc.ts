import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "NotificationItemCard",
  indexItem: {
  "name": "NotificationItemCard",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "feedback",
  "subgroup": "toast_notification",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Toast / Notification",
  "demoMode": "live",
  "description": "Notification kaydini type badge, mesaj, aciklama, timestamp ve aksiyon satiriyla gosteren kart primitive'i.",
  "sectionIds": [
    "state_feedback",
    "component_library_management",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "importStatement": "import { NotificationItemCard } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "NotificationItemCard",
  "variantAxes": [
    "type: success | info | warning | error | action",
    "priority: low | normal | high | critical",
    "selectable: on | off",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "type-to-badge tone mapping",
    "priority visual emphasis",
    "timestamp formatting",
    "primary action affordance",
    "remove dismiss action",
    "selectable checkbox state",
    "access-aware interaction guard"
  ],
    "previewStates": ["default", "dark-theme"],
    "behaviorModel": [
      "type-to-badge tone mapping",
      "priority visual emphasis",
      "timestamp formatting",
      "primary action affordance",
      "remove dismiss action",
      "selectable checkbox state",
      "access-aware interaction guard"
    ],
  "props": [
    {
      "name": "item",
      "type": "NotificationSurfaceItem",
      "default": "-",
      "required": true,
      "description": "Bildirim verisini id, title, description, type, priority, read ve createdAt alanlariyla tasir."
    },
    {
      "name": "getPrimaryActionLabel / onPrimaryAction",
      "type": "(item) => string | null / (item) => void",
      "default": "- / -",
      "required": false,
      "description": "Item bazli birincil aksiyon buton etiketini ve callback'ini tanimlar."
    },
    {
      "name": "onRemove",
      "type": "(id: string) => void",
      "default": "-",
      "required": false,
      "description": "Bildirimi kapatma/silme aksiyonu callback'i."
    },
    {
      "name": "formatTimestamp",
      "type": "(timestamp: number | undefined, item) => ReactNode",
      "default": "relative time formatter",
      "required": false,
      "description": "Zaman damgasini custom formatlama fonksiyonu ile gosterir."
    },
    {
      "name": "selectable / selected / onSelectedChange",
      "type": "boolean / boolean / (item, selected: boolean) => void",
      "default": "false / false / -",
      "required": false,
      "description": "Batch triage akislari icin checkbox secim yuzeyini acar."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "full / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve interaction kontrolu."
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
      "description": "Notification card boyut varyanti."
    }
  ],
  "previewFocus": [
    "type badge tone mapping",
    "primary action affordance",
    "selectable batch mode",
    "timestamp formatting"
  ],
  "regressionFocus": [
    "access guard action prevention",
    "selectable checkbox state parity",
    "remove callback with disabled guard",
    "type-to-tone badge mapping"
  ]
},
};

export default entry;
