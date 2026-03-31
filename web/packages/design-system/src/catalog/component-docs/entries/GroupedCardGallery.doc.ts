import type { DesignLabComponentDocEntry } from "../types";

const entry: DesignLabComponentDocEntry = {
  name: "GroupedCardGallery",
  indexItem: {
    name: "GroupedCardGallery",
    kind: "component",
    availability: "exported",
    lifecycle: "stable",
    maturity: "beta",
    group: "data_display",
    subgroup: "Card collections / gallery",
    taxonomyGroupId: "data_display",
    taxonomySubgroup: "Card collections / gallery",
    demoMode: "live",
    description:
      "Collapse/expand grouped card gallery with search, responsive grid, and localStorage-persisted expand state. Ideal for report hubs, service directories, and design lab landing pages.",
    sectionIds: [
      "component_library_management",
      "navigation_patterns",
      "accessibility_compliance",
    ],
    qualityGates: [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support",
    ],
    tags: ["wave-3", "navigation", "beta", "gallery", "search", "grouping"],
    dependsOn: ["Badge", "Card", "SearchInput", "EmptyState"],
    usedByComponents: [],
    roadmapWaveId: "wave_3_patterns",
    importStatement:
      "import { GroupedCardGallery } from '@mfe/design-system';",
    whereUsed: ["design-lab", "mfe-reporting"],
  },
  apiItem: {
    name: "GroupedCardGallery",
    variantAxes: [
      "columns: 1 | 2 | 3 | 4 (responsive)",
      "search: visible (always)",
      "groups: expanded | collapsed",
    ],
    previewStates: [
      "default",
      "search-active",
      "all-collapsed",
      "all-expanded",
      "empty-results",
    ],
    behaviorModel: [
      "Debounced search (300ms) across title, description, tags",
      "Collapse/expand groups by clicking header",
      "localStorage persistence of expand/collapse state",
      "Auto-expand matching groups during search",
      "Responsive grid: 1-4 columns based on viewport",
      "Custom card rendering via renderCard prop",
    ],
    props: [
      {
        name: "items",
        type: "GalleryItem[]",
        default: "—",
        required: true,
        description:
          "All items to display. Grouped automatically by groupBy field.",
      },
      {
        name: "groupBy",
        type: "keyof T & string",
        default: '"group"',
        required: false,
        description: "Field used for grouping items.",
      },
      {
        name: "searchFields",
        type: "(keyof T & string)[]",
        default: '["title", "description", "tags"]',
        required: false,
        description: "Fields searched during filtering.",
      },
      {
        name: "searchPlaceholder",
        type: "string",
        default: '"Search..."',
        required: false,
        description: "Placeholder text for the search input.",
      },
      {
        name: "defaultExpandedGroups",
        type: "string[]",
        default: "first 2 groups",
        required: false,
        description: "Groups expanded on first render.",
      },
      {
        name: "groupOrder",
        type: "string[] | ((a, b) => number)",
        default: "alphabetical",
        required: false,
        description:
          "Group display order — array of keys or comparator function.",
      },
      {
        name: "onItemClick",
        type: "(item: T) => void",
        default: "—",
        required: false,
        description: "Handler fired when a card is clicked.",
      },
      {
        name: "renderCard",
        type: "(item: T) => ReactNode",
        default: "GalleryCard",
        required: false,
        description: "Custom card renderer, overrides default GalleryCard.",
      },
      {
        name: "emptyState",
        type: "ReactNode",
        default: "built-in empty state",
        required: false,
        description: "Custom empty state shown when search yields no results.",
      },
      {
        name: "summaryFormatter",
        type: "(all, filtered) => string",
        default: '"N items"',
        required: false,
        description: "Formats the summary line below the search bar.",
      },
      {
        name: "storageKey",
        type: "string",
        default: "—",
        required: false,
        description: "localStorage key for persisting expand/collapse state.",
      },
      {
        name: "columns",
        type: "GalleryColumns",
        default: "{ sm: 1, md: 2, lg: 3, xl: 4 }",
        required: false,
        description: "Responsive column counts per breakpoint.",
      },
    ],
    previewFocus: ["responsive grid", "search interaction", "collapse/expand"],
    regressionFocus: [
      "localStorage persistence",
      "search debounce timing",
      "group ordering stability",
    ],
  },
};

export default entry;
