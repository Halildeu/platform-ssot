import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ThemeLayout",
  indexItem: {
    "name": "ThemeLayout",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "layout",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Tema onizleme layout",
    "demoMode": "live",
    "description": "Secilen temaya gore grid duzenini adapte eden slot bazli dashboard layout bileseni; executive, operations, analytics ve compact tema modlari destekler.",
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
    "importStatement": "import { ThemeLayout } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ThemeLayout",
    "variantAxes": [
      "theme: executive | operations | analytics | compact"
    ],
    "stateModel": [
      "executive",
      "operations",
      "analytics",
      "compact"
    ],
    "previewStates": ["default-types"],
    "behaviorModel": [
      "slot-based content placement (header, charts, grid, sidebar, footer)",
      "theme-driven grid arrangement",
      "responsive column layout",
      "CSS grid 12-column system"
    ],
    "props": [
      { "name": "theme", "type": "LayoutTheme", "default": "-", "required": true, "description": "Grid duzenini ve yogunlugu kontrol eden layout temasi." },
      { "name": "slots", "type": "ThemeLayoutSlots", "default": "-", "required": true, "description": "Isimli icerik yuvalari (header, charts, grid, sidebar, footer)." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "4 theme layout variations",
      "slot content placement",
      "responsive behavior"
    ],
    "regressionFocus": [
      "bos slots nesnesi",
      "tek slot dolu durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
