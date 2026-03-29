import React from "react";
import * as MfeUiKit from "@mfe/design-system";
import { _xSuiteComponents } from "./xSuiteStubs";

/* Side-effect imports to register extended stubs */
import "./xSuiteStubsExtended";
import "./xSuiteEnterpriseStubs";

/* ---- Non-DOM props that should not be spread to native elements ---- */
/* These are custom props recognized by @mfe/design-system components    */
/* but cause React warnings when they leak to native DOM elements.       */
export const NON_DOM_SAFE_PROPS = new Set([
  "loadingDisplay",
  "selectSize",
  "fullWidth",
  "emptyTitle",
  "emptyDescription",
]);

/* ---- Event logging types for Actions Panel ---- */

export type ActionLogEntry = {
  id: number;
  eventName: string;
  timestamp: number;
  payload: unknown[];
  componentName: string;
};

export type ActionLogSubscriber = (entry: ActionLogEntry) => void;

let _logIdCounter = 0;
const _subscribers = new Set<ActionLogSubscriber>();

export function subscribeToActionLog(fn: ActionLogSubscriber) {
  _subscribers.add(fn);
  return () => { _subscribers.delete(fn); };
}

export function nextLogId(): number {
  return ++_logIdCounter;
}

export function emitActionLog(entry: ActionLogEntry) {
  _subscribers.forEach((fn) => fn(entry));
}

/* ------------------------------------------------------------------ */
/*  PlaygroundPreview — Live component render with prop overrides      */
/*                                                                     */
/*  Resolves a component from @mfe/design-system by name and renders it with   */
/*  the current prop values from the playground state.                  */
/*                                                                     */
/*  For compound components that need children/content, sensible       */
/*  defaults are injected.                                              */
/* ------------------------------------------------------------------ */

/**
 * Component registry — maps component name to the actual React component.
 * We cast @mfe/design-system exports as a record so we can dynamically look up.
 */
const _rawRegistry = {
  ...(MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xSuiteComponents as Record<string, React.ComponentType<Record<string, unknown>>>),
};

/**
 * Alias map — doc names that differ from the actual export name.
 * These are recipe/variant entries that reuse the same underlying component.
 */
export const COMPONENT_ALIASES: Record<string, string> = {
  // MenuBar recipe variants (space-separated doc names)
  "Navigation Menu": "MenuBar",
  "App Header": "MenuBar",
  "Search / Command Header": "MenuBar",
  "Action Header": "MenuBar",
  "Action Bar": "MenuBar",
  "Desktop Menubar": "MenuBar",
  // MenuBar recipe variants (PascalCase / no-space keys)
  NavigationMenu: "MenuBar",
  AppHeader: "MenuBar",
  CommandHeader: "MenuBar",
  ActionHeader: "MenuBar",
  ActionBar: "MenuBar",
  DesktopMenubar: "MenuBar",
  // Page template compositions — render primary layout component (space-separated)
  "CRUD Template": "PageLayout",
  "Dashboard Template": "PageLayout",
  "Detail Template": "PageLayout",
  "Settings Template": "PageLayout",
  "Command Workspace": "PageLayout",
  // Page template compositions (PascalCase / no-space keys)
  CrudTemplate: "PageLayout",
  DashboardTemplate: "PageLayout",
  DetailTemplate: "PageLayout",
  SettingsTemplate: "PageLayout",
  CommandWorkspace: "PageLayout",
  // Components documented under different name than export
  SectionTabs: "DetailSectionTabs",
};

/**
 * Non-component entries — utilities, hooks, constants, theme APIs.
 * These appear in the doc catalog but cannot render a live preview.
 * We classify them by type to show an appropriate fallback UI.
 */
export type NonComponentType = "hook" | "utility" | "constant" | "theme-setter" | "theme-api" | "hoc" | "upcoming";

