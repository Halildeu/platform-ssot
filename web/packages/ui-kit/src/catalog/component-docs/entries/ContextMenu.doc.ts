import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ContextMenu",
  indexItem: {
  "name": "ContextMenu",
  "kind": "component",
  "importStatement": "import { ContextMenu } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "overlays",
  "subgroup": "context_menu",
  "tags": [],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "overlays_portals",
  "taxonomySubgroup": "Context menu",
  "demoMode": "live",
  "description": "ContextMenu action ve right-click akislari icin overlay extension primitive’i.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "backlog_contract",
    "preview_before_release"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "contextual_quick_actions",
  "roadmapWaveId": "wave_8_overlay_extensions",
  "acceptanceContractId": "ui-library-wave-8-overlay-extensions-v1"
},
  apiItem: {
  "name": "ContextMenu",
  "variantAxes": [
    "triggerMode: button | contextmenu",
    "align: left | right",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "closed / open",
    "outside click close",
    "escape dismiss",
    "policy-blocked interaction"
  ],
  "props": [
    {
      "name": "items",
      "type": "ContextMenuItem[]",
      "default": "[]",
      "required": true,
      "description": "Menude gosterilecek label, description, shortcut ve danger bilgisini tasir."
    },
    {
      "name": "trigger / buttonLabel",
      "type": "ReactNode | string",
      "default": "Bağlam menüsü",
      "required": false,
      "description": "Button veya surface trigger metnini tanimlar."
    },
    {
      "name": "triggerMode",
      "type": "'button' | 'contextmenu'",
      "default": "button",
      "required": false,
      "description": "Button trigger veya sağ tık yüzeyi davranışını seçer."
    },
    {
      "name": "title",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Overlay içindeki menü başlığını ve aria label bağını üretir."
    },
    {
      "name": "align",
      "type": "'left' | 'right'",
      "default": "left",
      "required": false,
      "description": "Button trigger modunda menünün yatay hizasını belirler."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanlı görünürlük ve etkileşim seviyesini kontrol eder."
    }
  ],
  "previewFocus": [
    "button trigger actions",
    "right click surface",
    "selection summary",
    "policy blocked interaction"
  ],
  "regressionFocus": [
    "outside click close",
    "escape close parity",
    "contextmenu open positioning",
    "selection callback stability"
  ]
},
};

export default entry;
