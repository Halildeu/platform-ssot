import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanSwimlane",
  indexItem: {
    "name": "KanbanSwimlane",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Kanban Swimlane",
    "demoMode": "planned",
    "description": "Kanban tahtasinda yatay swimlane bolumleri olusturan container bileseni; kategori veya oncelik bazli kart gruplama saglar.",
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
      "kanban",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { KanbanSwimlane } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanSwimlane",
    "variantAxes": [
      "collapsed: true | false",
      "headerStyle: default | accent"
    ],
    "stateModel": [
      "expanded",
      "collapsed",
      "dragging-over"
    ],
    "previewStates": [
      "expanded",
      "collapsed",
      "multi-swimlane",
      "dragging-over",
      "dark-theme"
    ],
    "behaviorModel": [
      "horizontal lane rendering",
      "collapse/expand toggle",
      "cross-swimlane drag-and-drop",
      "lane header customization",
      "card count badge",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "Swimlane baslik metni."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Swimlane icerisindeki kanban kolonlari."
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Swimlane daraltilmis durumunu kontrol eder."
      },
      {
        "name": "onToggle",
        "type": "(collapsed: boolean) => void",
        "default": "-",
        "required": false,
        "description": "Daraltma/genisletme durumu degistiginde tetiklenen callback."
      },
      {
        "name": "cardCount",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Baslikta gosterilecek kart sayisi."
      },
      {
        "name": "color",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Swimlane baslik aksan rengi."
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
        "description": "Swimlane boyut varyantini belirler."
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
      "collapse/expand toggle",
      "cross-swimlane drag-and-drop",
      "lane header rendering"
    ],
    "regressionFocus": [
      "daraltma/genisletme animasyon tutarliligi",
      "cross-swimlane kart tasima",
      "kart sayisi badge guncelleme",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
