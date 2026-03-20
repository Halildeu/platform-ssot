import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Accordion",
  indexItem: {
  "name": "Accordion",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "disclosure",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Accordion / Disclosure",
  "demoMode": "live",
  "description": "Bolum bazli bilgi saklama ve acma-kapama akislari icin controlled veya uncontrolled disclosure primitive'i sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "tags": [
    "wave-2",
    "navigation",
    "beta",
    "disclosure"
  ],
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { Accordion } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "Accordion",
  "variantAxes": [
    "selection: single | multiple",
    "surface: bordered | ghost",
    "icon: visible | hidden",
    "icon-position: start | end",
    "trigger: header | icon | disabled",
    "spacing: default | no-gutters"
  ],
  "stateModel": [
    "disabled",
    "expanded"
  ],
    "previewStates": [
      "disabled",
      "expanded",
      "collapsed",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled expansion",
      "single item lock",
      "disabled item guard",
      "panel mount on expand",
      "forceRender / destroyOnHidden lifecycle"
    ],
  "props": [
    {
      "name": "items",
      "type": "AccordionItem[]",
      "default": "-",
      "required": true,
      "description": "Baslik, icerik, opsiyonel aciklama ve disabled bilgisi tasiyan panel listesi."
    },
    {
      "name": "value",
      "type": "string | string[]",
      "default": "-",
      "required": false,
      "description": "Controlled acik panel anahtarlari."
    },
    {
      "name": "defaultValue",
      "type": "string | string[]",
      "default": "-",
      "required": false,
      "description": "Uncontrolled acik panel anahtarlari."
    },
    {
      "name": "onValueChange",
      "type": "(value: string | string[]) => void",
      "default": "-",
      "required": false,
      "description": "Panel acilma/kapanma degisim callback'i."
    },
    {
      "name": "selectionMode",
      "type": "'single' | 'multiple'",
      "default": "'multiple'",
      "required": false,
      "description": "Ayni anda tek veya birden fazla panelin acik kalmasini belirler."
    },
    {
      "name": "showArrow",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Expand ok gorselini gosterir."
    },
    {
      "name": "expandIcon",
      "type": "ReactNode",
      "default": "default chevron",
      "required": false,
      "description": "Custom expand ikonu."
    },
    {
      "name": "expandIconPosition",
      "type": "'start' | 'end'",
      "default": "start",
      "required": false,
      "description": "Expand ikonunun header icindeki konumu."
    },
    {
      "name": "bordered",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Kenarlık gorunumunu belirler."
    },
    {
      "name": "ghost",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Ghost yuzey gorunumu."
    },
    {
      "name": "ariaLabel",
      "type": "string",
      "default": "Accordion",
      "required": false,
      "description": "Landmark adini belirler."
    },
    {
      "name": "disableGutters",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Spacing ritmini kaldirmak icin kullanilir."
    },
    {
      "name": "collapsible",
      "type": "'header' | 'icon' | 'disabled'",
      "default": "header",
      "required": false,
      "description": "Trigger bolgesini belirler."
    },
    {
      "name": "destroyOnHidden",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Panel lifecycle davranisi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md'",
      "default": "md",
      "required": false,
      "description": "Accordion density ve boyutunu belirler."
    },
    {
      "name": "classes",
      "type": "AccordionClasses",
      "default": "-",
      "required": false,
      "description": "Dar slot class override yuzeyi."
    },
    {
      "name": "slotProps",
      "type": "SlotProps<AccordionSlot>",
      "default": "-",
      "required": false,
      "description": "Internal slot elementlerinde className, style vb. override imkani saglar."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
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
    "single vs multiple expansion",
    "disabled panel guard",
    "description + extra header content",
    "ghost disclosure surface",
    "icon-only toggle ve no-gutters spacing",
    "nested disclosure helper recipes"
  ],
  "regressionFocus": [
    "aria-expanded / aria-controls wiring",
    "controlled value parity",
    "disabled guard",
    "panel mount on expand",
    "destroyOnHidden / forceRender parity",
    "icon-only trigger behavior",
    "section adapter and preset helper parity"
  ]
},
};

export default entry;
