import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Tabs",
  indexItem: {
  "name": "Tabs",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "tabs",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Tabs",
  "demoMode": "live",
  "description": "Tabs navigation primitivei; controlled/uncontrolled state, keyboard activation, router-aware tab links ve token-first tablist davranisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
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
    "wave-2",
    "navigation",
    "stable"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { Tabs } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabComponentDetailSections.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/detail-tabs/DesignLabRecipeDetailSections.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Tabs",
  "variantAxes": [
    "variant: standard | fullWidth | scrollable",
    "appearance: underline | pill",
    "orientation: horizontal | vertical",
    "activationMode: automatic | manual",
    "routing: button | anchor",
    "layout: default | centered",
    "content: wrap | icon-positioned | action-slot",
    "extensibility: indicator | classes | editable"
  ],
  "stateModel": [
    "disabled",
    "controlled selection"
  ],
    "previewStates": [
      "disabled",
      "scrollable-overflow",
      "vertical-manual",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled",
      "uncontrolled",
      "disabled tab",
      "badge/icon metadata",
      "selection follows focus alias",
      "router-aware link rendering",
      "focus loop guard",
      "overflow scroll controls",
      "editable add/close actions",
      "per-item lifecycle override"
    ],
  "props": [
    {
      "name": "items",
      "type": "TabItem[]",
      "default": "-",
      "required": true,
      "description": "Label, content, badge, icon ve disabled kararlarini tasiyan sekme listesi."
    },
    {
      "name": "value",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled state secimini belirler."
    },
    {
      "name": "defaultValue",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Uncontrolled state secimini belirler."
    },
    {
      "name": "appearance",
      "type": "'underline' | 'pill'",
      "default": "underline",
      "required": false,
      "description": "Sekmenin navigation tonu ve vurgu katmanini belirler."
    },
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "default": "horizontal",
      "required": false,
      "description": "Wayfinding yonunu ve layout dagilimini belirler."
    },
    {
      "name": "activationMode",
      "type": "'automatic' | 'manual' ('auto' alias accepted)",
      "default": "automatic",
      "required": false,
      "description": "Keyboard navigation sirasinda panel aktivasyon davranisini belirler; eski kullanimlarla uyum icin 'auto' alias'i da kabul edilir."
    },
    {
      "name": "variant",
      "type": "'line' | 'enclosed' | 'pill' | 'standard' | 'fullWidth' | 'scrollable'",
      "default": "line",
      "required": false,
      "description": "Tablist yerlesiminin gorsel varyantini belirler; standard/fullWidth/scrollable legacy alias olarak line'a normalize edilir."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Tab butonlarinin boyut ve padding kararini belirler."
    },
    {
      "name": "density",
      "type": "'compact' | 'comfortable' | 'spacious'",
      "default": "comfortable",
      "required": false,
      "description": "Tab butonlarinin gap, text size ve padding yogunlugunu belirler."
    },
    {
      "name": "selectionFollowsFocus",
      "type": "boolean",
      "default": "activationMode'dan turetilir",
      "required": false,
      "description": "MUI parity icin acik isimli focus-secim semantigi sunar; verilirse activationMode davranisini override eder."
    },
    {
      "name": "loopFocus",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Ok tuslarinin son sekmeden basa veya ilk sekmeden sona wrap edip etmeyecegini belirler."
    },
    {
      "name": "centered",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yatay tablist yerlesimini merkeze alir."
    },
    {
      "name": "showScrollButtons",
      "type": "boolean | 'auto'",
      "default": "auto",
      "required": false,
      "description": "Scrollable varyantta ileri-geri tab kaydirma kontrollerini gosterir."
    },
    {
      "name": "allowScrollButtonsMobile",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Mobilde scroll kontrollerini gosterir."
    },
    {
      "name": "tabBarExtraContent",
      "type": "ReactNode | { start?: ReactNode; end?: ReactNode }",
      "default": "-",
      "required": false,
      "description": "Tablist kenarina action slot veya filtre/komut alani ekler."
    },
    {
      "name": "labelWrap",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uzun etiketlerin satira yayilmasini belirler."
    },
    {
      "name": "iconPosition",
      "type": "'start' | 'end' | 'top' | 'bottom'",
      "default": "start",
      "required": false,
      "description": "Ikonun label etrafindaki konumunu belirler."
    },
    {
      "name": "showIndicator",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Aktif sekmeye ek indicator katmani cizer."
    },
    {
      "name": "indicatorPlacement",
      "type": "'top' | 'bottom' | 'left' | 'right'",
      "default": "bottom",
      "required": false,
      "description": "Indicator konumunu belirler."
    },
    {
      "name": "indicatorClassName",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Dar sinif override yuzeyi."
    },
    {
      "name": "getTabLinkProps",
      "type": "(tab) => { href, target?, rel?, download? }",
      "default": "-",
      "required": false,
      "description": "Sekmeleri button yerine anchor olarak render ederek router-first ve SEO-aware navigation senaryolarini primitive seviyesine tasir."
    },
    {
      "name": "classes",
      "type": "TabsClasses",
      "default": "-",
      "required": false,
      "description": "Root, list, tab, indicator, panel ve action butonlari icin dar class contract sunar."
    },
    {
      "name": "editable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Tab bar sonuna add button ekleyerek editable davranisi acar."
    },
    {
      "name": "onAddTab",
      "type": "(event) => void",
      "default": "-",
      "required": false,
      "description": "Tab ekleme callback'i."
    },
    {
      "name": "addButtonLabel",
      "type": "string",
      "default": "Add tab",
      "required": false,
      "description": "Ekleme butonunun accessible label'i."
    },
    {
      "name": "onCloseTab",
      "type": "(value: string, event: React.MouseEvent) => void",
      "default": "-",
      "required": false,
      "description": "Sekme bazli close aksiyonunu disariya verir."
    },
    {
      "name": "onTabClick",
      "type": "(value, event) => void",
      "default": "-",
      "required": false,
      "description": "Klik tab navigasyonunu analytics veya yan etkiler icin disariya raporlar."
    },
    {
      "name": "slotProps",
      "type": "SlotProps<TabsSlot>",
      "default": "-",
      "required": false,
      "description": "Internal slot elementlerinde className, style vb. override imkani saglar."
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
    "controlled underline",
    "vertical manual activation",
    "router-aware workspace tabs",
    "badge/icon metadata",
    "centered horizontal layout",
    "scrollable action slot",
    "editable tabs with custom indicator"
  ],
  "regressionFocus": [
    "APG keyboard navigation",
    "disabled tab drift",
    "panel activation semantics",
    "selection follows focus override",
    "focus loop boundary semantics",
    "anchor tab rendering",
    "scroll controls state",
    "close button propagation guard",
    "forceRender destroyOnHidden precedence"
  ]
},
};

export default entry;
