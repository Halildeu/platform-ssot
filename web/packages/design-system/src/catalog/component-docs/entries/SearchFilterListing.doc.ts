import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SearchFilterListing",
  indexItem: {
  "name": "SearchFilterListing",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "page_blocks",
  "subgroup": "recipes",
  "taxonomyGroupId": "search_filtering",
  "taxonomySubgroup": "Search + filter listings",
  "demoMode": "live",
  "description": "PageHeader, FilterBar, SummaryStrip ve sonuc listesini ayni listing recipe kompozisyonunda toplar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-11",
    "recipes",
    "stable",
    "listing"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1",
  "importStatement": "import { SearchFilterListing } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "SearchFilterListing",
  "variantAxes": [
    "results: empty | listed | custom-surface",
    "filters: hidden | visible",
    "summary: absent | present",
    "size: default | compact"
  ],
  "stateModel": [
    "full",
    "readonly",
    "disabled",
    "hidden",
    "loading",
    "filter shell visibility",
    "summary strip visibility",
    "result list fallback"
  ],
    "previewStates": [
      "full",
      "readonly",
      "disabled",
      "hidden",
      "loading",
      "filter shell visibility",
      "summary strip visibility",
      "result list fallback",
      "dark-theme"
    ],
    "behaviorModel": [
      "theme-aware token resolution"
    ],
  "props": [
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Recipe header ana basligini tanimlar."
    },
    {
      "name": "description",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Baslik altindaki aciklama metni; PageHeader subtitle olarak render edilir."
    },
    {
      "name": "eyebrow",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Baslik ustundeki kategori veya context etiketi."
    },
    {
      "name": "status",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Durum badge veya etiket alani; header sag tarafinda gosterilir."
    },
    {
      "name": "meta",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header sag tarafindaki meta bilgisi."
    },
    {
      "name": "actions",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header aksiyonlari (butonlar, menuler)."
    },
    {
      "name": "filters",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "FilterBar icerisinde render edilecek filtre kontrolleri."
    },
    {
      "name": "onReset",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Filtre sifirlama handler'i."
    },
    {
      "name": "onSaveView",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Gorunum kaydetme handler'i."
    },
    {
      "name": "filterExtra",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "FilterBar ek aksiyonlari (badge, buton vb.)."
    },
    {
      "name": "summaryItems",
      "type": "SummaryStripItem[]",
      "default": "[]",
      "required": false,
      "description": "Result shell altindaki KPI strip verisi."
    },
    {
      "name": "items",
      "type": "ReactNode[]",
      "default": "[]",
      "required": false,
      "description": "Varsayilan sonuc listesi ogeleri."
    },
    {
      "name": "results",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Tamamen ozel sonuc yuzeyi; verildiginde items yerine render edilir."
    },
    {
      "name": "listTitle",
      "type": "ReactNode",
      "default": "Sonuclar",
      "required": false,
      "description": "Sonuc listesi basligi."
    },
    {
      "name": "listDescription",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Sonuc listesi aciklamasi."
    },
    {
      "name": "emptyStateLabel",
      "type": "ReactNode",
      "default": "Eslesen sonuc bulunamadi.",
      "required": false,
      "description": "Items bos oldugunda gosterilen mesaj."
    },
    {
      "name": "activeFilters",
      "type": "ActiveFilter[]",
      "default": "[]",
      "required": false,
      "description": "Uygulanmis filtre chip'leri — her biri label, value ve onRemove icerir."
    },
    {
      "name": "onClearAllFilters",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Tum aktif filtreleri temizle handler'i."
    },
    {
      "name": "totalCount",
      "type": "number",
      "default": "-",
      "required": false,
      "description": "Toplam sonuc sayisi — verildiginde 'X sonuc' etiketi gosterilir."
    },
    {
      "name": "sortOptions",
      "type": "SortOption[]",
      "default": "[]",
      "required": false,
      "description": "Siralama secenekleri — verildiginde dropdown gosterilir."
    },
    {
      "name": "activeSort",
      "type": "SortState",
      "default": "-",
      "required": false,
      "description": "Aktif siralama durumu (key + direction)."
    },
    {
      "name": "onSortChange",
      "type": "(key: string, direction: 'asc' | 'desc') => void",
      "default": "-",
      "required": false,
      "description": "Siralama degistiginde cagrilan handler."
    },
    {
      "name": "selectable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Coklu secim modunu etkinlestirir."
    },
    {
      "name": "selectedKeys",
      "type": "Key[]",
      "default": "[]",
      "required": false,
      "description": "Secili oge anahtarlari."
    },
    {
      "name": "onSelectionChange",
      "type": "(keys: Key[]) => void",
      "default": "-",
      "required": false,
      "description": "Secim degistiginde cagrilan handler."
    },
    {
      "name": "batchActions",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Secim cizgisindeki toplu aksiyon butonlari."
    },
    {
      "name": "toolbar",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "FilterBar sag tarafindaki toolbar aksiyonlari."
    },
    {
      "name": "onReload",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Yeniden yukleme handler'i — verildiginde reload ikonu gosterilir."
    },
    {
      "name": "aria-label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Section elementine erisilebilirlik etiketi ekler; ekran okuyucular icin onemlidir."
    },
    {
      "name": "role",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Section elementinin ARIA rolunu override eder."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Icerik yukenirken iskelet placeholder gosterir."
    },
    {
      "name": "size",
      "type": "'default' | 'compact'",
      "default": "default",
      "required": false,
      "description": "Yogunluk modu: default veya compact."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy temelli gorunurluk ve interaction kontrolu."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Kok section elementine ek CSS siniflari ekler."
    }
  ],
  "previewFocus": [
    "policy inventory listing",
    "search + filter shell"
  ],
  "regressionFocus": [
    "empty fallback parity",
    "filter action wiring",
    "summary/result ordering",
    "loading skeleton parity",
    "compact size layout"
  ]
},
};

export default entry;
