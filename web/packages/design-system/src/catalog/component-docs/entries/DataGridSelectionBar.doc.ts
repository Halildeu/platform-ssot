import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DataGridSelectionBar",
  indexItem: {
    "name": "DataGridSelectionBar",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_data_grid",
    "subgroup": "data_grid",
    "taxonomyGroupId": "x_data_grid",
    "taxonomySubgroup": "Selection bar",
    "demoMode": "live",
    "description": "Grid satirlari secildiginde ortaya cikan toplu islem barini yonetir; secim sayisi, temizleme ve slot bazli aksiyon alani sunar.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "data-grid",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { DataGridSelectionBar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "DataGridSelectionBar",
    "variantAxes": [
      "visibility: hidden | visible",
      "density: compact | comfortable"
    ],
    "stateModel": [
      "hidden (0 selected)",
      "visible (1+ selected)",
      "multi-selected"
    ],
    "previewStates": [
      "single-selected",
      "multi-selected",
      "with-actions",
      "dark-theme"
    ],
    "behaviorModel": [
      "selection count display",
      "clear selection action",
      "slot-based bulk action layout",
      "animated show/hide transition",
      "keyboard activation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "selectedCount",
        "type": "number",
        "default": "0",
        "required": true,
        "description": "Secili satir sayisini belirler; 0 ise bar gizlenir."
      },
      {
        "name": "onClearSelection",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Secimi temizle aksiyonu tetiklendiginde cagrilacak callback."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Toplu islem butonlari icin slot bazli aksiyon alani."
      },
      {
        "name": "selectedLabel",
        "type": "string",
        "default": "secili",
        "required": false,
        "description": "Secim sayisi yaninda gosterilen etiket metni."
      },
      {
        "name": "clearLabel",
        "type": "string",
        "default": "Secimi Temizle",
        "required": false,
        "description": "Temizleme butonunun etiket metni."
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
        "description": "Bar boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "single vs multi selection display",
      "bulk action slot layout",
      "show/hide transition"
    ],
    "regressionFocus": [
      "sifir secimde gizlenme",
      "secim sayisi guncelleme dogrulugu",
      "keyboard activation ve focus-visible",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