export const NON_COMPONENT_ENTRIES: Record<string, NonComponentType> = {
  // Hooks
  useToast: "hook",
  useAsyncCombobox: "hook",
  useGridVariants: "hook",
  useAgGridTablePagination: "hook",
  // Utility / factory functions
  buildAuthHeaders: "utility",
  buildEntityGridQueryParams: "utility",
  createAccordionItemsFromSections: "utility",
  createAccordionPreset: "utility",
  createBreadcrumbItemsFromRoute: "utility",
  createMenuBarItemsFromRoutes: "utility",
  createMenuBarPreset: "utility",
  createNavigationDestinationItems: "utility",
  createNavigationRailPreset: "utility",
  createPageHeaderStatItems: "utility",
  createPageHeaderTagItems: "utility",
  createPageLayoutBreadcrumbItems: "utility",
  createPageLayoutPreset: "utility",
  createSegmentedItemsFromFilters: "utility",
  createSegmentedItemsFromRoutes: "utility",
  createSegmentedPreset: "utility",
  resolveAccessState: "utility",
  resolveMenuBarActiveValue: "utility",
  resolveNavigationRailActiveValue: "utility",
  resolveSegmentedNextValue: "utility",
  resolveThemeModeKey: "utility",
  shouldBlockInteraction: "utility",
  toggleVariantDefault: "utility",
  // HOC
  withAccessGuard: "hoc",
  // Theme setter functions
  setAppearance: "theme-setter",
  setDensity: "theme-setter",
  setElevation: "theme-setter",
  setMotion: "theme-setter",
  setOverlayIntensity: "theme-setter",
  setOverlayOpacity: "theme-setter",
  setRadius: "theme-setter",
  setSurfaceTone: "theme-setter",
  setTableSurfaceTone: "theme-setter",
  // Theme state / API
  getResolvedToken: "theme-api",
  getThemeAxes: "theme-api",
  getThemeContract: "theme-api",
  registerTokenResolver: "theme-api",
  resetTokenResolver: "theme-api",
  subscribeThemeAxes: "theme-api",
  updateThemeAxes: "theme-api",
  // X-Suite hooks & utilities
  useScheduler: "hook",
  useRecurrence: "hook",
  useConflictDetection: "hook",
  useKanban: "hook",
  useDragDrop: "hook",
  useKanbanFilter: "hook",
  useWipPolicy: "hook",
  useEditor: "hook",
  useSlashCommands: "hook",
  useMentions: "hook",
  useFormSchema: "hook",
  useConditionalLogic: "hook",
  useAsyncValidation: "hook",
  useMultiStepForm: "hook",
  useColumnBuilder: "hook",
  useGridExport: "hook",
  useGridState: "hook",
  ServerDataSource: "utility",
  createFieldRegistry: "utility",
  createSchemaValidator: "utility",
  defaultSlashCommands: "constant",
  // Theme constants
  THEME_APPEARANCE_OPTIONS: "constant",
  THEME_DENSITY_OPTIONS: "constant",
  THEME_ELEVATION_OPTIONS: "constant",
  THEME_MOTION_OPTIONS: "constant",
  THEME_RADIUS_OPTIONS: "constant",
};

export const NON_COMPONENT_LABELS: Record<NonComponentType, { icon: string; label: string; description: string }> = {
  hook: { icon: "🪝", label: "React Hook", description: "Bu bir React hook'udur ve görsel önizleme sağlanamaz. API dokümantasyonu için aşağıya bakın." },
  utility: { icon: "🔧", label: "Utility Function", description: "Bu bir yardımcı fonksiyondur. Kullanım detayları için API sekmesine bakın." },
  constant: { icon: "📋", label: "Constant / Options", description: "Bu sabit bir konfigürasyon nesnesidir. Değerleri ve kullanımı için API sekmesine bakın." },
  "theme-setter": { icon: "🎨", label: "Theme Setter", description: "Bu bir tema ayar fonksiyonudur. Theme builder ile birlikte kullanılır." },
  "theme-api": { icon: "⚙️", label: "Theme API", description: "Bu bir tema API fonksiyonudur. Tema sistemi ile programatik etkileşim sağlar." },
  hoc: { icon: "🔀", label: "Ust Duzey Bilesen (HOC)", description: "Bu bir HOC'dir. Component'lari wrap ederek ek davranis ekler." },
  upcoming: { icon: "🚧", label: "Upcoming Component", description: "Bu component henüz dışa aktarılmamıştır. Gelecek sürümde kullanıma sunulacaktır." },
};

/**
 * Resolve a component name (possibly with spaces / alias) to a registry key.
 */
