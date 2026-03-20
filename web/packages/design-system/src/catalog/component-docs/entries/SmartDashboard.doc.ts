import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SmartDashboard",
  indexItem: {
    "name": "SmartDashboard",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "layout",
    "subgroup": "dashboard",
    "taxonomyGroupId": "layout",
    "taxonomySubgroup": "Dashboard & Grid",
    "demoMode": "live",
    "description": "Akilli dashboard componenti; widget grid yonetimi, siralama, pinleme, zaman araligi filtresi ve yogunluk kontrolleri sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-3",
      "layout",
      "stable"
    ],
    "importStatement": "import { SmartDashboard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SmartDashboard",
    "variantAxes": [
      "density: compact | comfortable | spacious",
      "columns: 1 | 2 | 3 | 4"
    ],
    "stateModel": [
      "widget reorder active",
      "widget pinned state",
      "time range selection"
    ],
    "previewStates": [
      "default-grid",
      "loading-widgets",
      "dark-theme"
    ],
    "behaviorModel": [
      "widget drag-and-drop reorder",
      "widget pin/unpin toggle",
      "bulk refresh all widgets",
      "time range filter propagation",
      "responsive column layout",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "widgets",
        "type": "DashboardWidget[]",
        "default": "-",
        "required": true,
        "description": "Dashboard widget tanimlari dizisi."
      },
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Dashboard baslik metni."
      },
      {
        "name": "description",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Dashboard aciklama metni."
      },
      {
        "name": "greeting",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Kullanici karsilama mesaji."
      },
      {
        "name": "onWidgetReorder",
        "type": "(widgetIds: string[]) => void",
        "default": "-",
        "required": false,
        "description": "Widget siralama degistiginde cagrilacak callback."
      },
      {
        "name": "onWidgetPin",
        "type": "(widgetId: string, pinned: boolean) => void",
        "default": "-",
        "required": false,
        "description": "Widget pinlendiginde/cikarildiginda cagrilacak callback."
      },
      {
        "name": "refreshAll",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Tum widgetlari yenileyen callback."
      },
      {
        "name": "timeRange",
        "type": "TimeRange",
        "default": "-",
        "required": false,
        "description": "Secili zaman araligi."
      },
      {
        "name": "onTimeRangeChange",
        "type": "(range: TimeRange) => void",
        "default": "-",
        "required": false,
        "description": "Zaman araligi degistiginde cagrilacak callback."
      },
      {
        "name": "columns",
        "type": "1 | 2 | 3 | 4",
        "default": "3",
        "required": false,
        "description": "Grid sutun sayisi."
      },
      {
        "name": "density",
        "type": "'compact' | 'comfortable' | 'spacious'",
        "default": "comfortable",
        "required": false,
        "description": "Widget araligi yogunluk seviyesi."
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
      "widget grid layout",
      "drag-and-drop reorder",
      "time range filter"
    ],
    "regressionFocus": [
      "widget reorder persistence",
      "pin state toggle",
      "responsive column breakpoints",
      "refresh all propagation"
    ]
  },
};

export default entry;
