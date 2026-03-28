import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MenuBar",
  indexItem: {
  "name": "MenuBar",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Menu Bar",
  "demoMode": "live",
  "description": "Yatay uygulama komutlari ve navigation aksiyonlari icin popup submenu destekli menubar primitive'i sunar.",
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
  "tags": [
    "wave-2",
    "navigation",
    "beta",
    "layout"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { MenuBar } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/MenuBar.stories.tsx"
  ]
},
  apiItem: {
  "name": "MenuBar",
  "variantAxes": [
    "size: sm | md",
    "surface: default | outline | ghost",
    "top-level item: action | link | submenu-trigger",
    "label-visibility: always | active | none | responsive",
    "overflow: none | scroll | collapse-to-more",
    "overflow control: label + maxVisibleItems + item priority",
    "submenu-trigger: click | hover",
    "root grouping: primary | secondary | utility",
    "root emphasis: default | promoted | subtle",
    "responsive: breakpoint query + mobile fallback",
    "content: label | icon-label | icon-badge | submenu | utility | preset-adapted | start-slot | end-slot | pinned root | rich submenu panel | search handoff | favorites | recents"
  ],
  "stateModel": [
    "controlled or uncontrolled selected root item",
    "controlled or uncontrolled open submenu root",
    "currentPath-based active root resolution",
    "horizontal roving focus",
    "submenu popup composition",
    "overflow bucket / more menu composition",
    "priority-based visible root retention",
    "search header composition",
    "search handoff to root or submenu",
    "favorite and recent root memory",
    "responsive compact viewport fallback",
    "grouped submenu headings",
    "readonly or disabled interaction guard"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "overflow-collapsed",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled selected root item",
      "controlled or uncontrolled open submenu root",
      "currentPath-based active root resolution",
      "horizontal roving focus",
      "submenu popup composition",
      "overflow bucket / more menu composition",
      "priority-based visible root retention",
      "search header composition",
      "search handoff to root or submenu",
      "favorite and recent root memory",
      "responsive compact viewport fallback",
      "grouped submenu headings",
      "readonly or disabled interaction guard"
    ],
  "props": [
    {
      "name": "items",
      "type": "MenuBarItem[]",
      "default": "-",
      "required": true,
      "description": "Top-level menubar item listesini, submenu item'larini ve badge/icon bilgisini tasir."
    },
    {
      "name": "value / defaultValue / onValueChange",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Secili top-level item state'ini controlled veya uncontrolled modda yonetir."
    },
    {
      "name": "openValue / defaultOpenValue / onOpenValueChange",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Hangi root item submenu'sunun acik oldugunu controlled veya uncontrolled modda takip eder."
    },
    {
      "name": "onItemClick / onMenuItemSelect",
      "type": "(value, event) => void / (rootValue, item) => void",
      "default": "-",
      "required": false,
      "description": "Top-level aksiyon tiklamasini ve popup menu icindeki leaf secimini disari raporlar."
    },
    {
      "name": "ariaLabel / menuAriaLabel / size / appearance",
      "type": "string / string / 'sm' | 'md' / 'default' | 'outline' | 'ghost'",
      "default": "'Application menu' / 'Menu bar submenu' / 'md' / 'default'",
      "required": false,
      "description": "Menubar landmark adini, submenu aria label son ekini, hit target yogunlugunu ve surface tonunu belirler."
    },
    {
      "name": "currentPath / items[].href / items[].matchPath / labelVisibility / utility",
      "type": "string / string / string | string[] / 'always' | 'active' | 'none' | 'responsive' / ReactNode",
      "default": "- / - / - / 'always' / -",
      "required": false,
      "description": "Route-aware aktif root secimini, top-level label gorunurluk politikasini ve sag utility slotunu yonetir. 'responsive' modu genis ekranda metin, daha dar ekranda ikon-only davranisina gecer."
    },
    {
      "name": "overflowBehavior / overflowLabel / maxVisibleItems / submenuTrigger",
      "type": "'none' | 'scroll' | 'collapse-to-more' / ReactNode / number / 'click' | 'hover'",
      "default": "'none' / auto / - / 'click'",
      "required": false,
      "description": "Tasan root item'larin scroll mu yoksa More menusu mu kullanacagini, overflow tetikleyicisinin etiketini, gorunen kok sayisinin ust limitini ve submenu'nun tiklama veya hover ile acilip acilmayacagini belirler."
    },
    {
      "name": "items[].overflowPriority",
      "type": "number",
      "default": "0",
      "required": false,
      "description": "Buyuk navigation listelerinde hangi root item'larin gorunur alanda tutulacagini onceliklendirir; aktif item yine her zaman korunur."
    },
    {
      "name": "items[].group",
      "type": "'primary' | 'secondary' | 'utility'",
      "default": "'primary'",
      "required": false,
      "description": "Root item'lari segmentlere ayirir; menubar icinde gruplar arasina divider ekleyerek buyuk bilgi mimarisini daha okunur kilar."
    },
    {
      "name": "items[].emphasis",
      "type": "'default' | 'promoted' | 'subtle'",
      "default": "'default'",
      "required": false,
      "description": "Belirli root item'lari one cikarmak veya utility aksiyonlarini daha sakin gostermek icin root seviyesinde vurgu tonu tanimlar."
    },
    {
      "name": "items[].pinned",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Favori veya kritik root item'lari sabitleyip overflow hesaplamasinda her zaman yuksek oncelikle gorunur tutar."
    },
    {
      "name": "showFavoriteToggle / favoriteValues / defaultFavoriteValues / onFavoriteValuesChange",
      "type": "boolean / string[] / string[] / (values) => void",
      "default": "false / - / [] / -",
      "required": false,
      "description": "Root seviyesinde favori toggle affordance'i acar; favori root listesi controlled veya uncontrolled modda tutulabilir ve overflow retention mantigina da etki eder."
    },
    {
      "name": "recentValues / defaultRecentValues / onRecentValuesChange / recentLimit",
      "type": "string[] / string[] / (values) => void / number",
      "default": "- / [] / - / 5",
      "required": false,
      "description": "Son ziyaret edilen root'lari first-class state olarak saklar; search handoff ve enterprise IA recipe'lerinde geri donus hizini arttirir."
    },
    {
      "name": "enableSearchHandoff / searchPlaceholder / searchEmptyStateLabel",
      "type": "boolean / string / ReactNode",
      "default": "false / 'Search menu' / 'No matching routes or actions.'",
      "required": false,
      "description": "Header icinde route ve submenu aksiyonlarini arayan bir search handoff paneli acar; secim root navigation veya submenu komutuna dogrudan gecis yapar."
    },
    {
      "name": "items[].keywords",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Search handoff indeksine ek terimler tasir; kullanicilar route ve action'lari yalniz gorunen label ile sinirli kalmadan bulabilir."
    },
    {
      "name": "items[].menuSurfaceTitle / menuSurfaceDescription / menuSurfaceMeta / menuSurfaceFooter / menuSurfaceClassName",
      "type": "ReactNode / ReactNode / ReactNode / ReactNode / string",
      "default": "-",
      "required": false,
      "description": "Submenu popup'ini yalniz liste degil, daha zengin bir panel olarak kurmaya yarar; mega submenu benzeri aciklayici baslik, meta chip ve footer recipe'lerini primitive seviyesine tasir."
    },
    {
      "name": "startSlot / endSlot / utilityCollapse",
      "type": "ReactNode / ReactNode / 'preserve' | 'hide'",
      "default": "- / - / 'preserve'",
      "required": false,
      "description": "Toolbar benzeri sol-sag slot alanlarini ve compact viewport'ta sag utility alaninin korunup korunmayacagini tanimlar."
    },
    {
      "name": "labelCollapseBreakpoint / responsiveBreakpoint / mobileFallback",
      "type": "string / string / 'none' | 'menu'",
      "default": "- / - / 'none'",
      "required": false,
      "description": "Ayri medya sorgulari ile once label'lari ikon-only moda cekip sonra daha dar noktada tum root item'lari menu fallback'ine indirebilir."
    },
    {
      "name": "classes / access",
      "type": "MenuBarClasses / 'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "- / 'full'",
      "required": false,
      "description": "Dar slot class override yuzeyini ve policy tabanli gorunurluk/etkilesim seviyesini tanimlar."
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
    "horizontal command navigation",
    "submenu trigger parity",
    "link and action item mixing",
    "ghost or outline surface",
    "collapse-to-more overflow",
    "priority-managed mega navigation",
    "search-first header",
    "search handoff results",
    "recent roots memory",
    "segmented root groups",
    "promoted action roots",
    "pinned favorites IA",
    "rich submenu panel surface",
    "start-end slot layout",
    "responsive header fallback",
    "route-aware active root",
    "utility slot composition",
    "preset and route adapter composition"
  ],
  "regressionFocus": [
    "menubar role parity",
    "left-right roving focus",
    "arrowdown submenu open",
    "controlled open state parity",
    "readonly and hidden guard",
    "currentPath active root parity",
    "overflow trigger parity",
    "maxVisibleItems parity",
    "segment divider visibility",
    "promoted root styling",
    "favorite toggle parity",
    "recent root telemetry",
    "pinned root indicator",
    "search handoff result routing",
    "overflow priority retention",
    "hover submenu trigger",
    "responsive compact fallback",
    "responsive icon-only labels",
    "grouped submenu heading visibility",
    "active-only label visibility",
    "helper output parity"
  ]
},
};

export default entry;
