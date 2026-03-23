import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Pagination",
  indexItem: {
  "name": "Pagination",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "pagination",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Pagination",
  "demoMode": "live",
  "description": "Pagination primitivei; server/client modlari, built-in size changer ve quick jumper, router-first item linkleri ve bilgi yogun dataset gezintisini tek API ile sunar.",
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
    "beta",
    "flow-navigation"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { Pagination } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationClientCompactShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationClientDefaultShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationCenteredFirstLastShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationCompactNoInfoShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationDisabledShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationEllipsisTightShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationEllipsisWideShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationGhostMobileShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationReadonlyShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationRoundedOutlinedShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationServerNoInfoShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationSimplePillShowcase.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/DesignLabPaginationUnknownTotalStreamShowcase.tsx"
  ]
},
  apiItem: {
  "name": "Pagination",
  "variantAxes": [
    "mode: server | client",
    "size: sm | md",
    "density: default | compact | simple",
    "appearance: default | outline | ghost",
    "shape: rounded | pill",
    "align: start | center | end",
    "built-ins: size changer | quick jumper",
    "responsive: fixed | compact viewport",
    "item rendering: button | link"
  ],
  "stateModel": [
    "disabled",
    "controlled page"
  ],
    "previewStates": [
      "disabled",
      "compact",
      "simple-pill",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled",
      "uncontrolled",
      "page-size sync",
      "ellipsis range",
      "quick jumper commit",
      "router-first item links",
      "prev-next guard",
      "simple indicator mode"
    ],
  "props": [
    {
      "name": "totalItems",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Toplam kayit sayisi ve sayfa sayisi hesabinin kaynagidir."
    },
    {
      "name": "pageSize",
      "type": "number",
      "default": "10",
      "required": false,
      "description": "Tek sayfada gosterilen kayit adedi."
    },
    {
      "name": "defaultPageSize",
      "type": "number",
      "default": "10",
      "required": false,
      "description": "Varsayilan sayfa boyutu."
    },
    {
      "name": "onPageSizeChange",
      "type": "(pageSize: number) => void",
      "default": "-",
      "required": false,
      "description": "Sayfa boyutu degisim callback'i."
    },
    {
      "name": "resetPageOnPageSizeChange",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Sayfa boyutu degistiginde sayfayi sifirlar."
    },
    {
      "name": "page",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Controlled sayfa state'i."
    },
    {
      "name": "defaultPage",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Uncontrolled sayfa state'i."
    },
    {
      "name": "mode",
      "type": "'server' | 'client'",
      "default": "server",
      "required": false,
      "description": "Dataset kaynagina gore bilgi etiketi ve davranis tonunu belirler."
    },
    {
      "name": "appearance",
      "type": "'default' | 'outline' | 'ghost'",
      "default": "default",
      "required": false,
      "description": "Toolbar stil varyanti."
    },
    {
      "name": "shape",
      "type": "'rounded' | 'pill'",
      "default": "rounded",
      "required": false,
      "description": "Buton seklini belirler."
    },
    {
      "name": "align",
      "type": "'start' | 'center' | 'end'",
      "default": "start",
      "required": false,
      "description": "Toolbar hizalamasi."
    },
    {
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Yogun grid varyanti."
    },
    {
      "name": "simple",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Simple pager varyanti."
    },
    {
      "name": "showPageInfo",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Sayfa bilgisini gosterir."
    },
    {
      "name": "showSizeChanger",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Page-size secicisini gosterir."
    },
    {
      "name": "pageSizeOptions",
      "type": "number[]",
      "default": "[10,20,50,100]",
      "required": false,
      "description": "Sayfa boyutu secenekleri."
    },
    {
      "name": "showQuickJumper",
      "type": "boolean | quick-jumper-options",
      "default": "false",
      "required": false,
      "description": "Sayfa atlama girisini built-in olarak acip clamp ve commit davranisini primitive icinde tutar."
    },
    {
      "name": "responsive",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Dar viewport icin kompaktlasma saglar."
    },
    {
      "name": "showLessItems",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Daha sikisik sayfa penceresi."
    },
    {
      "name": "getItemLinkProps",
      "type": "(item) => { href, target, rel }",
      "default": "-",
      "required": false,
      "description": "Page ve nav itemlarini router-first veya SEO odakli linkler olarak render etmeye izin verir."
    },
    {
      "name": "size",
      "type": "'sm' | 'md'",
      "default": "md",
      "required": false,
      "description": "Pagination buton boyutunu belirler."
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
    "server-side matrix",
    "compact client-side",
    "built-in size changer",
    "built-in quick jumper",
    "ellipsis behavior",
    "simple pill pager",
    "unknown total stream footer"
  ],
  "regressionFocus": [
    "page clamp",
    "page-size reset",
    "quick jumper clamp",
    "router-first anchor rendering",
    "aria-current",
    "prev-next disabled guards",
    "simple mode sync",
    "appearance-shape rendering",
    "responsive compact viewport"
  ]
},
};

export default entry;
