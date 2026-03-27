import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ComparisonTable",
  indexItem: {
    "name": "ComparisonTable",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Karsilastirma tablosu",
    "demoMode": "live",
    "description": "Gerceklesen ve hedef degerleri fark ve trend gostergeleriyle karsilastiran tablo; hiyerarsik gruplama, satir genisletme ve ters fark renklendirme destekler.",
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
    "importStatement": "import { ComparisonTable } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ComparisonTable",
    "variantAxes": [
      "invertVarianceColors: true | false"
    ],
    "stateModel": [
      "flat",
      "hierarchical",
      "expanded"
    ],
    "previewStates": ["default-grid", "empty-board"],
    "behaviorModel": [
      "variance calculation (absolute and percent)",
      "trend direction indicators",
      "hierarchical row nesting with expand/collapse",
      "inverse variance color mode",
      "row click interaction",
      "custom column labels"
    ],
    "props": [
      { "name": "rows", "type": "ComparisonRow[]", "default": "-", "required": true, "description": "Gosterilecek veri satirlari; ic ice children destekler." },
      { "name": "columns", "type": "ComparisonColumnLabels", "default": "-", "required": false, "description": "Ozel sutun baslik etiketleri." },
      { "name": "defaultFormat", "type": "FormatOptions", "default": "-", "required": false, "description": "Satir kendi formati yoksa uygulanan varsayilan formatlama." },
      { "name": "defaultExpandedIds", "type": "string[]", "default": "-", "required": false, "description": "Ilk render'da genisletilmis olacak satir ID'leri." },
      { "name": "invertVarianceColors", "type": "boolean", "default": "-", "required": false, "description": "Negatif farki pozitif olarak gosterir (maliyet azaltma vb.)." },
      { "name": "onRowClick", "type": "(row: ComparisonRow) => void", "default": "-", "required": false, "description": "Satira tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "variance calculation display",
      "hierarchical row expansion",
      "inverted variance colors"
    ],
    "regressionFocus": [
      "bos rows dizisi",
      "target sifir durumunda yuzde hesaplama",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
