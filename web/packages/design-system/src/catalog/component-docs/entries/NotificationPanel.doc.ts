import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "NotificationPanel",
  indexItem: {
  "name": "NotificationPanel",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "feedback",
  "subgroup": "toast_notification",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Toast / Notification",
  "demoMode": "live",
  "description": "Bildirim listesi, header aksiyonlari ve bos durum feedback'ini reusable panel yuzeyinde toplar.",
  "sectionIds": [
    "state_feedback",
    "component_library_management",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support",
    "design_tokens"
  ],
  "importStatement": "import { NotificationPanel } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "NotificationPanel",
  "variantAxes": [
    "grouping: none | priority",
    "dateGrouping: none | relative-day",
    "filters: hidden | visible",
    "selectable: on | off",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "notification item list rendering",
    "filter segment controlled/uncontrolled state",
    "priority and date based grouping",
    "mark-all-read and clear header actions",
    "batch selection with selected ids",
    "empty state and filtered empty state",
    "access-aware action guards"
  ],
    "previewStates": ["empty-feed", "populated-feed", "filtered-feed", "batch-selection", "dark-theme"],
    "behaviorModel": [
      "notification item list rendering",
      "filter segment controlled/uncontrolled state",
      "priority and date based grouping",
      "mark-all-read and clear header actions",
      "batch selection with selected ids",
      "empty state and filtered empty state",
      "access-aware action guards",
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "items",
      "type": "NotificationSurfaceItem[]",
      "default": "-",
      "required": true,
      "description": "Bildirim feed icerigini tanimlar."
    },
    {
      "name": "title / summaryLabel / emptyTitle / emptyDescription",
      "type": "ReactNode / ReactNode / ReactNode / string",
      "default": "'Bildirimler' / - / 'Su anda bildirim yok' / -",
      "required": false,
      "description": "Panel basligini, ozet etiketini ve bos durum feedback metinlerini belirler."
    },
    {
      "name": "showFilters / activeFilter / onFilterChange",
      "type": "boolean / NotificationPanelFilter / (filter) => void",
      "default": "false / 'all' / -",
      "required": false,
      "description": "Filtre segment yuzeyini acar ve controlled filtre state'ini yonetir."
    },
    {
      "name": "grouping / dateGrouping",
      "type": "'none' | 'priority' / 'none' | 'relative-day'",
      "default": "'none' / 'none'",
      "required": false,
      "description": "Priority veya tarih bazli gruplama stratejisini belirler."
    },
    {
      "name": "onMarkAllRead / onClear / onRemoveItem",
      "type": "() => void / () => void / (id: string) => void",
      "default": "- / - / -",
      "required": false,
      "description": "Header aksiyonlari ve tekil bildirim silme callback'lerini tanimlar."
    },
    {
      "name": "selectable / selectedIds / onMarkSelectedRead / onRemoveSelected",
      "type": "boolean / string[] / (ids: string[]) => void / (ids: string[]) => void",
      "default": "false / [] / - / -",
      "required": false,
      "description": "Batch triage secim yuzeyini ve secim bazli toplu aksiyonlari acar."
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
      "default": "''",
      "required": false,
      "description": "Additional CSS class for custom styling."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "'md'",
      "required": false,
      "description": "Component size variant."
    }
  ],
  "previewFocus": [
    "notification feed with filters",
    "priority grouped inbox",
    "date grouped timeline",
    "batch selection triage",
    "empty state feedback"
  ],
  "regressionFocus": [
    "filter state controlled/uncontrolled parity",
    "grouping section header labels",
    "selection ids sync with batch actions",
    "empty vs filtered-empty state",
    "access guard header action prevention"
  ]
},
};

export default entry;