export function resolveComponentKey(name: string): string {
  if (COMPONENT_ALIASES[name]) return COMPONENT_ALIASES[name];
  // Try as-is, then PascalCase without spaces
  if (_rawRegistry[name]) return name;
  const noSpaces = name.replace(/\s+/g, "");
  if (_rawRegistry[noSpaces]) return noSpaces;
  return name;
}

export const componentRegistry = new Proxy(_rawRegistry, {
  get(target, prop: string) {
    const key = resolveComponentKey(prop);
    const entry = target[key];
    // If registry entry is undefined, fallback to @mfe/design-system barrel export
    if (entry === undefined && key in target) {
      const kit = MfeUiKit as unknown as Record<string, unknown>;
      if (typeof kit[key] === "function" || (kit[key] && typeof kit[key] === "object")) {
        return kit[key];
      }
    }
    return entry;
  },
});

/**
 * Default children/content for components that need them.
 * `undefined` means the component uses props instead of children,
 * or is a compound component with complex children handled by DEFAULT_PROPS.
 */
export const DEFAULT_CHILDREN: Record<string, React.ReactNode> = {
  /* Primitives — text-bearing */
  Button: "Tikla",
  IconButton: undefined,
  Tag: "Etiket",
  Badge: "Yeni",
  Text: "Hizli kahverengi tilki tembel kopegin uzerinden atlar.",
  LinkInline: "Baglanti metni",
  SearchInput: undefined,

  /* Form controls — no children */
  Checkbox: undefined,
  Radio: undefined,
  Switch: undefined,
  Select: undefined,
  Input: undefined,
  TextInput: undefined,
  Textarea: undefined,
  TextArea: undefined,
  Slider: undefined,
  DatePicker: undefined,
  TimePicker: undefined,
  Upload: undefined,
  Combobox: undefined,
  FormField: undefined,

  /* Feedback — uses props */
  Alert: undefined,
  Tooltip: undefined,
  Spinner: undefined,
  Skeleton: undefined,
  Empty: undefined,
  EmptyErrorLoading: undefined,
  EmptyState: undefined,

  /* Compound — complex children via DEFAULT_PROPS */
  Tabs: undefined,
  Steps: undefined,
  Breadcrumb: undefined,
  Accordion: undefined,
  Segmented: undefined,
  Pagination: undefined,
  NavigationRail: undefined,
  MenuBar: undefined,
  Descriptions: undefined,

  /* Overlays */
  Modal: undefined,
  Dialog: undefined,
  Popover: undefined,
  Dropdown: undefined,
  ContextMenu: undefined,
  CommandPalette: undefined,
  DetailDrawer: undefined,
  FormDrawer: undefined,

  /* Data display */
  TableSimple: undefined,
  List: undefined,
  Tree: undefined,
  JsonViewer: undefined,

  /* Layout */
  Card: undefined,
  Divider: undefined,
  Stack: undefined,
  HStack: undefined,
  VStack: undefined,

  /* Patterns / Pages */
  PageHeader: undefined,
  FilterBar: undefined,
  MasterDetail: undefined,
  PageLayout: undefined,
  SummaryStrip: undefined,
  EntitySummaryBlock: undefined,
  DetailSummary: undefined,
  ReportFilterPanel: undefined,

  /* Advanced components */
  EntityGrid: undefined,
  EntityGridTemplate: undefined,
  AgGridServer: undefined,
  TreeTable: undefined,

  /* Notification */
  NotificationDrawer: undefined,
  NotificationPanel: undefined,
  NotificationItemCard: undefined,

  /* Theme */
  ThemePreviewCard: undefined,
  ThemePresetCompare: undefined,
  ThemePresetGallery: undefined,

  /* Misc */
  AnchorToc: undefined,
  ConfidenceBadge: undefined,
  SearchFilterListing: undefined,
  DetailSectionTabs: undefined,
  SectionTabs: undefined,
  TourCoachmarks: undefined,
  RadioGroup: undefined,

  /* AI Components */
  PromptComposer: undefined,
  RecommendationCard: undefined,
  CitationPanel: undefined,
  ApprovalCheckpoint: undefined,
  ApprovalReview: undefined,
  AIGuidedAuthoring: undefined,
  AIActionAuditTimeline: undefined,

  /* Additional Pagination */
  TablePagination: undefined,
  MobileStepper: undefined,

  /* Templates / Layout */
  ActionBar: undefined,
  AppHeader: undefined,
  NavigationMenu: undefined,
  CommandHeader: undefined,
  ActionHeader: undefined,
  DesktopMenubar: undefined,

  /* MenuBar recipe aliases (doc names with spaces) */
  "Navigation Menu": undefined,
  "App Header": undefined,
  "Search / Command Header": undefined,
  "Action Header": undefined,
  "Action Bar": undefined,
  "Desktop Menubar": undefined,
  CommandWorkspace: undefined,
  CrudTemplate: undefined,
  DashboardTemplate: undefined,
  DetailTemplate: undefined,
  SettingsTemplate: undefined,
  "CRUD Template": undefined,
  "Dashboard Template": undefined,
  "Detail Template": undefined,
  "Settings Template": undefined,
  "Command Workspace": undefined,
  ToastProvider: undefined,

  /* ---- X-Charts ---- */
  ChartContainer: undefined,
  ScatterChart: undefined,
  RadarChart: undefined,
  TreemapChart: undefined,
  HeatmapChart: undefined,
  GaugeChart: undefined,
  WaterfallChart: undefined,
  SparklineChart: undefined,
  MiniChart: undefined,
  KPICard: undefined,
  ChartDashboard: undefined,
  StatWidget: undefined,
  ChartLegend: undefined,

  /* ---- X-Data-Grid ---- */
  DataGridFilterChips: undefined,
  DataGridSelectionBar: undefined,
  MasterDetailGrid: undefined,
  TreeDataGrid: undefined,
  PivotGrid: undefined,
  EditableGrid: undefined,
  RowGroupingGrid: undefined,

  /* ---- X-Scheduler ---- */
  Scheduler: undefined,
  SchedulerEvent: undefined,
  SchedulerToolbar: undefined,
  AgendaView: undefined,
  ResourceView: undefined,
  EventForm: undefined,

  /* ---- X-Kanban ---- */
  KanbanBoard: undefined,
  KanbanColumn: undefined,
  KanbanCard: undefined,
  KanbanToolbar: undefined,
  KanbanSwimlane: undefined,
  KanbanCardDetail: undefined,
  KanbanMetrics: undefined,

  /* ---- X-Editor ---- */
  RichTextEditor: undefined,
  EditorToolbar: undefined,
  EditorMenuBubble: undefined,
  SlashCommandMenu: undefined,
  MentionList: undefined,
  EditorTableMenu: undefined,
  EditorLinkDialog: undefined,
  EditorImageUpload: undefined,

  /* ---- X-FormBuilder ---- */
  FormRenderer: undefined,
  FieldRenderer: undefined,
  FormPreview: undefined,
  MultiStepForm: undefined,
  FormSummary: undefined,
  RepeatableFieldGroup: undefined,

  /* ---- Primitives (missing) ---- */
  Drawer: undefined,
  CardHeader: undefined,
  CardBody: undefined,
  CardFooter: undefined,
  Slot: undefined,

  /* ---- Components (missing) ---- */
  AppSidebar: undefined,
  ErrorBoundary: undefined,
  InputNumber: undefined,

  /* ---- Charts (missing) ---- */
  BarChart: undefined,
  LineChart: undefined,
  PieChart: undefined,
  AreaChart: undefined,

  /* ---- Generative UI (missing) ---- */
  AILayoutBuilder: undefined,
  AdaptiveForm: undefined,
  SmartDashboard: undefined,

  /* ---- Advanced Grid (missing) ---- */
  GridShell: undefined,
  GridToolbar: undefined,
  VariantIntegration: undefined,

  /* ---- X-FormBuilder (missing) ---- */
  FieldRegistry: undefined,

  /* ---- Enterprise (missing) ---- */
  AgingBuckets: undefined,
  ApprovalWorkflow: undefined,
  BulletChart: undefined,
  AuditLog: undefined,
  TenantSwitcher: undefined,
  OnboardingChecklist: undefined,
  PermissionMatrix: undefined,
  DataPipeline: undefined,
};
