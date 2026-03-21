import React, { useMemo, useCallback, useRef } from "react";
import * as MfeUiKit from "@mfe/design-system";
import { Text } from "@mfe/design-system";

/* ---- X Suite package imports for Design Lab live preview ---- */
let _xChartsExports: Record<string, unknown> = {};
let _xDataGridExports: Record<string, unknown> = {};
let _xEditorExports: Record<string, unknown> = {};
let _xFormBuilderExports: Record<string, unknown> = {};
let _xKanbanExports: Record<string, unknown> = {};
let _xSchedulerExports: Record<string, unknown> = {};

try { _xChartsExports = require("@mfe/x-charts"); } catch { /* optional */ }
try { _xDataGridExports = require("@mfe/x-data-grid"); } catch { /* optional */ }
try { _xEditorExports = require("@mfe/x-editor"); } catch { /* optional */ }
try { _xFormBuilderExports = require("@mfe/x-form-builder"); } catch { /* optional */ }
try { _xKanbanExports = require("@mfe/x-kanban"); } catch { /* optional */ }
try { _xSchedulerExports = require("@mfe/x-scheduler"); } catch { /* optional */ }

/* ---- Non-DOM props that should not be spread to native elements ---- */
/* These are custom props recognized by @mfe/design-system components    */
/* but cause React warnings when they leak to native DOM elements.       */
const NON_DOM_SAFE_PROPS = new Set([
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

function emitActionLog(entry: ActionLogEntry) {
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

type PlaygroundPreviewProps = {
  componentName: string;
  propValues: Record<string, string | boolean | number>;
  /** When true, renders without the outer border/panel wrapper — used for state demo cards */
  compact?: boolean;
};

/**
 * Component registry — maps component name to the actual React component.
 * We cast @mfe/design-system exports as a record so we can dynamically look up.
 */
const _rawRegistry = {
  ...(MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xChartsExports as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xDataGridExports as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xEditorExports as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xFormBuilderExports as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xKanbanExports as Record<string, React.ComponentType<Record<string, unknown>>>),
  ...(_xSchedulerExports as Record<string, React.ComponentType<Record<string, unknown>>>),
};

/**
 * Alias map — doc names that differ from the actual export name.
 * These are recipe/variant entries that reuse the same underlying component.
 */
const COMPONENT_ALIASES: Record<string, string> = {
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
type NonComponentType = "hook" | "utility" | "constant" | "theme-setter" | "theme-api" | "hoc" | "upcoming";

const NON_COMPONENT_ENTRIES: Record<string, NonComponentType> = {
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
  // Upcoming components (documented but not yet exported)
  MobileStepper: "upcoming",
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

const NON_COMPONENT_LABELS: Record<NonComponentType, { icon: string; label: string; description: string }> = {
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
function resolveComponentKey(name: string): string {
  if (COMPONENT_ALIASES[name]) return COMPONENT_ALIASES[name];
  // Try as-is, then PascalCase without spaces
  if (_rawRegistry[name]) return name;
  const noSpaces = name.replace(/\s+/g, "");
  if (_rawRegistry[noSpaces]) return noSpaces;
  return name;
}

const componentRegistry = new Proxy(_rawRegistry, {
  get(target, prop: string) {
    return target[resolveComponentKey(prop)];
  },
});

/**
 * Default children/content for components that need them.
 * `undefined` means the component uses props instead of children,
 * or is a compound component with complex children handled by DEFAULT_PROPS.
 */
const DEFAULT_CHILDREN: Record<string, React.ReactNode> = {
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
};

/**
 * Default props for components that need minimum props to render.
 * These are merged with playground prop overrides.
 */
const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  /* ---- Primitives ---- */
  Button: { variant: "primary", size: "md" },
  IconButton: { icon: React.createElement("span", { style: { fontSize: 16 } }, "✎"), label: "Duzenle", size: "md" },
  Text: { children: "Hizli kahverengi tilki tembel kopegin uzerinden atlar." },
  Badge: { children: "Yeni" },
  Tag: { children: "Etiket" },
  LinkInline: { children: "Baglanti metni", href: "#" },
  Avatar: { initials: "AY", size: "md" },
  Divider: {},

  /* ---- Form controls ---- */
  Input: { label: "Kullanici Adi", placeholder: "ornek: ahmet.yilmaz", size: "md", fullWidth: true, description: "Sisteme giris icin kullanilacak benzersiz kullanici adi.", helperText: "En az 3 karakter olmalidir." },
  TextInput: { label: "Kullanici Adi", placeholder: "ornek: ahmet.yilmaz", size: "md", fullWidth: true, description: "Sisteme giris icin kullanilacak benzersiz kullanici adi.", helperText: "En az 3 karakter olmalidir." },
  Textarea: { label: "Proje Aciklamasi", placeholder: "Projenizin amacini, hedef kitlesini ve temel ozelliklerini yaziniz...", rows: 4, description: "Detayli bir aciklama ekip uyelerinin projeyi anlamasina yardimci olur.", fullWidth: true },
  TextArea: { label: "Proje Aciklamasi", placeholder: "Projenizin amacini, hedef kitlesini ve temel ozelliklerini yaziniz...", rows: 4, description: "Detayli bir aciklama ekip uyelerinin projeyi anlamasina yardimci olur.", fullWidth: true },
  Select: {
    label: "Departman",
    description: "Calisanin bagli oldugu departmani secin.",
    options: [
      { value: "engineering", label: "Muhendislik" },
      { value: "design", label: "Tasarim" },
      { value: "product", label: "Urun Yonetimi" },
      { value: "marketing", label: "Pazarlama" },
      { value: "hr", label: "Insan Kaynaklari" },
      { value: "finance", label: "Finans" },
    ],
    placeholder: "Departman secin",
    selectSize: "md",
    fullWidth: true,
  },
  Checkbox: { label: "Kosullari kabul ediyorum", description: "Kullanim sartlarini okudum ve onayliyorum." },
  Radio: { label: "E-posta", description: "Onemli guncellemeler e-posta ile gonderilir", name: "bildirim", value: "email", defaultChecked: true },
  Switch: { label: "Bildirimleri etkinlestir", description: "Tum bildirim kanallarini acip kapatir." },
  SearchInput: { placeholder: "Ara..." },
  Slider: { label: "Ses Seviyesi", min: 0, max: 100, step: 1, defaultValue: 50, description: "Cihaz ses duzeyini ayarlayin.", minLabel: "Sessiz", maxLabel: "Maksimum" },
  DatePicker: { label: "Tarih", placeholder: "Tarih seciniz...", description: "Baslangic tarihi secin." },
  TimePicker: { label: "Saat", placeholder: "Saat seciniz...", description: "Baslangic saati secin." },
  Upload: { label: "Dosya yukle", description: "PDF veya gorsel yukleyebilirsiniz.", accept: ".pdf,.png,.jpg" },
  Combobox: {
    label: "Teknoloji Yigini",
    description: "Projede kullanilan ana teknolojileri secin.",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "nextjs", label: "Next.js" },
      { value: "nuxt", label: "Nuxt" },
      { value: "remix", label: "Remix" },
    ],
    placeholder: "Teknoloji ara...",
    fullWidth: true,
  },
  FormField: {
    label: "E-posta",
    help: "E-posta adresiniz asla paylasilmayacaktir.",
    required: true,
    children: React.createElement("input", {
      type: "email",
      placeholder: "siz@ornek.com",
      className: "w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm",
    }),
  },

  /* ---- Feedback ---- */
  Alert: { title: "Onemli bildirim", children: "Bu bir bilgilendirme uyari mesajidir.", variant: "info" },
  Tooltip: { text: "Ipucu icerigi", children: React.createElement("span", { className: "underline decoration-dotted cursor-help" }, "Uzerime gelin") },
  Spinner: { size: "md" },
  Skeleton: { width: 200, height: 20 },
  Empty: { description: "Gosterilecek veri bulunamadi" },
  EmptyState: { description: "Gosterilecek veri bulunamadi" },
  EmptyErrorLoading: { mode: "empty", title: "Durum tarifi", description: "Veri bulunamadi" },

  /* ---- Compound / Navigation ---- */
  Tabs: {
    items: [
      { key: "tab1", label: "Genel Bakis", children: React.createElement("div", { className: "p-3 text-sm" }, "Genel bakis icerigi") },
      { key: "tab2", label: "Detaylar", children: React.createElement("div", { className: "p-3 text-sm" }, "Detay icerigi") },
      { key: "tab3", label: "Ayarlar", children: React.createElement("div", { className: "p-3 text-sm" }, "Ayarlar icerigi") },
    ],
    defaultActiveKey: "tab1",
  },
  Steps: {
    items: [
      { title: "Hesap Olustur", description: "Temel bilgilerinizi girin", status: "completed" },
      { title: "Profil Detaylari", description: "Departman ve rol bilgilerini tamamlayin", status: "completed" },
      { title: "Yetkilendirme", description: "Erisim izinlerini yapilandirin", status: "current" },
      { title: "Dogrulama", description: "E-posta ve telefon dogrulamasi", status: "pending" },
      { title: "Tamamlandi", description: "Hesap aktif edilecek", status: "pending" },
    ],
    current: 2,
    direction: "horizontal",
    size: "md",
  },
  Breadcrumb: {
    items: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Urunler", href: "/products" },
      { label: "Detaylar" },
    ],
  },
  Pagination: { total: 100, current: 1, pageSize: 10, size: "md" },
  Accordion: {
    items: [
      { value: "sec1", title: "Design Lab nedir?", content: "Kapsamli bir bilesen vitrin ve dokumantasyon sistemidir." },
      { value: "sec2", title: "Nasil kullanilir?", content: "Bilesenlere gozatin, varyantlari kesfet ve kod parcaciklarini kopyalayin." },
      { value: "sec3", title: "Katki soglama", content: "Standart PR is akisi uzerinden yeni bilesenler gonderin." },
    ],
    selectionMode: "multiple",
    bordered: true,
  },
  Segmented: {
    items: [
      { value: "daily", label: "Gunluk" },
      { value: "weekly", label: "Haftalik" },
      { value: "monthly", label: "Aylik" },
    ],
    value: "weekly",
    size: "md",
  },
  NavigationRail: {
    items: [
      { value: "home", label: "Ana Sayfa" },
      { value: "search", label: "Arama" },
      { value: "settings", label: "Ayarlar" },
    ],
    value: "home",
    size: "md",
  },
  MenuBar: {
    items: [
      { key: "file", label: "Dosya" },
      { key: "edit", label: "Duzenle" },
      { key: "view", label: "Gorunum" },
    ],
  },

  /* ---- Data display ---- */
  Descriptions: {
    title: "Kullanici Bilgileri",
    items: [
      { key: "name", label: "Ad Soyad", value: "Ayse Demir" },
      { key: "email", label: "E-posta", value: "ayse@ornek.com" },
      { key: "role", label: "Rol", value: "Kidemli Muhendis" },
      { key: "dept", label: "Departman", value: "Platform Muhendisligi" },
      { key: "status", label: "Hesap Durumu", value: "Aktif", tone: "success" },
      { key: "lastLogin", label: "Son Giris", value: "18 Mart 2026, 09:42" },
      { key: "mfa", label: "Iki Faktorlu Dogrulama", value: "Etkin", tone: "success" },
      { key: "license", label: "Lisans", value: "Kurumsal", tone: "info" },
    ],
    columns: 2,
    bordered: true,
  },
  JsonViewer: {
    value: { ad: "Design Lab", surum: "1.0", bilesenSayisi: 137, durum: "aktif" },
    title: "Yapilandirma",
    defaultExpandedDepth: 1,
  },
  List: {
    items: [
      { id: "1", primary: "Sunucu Goc Plani", secondary: "AWS'den Azure'a gecis icin hazirlik dokumani", meta: "2 saat once", badge: "Acil", badgeTone: "error" },
      { id: "2", primary: "API Entegrasyon Rehberi", secondary: "Ucuncu parti servis entegrasyonu icin teknik kilavuz", meta: "Dun", badge: "Incelemede", badgeTone: "warning" },
      { id: "3", primary: "Performans Raporu Q1", secondary: "Ilk ceyrek sistem performans metrikleri ve analizi", meta: "3 gun once", badge: "Tamamlandi", badgeTone: "success" },
      { id: "4", primary: "Guvenlik Denetim Sonuclari", secondary: "Yillik guvenlik taramasi bulgulari ve aksiyon plani", meta: "1 hafta once", badge: "Yeni", badgeTone: "info" },
      { id: "5", primary: "Kullanici Geri Bildirimleri", secondary: "Sprint 14 sonrasi toplanan kullanici gorusleri ozeti", meta: "2 hafta once" },
    ],
  },

  /* ---- Layout ---- */
  Card: { children: React.createElement("div", { className: "p-4" }, "Kart icerigi") },
  Stack: { children: React.createElement(React.Fragment, null, React.createElement("div", null, "Oge 1"), React.createElement("div", null, "Oge 2")) },

  /* ---- Patterns / Page-level ---- */
  PageHeader: {
    title: "Kontrol Paneli",
    subtitle: "Verilerinize genel bakis",
    breadcrumbs: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Kontrol Paneli" },
    ],
  },
  FilterBar: {
    // P1-6: FilterBar requires children (filter controls), not a filters array
    children: React.createElement(React.Fragment, null,
      React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Ara...", readOnly: true }),
      React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
        React.createElement("option", null, "Durum: Tumu"),
        React.createElement("option", null, "Aktif"),
        React.createElement("option", null, "Pasif"),
      ),
    ),
    search: React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Filtreler"),
    activeCount: 1,
  },
  SummaryStrip: {
    items: [
      { label: "Toplam", value: "1.234" },
      { label: "Aktif", value: "890" },
      { label: "Beklemede", value: "344" },
    ],
  },
  EntitySummaryBlock: {
    title: "Varlik Ozeti",
    items: [
      { label: "Tur", value: "Belge" },
      { label: "Durum", value: "Yayinlandi" },
    ],
  },
  DetailSummary: {
    title: "Varlik Detay Ozeti",
    description: "Anahtar-deger detaylariyla birlestirilmis varlik gorunumu.",
    entity: {
      title: "Ayse Demir",
      subtitle: "Kidemli Muhendis",
      items: [
        { key: "dept", label: "Departman", value: "Muhendislik" },
        { key: "loc", label: "Konum", value: "Istanbul" },
      ],
    },
    summaryItems: [
      { label: "Projeler", value: "12" },
      { label: "Aktif", value: "3" },
    ],
    detailItems: [
      { key: "email", label: "E-posta", value: "ayse@ornek.com" },
      { key: "phone", label: "Telefon", value: "+90 555 123 4567" },
      { key: "start", label: "Baslangic Tarihi", value: "2022-03-15" },
    ],
  },

  /* ---- Overlays ---- */
  Modal: {
    open: false,
    title: "Ornek Modal",
    size: "md",
    keepMounted: true,
    disablePortal: true,
    children: React.createElement("div", { className: "p-4 text-sm" }, "Modal icerigi burada gorunur."),
    footer: React.createElement("div", { className: "flex justify-end gap-2" },
      React.createElement("button", { className: "rounded-lg bg-surface-muted px-3 py-1.5 text-xs" }, "Iptal"),
      React.createElement("button", { className: "rounded-lg bg-action-primary px-3 py-1.5 text-xs text-white" }, "Onayla"),
    ),
  },
  Dialog: {
    open: false,
    title: "Onay",
    keepMounted: true,
    disablePortal: true,
    children: React.createElement("div", { className: "p-4 text-sm" }, "Devam etmek istediginizden emin misiniz?"),
  },
  TourCoachmarks: {
    steps: [
      { id: "step-1", title: "Hos Geldiniz", description: "Rehberli turun ilk adimidir.", meta: "Adim 1 / 3", tone: "info" as const },
      { id: "step-2", title: "Ozellikleri Kesfet", description: "Bu bolumde mevcut temel ozellikleri ogrenin.", meta: "Adim 2 / 3", tone: "info" as const },
      { id: "step-3", title: "Tamamlandi", description: "Turu tamamladiniz. Ozellikleri kullanmaya baslayin!", meta: "Adim 3 / 3", tone: "success" as const },
    ],
    defaultOpen: true,
    allowSkip: true,
    showProgress: true,
    mode: "guided" as const,
  },

  /* ---- Notification ---- */
  NotificationItemCard: {
    item: {
      id: "notif-1",
      message: "Yeni mesaj alindi",
      description: "Sistemden yeni bir bildiriminiz var.",
      type: "info",
      priority: "normal",
      read: false,
      createdAt: Date.now() - 120000,
    },
  },

  /* ---- Advanced ---- */
  TreeTable: {
    nodes: [
      {
        key: "root-1",
        label: "Belgeler",
        description: "Proje dokumantasyonu",
        children: [
          { key: "child-1", label: "Mimari", description: "Sistem tasarim belgeleri", data: { type: "klasor", size: "2.4 MB", updated: "14 Mar" } },
          { key: "child-2", label: "API Referansi", description: "REST API dokumantasyonu", data: { type: "dosya", size: "840 KB", updated: "12 Mar" } },
          { key: "child-3", label: "Kullanim Kilavuzu", description: "Son kullanici rehberi", data: { type: "dosya", size: "1.1 MB", updated: "10 Mar" } },
        ],
        data: { type: "klasor", size: "4.3 MB", updated: "14 Mar" },
      },
      {
        key: "root-2",
        label: "Raporlar",
        description: "Performans ve denetim raporlari",
        children: [
          { key: "child-4", label: "Q1 Performans", description: "Ilk ceyrek sistem metrikleri", data: { type: "dosya", size: "520 KB", updated: "1 Mar" } },
          { key: "child-5", label: "Guvenlik Taramasi", description: "Yillik guvenlik denetim raporu", data: { type: "dosya", size: "1.8 MB", updated: "28 Sub" } },
        ],
        data: { type: "klasor", size: "2.3 MB", updated: "1 Mar" },
      },
      {
        key: "root-3",
        label: "Sablonlar",
        description: "Proje sablonlari ve sema dosyalari",
        data: { type: "klasor", size: "780 KB", updated: "5 Mar" },
      },
    ],
    columns: [
      { key: "type", label: "Tur", render: (node: Record<string, unknown>) => ((node as { data?: { type?: string } }).data?.type ?? "\u2014") },
      { key: "size", label: "Boyut", render: (node: Record<string, unknown>) => ((node as { data?: { size?: string } }).data?.size ?? "\u2014") },
      { key: "updated", label: "Guncelleme", render: (node: Record<string, unknown>) => ((node as { data?: { updated?: string } }).data?.updated ?? "\u2014") },
    ],
    defaultExpandedKeys: ["root-1"],
  },

  /* ---- Theme ---- */
  ThemePreviewCard: { themeName: "Varsayilan Tema", localeText: { titleText: "Baslik metni", secondaryText: "Ikincil metin" } },
  ThemePresetGallery: {
    presets: [
      { presetId: "light-default", label: "Acik Tema", appearance: "light", density: "comfortable", intent: "neutral", isHighContrast: false, isDefaultMode: true, themeMode: "light" },
      { presetId: "dark-default", label: "Koyu Tema", appearance: "dark", density: "comfortable", intent: "neutral", isHighContrast: false, isDefaultMode: false, themeMode: "dark" },
      { presetId: "compact-light", label: "Kompakt Acik", appearance: "light", density: "compact", intent: "neutral", isHighContrast: false, isDefaultMode: false, themeMode: "light" },
    ],
  },

  /* ---- Misc ---- */
  AnchorToc: {
    items: [
      { id: "intro", label: "Giris" },
      { id: "setup", label: "Kurulum" },
      { id: "usage", label: "Kullanim" },
    ],
  },
  ConfidenceBadge: { score: 0.85, label: "Yuksek" },
  RadioGroup: {
    label: "Secenek secin",
    options: [
      { value: "a", label: "Secenek A" },
      { value: "b", label: "Secenek B" },
      { value: "c", label: "Secenek C" },
    ],
    value: "a",
  },
  DetailSectionTabs: {
    tabs: [
      { key: "overview", label: "Genel Bakis" },
      { key: "details", label: "Detaylar" },
      { key: "history", label: "Gecmis" },
    ],
    activeTab: "overview",
  },

  /* ---- Overlay components ---- */
  Popover: {
    trigger: React.createElement("button", { className: "rounded-lg border border-border-subtle px-3 py-1.5 text-sm" }, "Popover Ac"),
    content: React.createElement("div", { className: "p-3 text-sm" }, "Popover icerigi burada gorunur."),
    defaultOpen: true,
  },
  Dropdown: {
    items: [
      { key: "edit", label: "Duzenle" },
      { key: "duplicate", label: "Cogalt" },
      { key: "delete", label: "Sil" },
    ],
    children: React.createElement("button", { className: "rounded-lg border border-border-subtle px-3 py-1.5 text-sm" }, "Islemler \u25BE"),
  },
  ContextMenu: {
    items: [
      { key: "cut", label: "Kes", shortcut: "\u2318X" },
      { key: "copy", label: "Kopyala", shortcut: "\u2318C" },
      { key: "paste", label: "Yapistir", shortcut: "\u2318V" },
    ],
    children: React.createElement("div", {
      className: "flex items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--text-secondary)] cursor-context-menu select-none",
    }, "Sag tiklayin — baglam menusu"),
  },
  CommandPalette: {
    open: false,
    title: "Komut Paleti",
    subtitle: "Rota, komut veya politika ipucu ile arayin.",
    placeholder: "Komut, rota, politika ara\u2026",
    emptyStateLabel: "Eslesen komut bulunamadi.",
    items: [
      { id: "search", title: "Ara", description: "Her seyi ara", group: "Genel", shortcut: "\u2318K" },
      { id: "settings", title: "Ayarlar", description: "Ayarlari ac", group: "Genel", shortcut: "\u2318," },
      { id: "theme", title: "Tema Degistir", description: "Acik/koyu tema gecisi", group: "Gorunum" },
      { id: "docs", title: "Dokumantasyon", description: "Rehber ve API referansi", group: "Genel" },
    ],
  },

  /* ---- Data display (additional) ---- */
  Tree: {
    nodes: [
      {
        key: "src",
        label: "src",
        children: [
          { key: "components", label: "components", children: [
            { key: "button", label: "Button.tsx", children: [] },
            { key: "input", label: "Input.tsx", children: [] },
          ]},
          { key: "utils", label: "utils", children: [
            { key: "helpers", label: "helpers.ts", children: [] },
          ]},
        ],
      },
    ],
    defaultExpandedKeys: ["src", "components"],
  },
  TableSimple: {
    columns: [
      { key: "name", label: "Ad Soyad", accessor: "name" as const },
      { key: "role", label: "Rol", accessor: "role" as const },
      { key: "status", label: "Durum", accessor: "status" as const },
    ],
    rows: [
      { name: "Ayse", role: "Yonetici", status: "Aktif" },
      { name: "Mehmet", role: "Duzenleyici", status: "Aktif" },
      { name: "Fatma", role: "Izleyici", status: "Pasif" },
    ],
    striped: true,
  },

  /* ---- Layout (additional) ---- */
  MasterDetail: {
    master: React.createElement("div", { className: "space-y-2 p-3" },
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm font-medium bg-action-primary/5" }, "Oge 1"),
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm" }, "Oge 2"),
      React.createElement("div", { className: "rounded-lg border border-border-subtle p-2 text-sm" }, "Oge 3"),
    ),
    detail: React.createElement("div", { className: "p-4" },
      React.createElement("div", { className: "text-sm font-semibold" }, "Oge 1 Detaylari"),
      React.createElement("div", { className: "mt-2 text-xs text-text-secondary" }, "Secilen ogenin detayli icerigi."),
    ),
    ratio: "1:2",
  },
  PageLayout: {
    title: "Sayfa Basligi",
    description: "Bu sayfanin aciklamasi.",
    children: React.createElement("div", { className: "p-4 text-sm" }, "Sayfa icerik alani"),
  },

  /* ---- Pagination/Stepper (additional) ---- */
  TablePagination: {
    totalItems: 100,
    pageSize: 10,
    page: 1,
    localeText: {
      rowsPerPageLabel: "Sayfa basina satir:",
      previousButtonLabel: "Onceki sayfa",
      nextButtonLabel: "Sonraki sayfa",
      firstButtonLabel: "Ilk sayfa",
      lastButtonLabel: "Son sayfa",
      rangeLabel: (start: number, end: number, total: number) => `${start}\u2013${end} / ${total}`,
    },
  },
  MobileStepper: { steps: 4, activeStep: 1, variant: "dots" },

  /* ---- AI components ---- */
  PromptComposer: {
    defaultValue: "Ceyreklik satis verilerini analiz edin ve trendleri belirleyin.",
    defaultScope: "general",
    defaultTone: "neutral",
    maxLength: 1200,
    guardrails: [
      "Kisisel veri korumasi",
      "Uyumluluk kontrolu",
      "On yargi tespiti",
    ],
    citations: [
      "Satis Analiz Rehberi v2.1",
      "Veri Guvenligi Politikasi",
    ],
  },
  RecommendationCard: {
    title: "Sorgu Performansini Optimize Et",
    summary: "Sorgu yurutme suresini ~%40 iyilestirmek icin 'created_at' sutununa indeks eklemeyi dusunun.",
    rationale: ["Sorgu tarama suresi esik degeri asiyor", "Sutun WHERE kosullarinda sikca kullaniliyor", "Benzer sorgularda indeks kullanimi %60 iyilesme sagliyor"],
    confidenceLevel: "high",
    citations: [
      "Veritabani Performans Rehberi — DBA El Kitabi v3.1",
      "Indeksleme Stratejileri — PostgreSQL Dokumantasyonu",
    ],
    primaryActionLabel: "Uygula",
    secondaryActionLabel: "Reddet",
  },
  CitationPanel: {
    title: "Alintilar",
    items: [
      { id: "cite-1", title: "Tasarim Ilkeleri", excerpt: "Bilesenler varsayilan olarak birlesitirilebilir ve erisilebilir olmalidir.", source: "Tasarim Sistemi Rehberi", kind: "doc" },
      { id: "cite-2", title: "API Standartlari", excerpt: "Tum prop'lar tutarli adlandirma kurallarina uymalidur.", source: "Muhendislik El Kitabi", kind: "doc" },
    ],
  },
  ApprovalCheckpoint: {
    title: "Yayin Onayi",
    summary: "Surum 2.4.0, muhendislik ve QA liderlerinin onayini gerektirmektedir.",
    status: "pending",
    checkpointLabel: "Onay kapisi",
    approverLabel: "Insan inceleme kurulu",
    dueLabel: "Yayindan once",
    primaryActionLabel: "Onayla",
    secondaryActionLabel: "Inceleme talep et",
    steps: [
      { key: "step-code-review", label: "Kod Incelemesi", owner: "Muhendislik", status: "approved" },
      { key: "step-qa-test", label: "QA Testi", owner: "QA Ekibi", status: "pending" },
      { key: "step-security-scan", label: "Guvenlik Taramasi", owner: "Guvenlik", status: "pending" },
    ],
  },
  ApprovalReview: {
    title: "Onay Karari",
    description: "Onay talebinin detaylarini inceleyin.",
    checkpoint: {
      title: "Onay Kapisi",
      summary: "Bu degisiklik yayin oncesi ekip onayi gerektirmektedir.",
      status: "pending",
    },
    citations: [
      { id: "cite-1", title: "Politika Belgesi", excerpt: "Tum yayinlar en az iki ekip uyesi tarafindan incelenmelidir.", source: "Yayin Politikasi v2.1", kind: "doc" as const },
      { id: "cite-2", title: "Uyumluluk Kaydi", excerpt: "Onceki yayin tum uyumluluk kontrollerini basariyla gecmistir.", source: "Denetim Izi", kind: "log" as const },
    ],
    auditItems: [
      { id: "audit-1", actor: "human" as const, title: "Talep Olusturuldu", timestamp: "2024-01-15 10:00", summary: "v2.3.1 surumu icin yayin onayi talep edildi" },
      { id: "audit-2", actor: "ai" as const, title: "Otomatik Inceleme", timestamp: "2024-01-15 10:05", summary: "Otomatik kontroller basariyla tamamlandi", status: "approved" as const },
    ],
  },
  AIGuidedAuthoring: {
    title: "AI Yazim Asistani",
    description: "AI rehberli is akislari icin oneriler ve prompt olustirma.",
    confidenceLabel: "MEVCUT GUVEN",
    recommendations: [
      { id: "rec-1", title: "Giris Bolumu Ekle", summary: "Belgenin basina okuyucuyu yonlendirecek bir giris paragrafi eklenmesi onerilir.", confidenceLevel: "high" },
      { id: "rec-2", title: "Teknik Terimler Sozlugu", summary: "Kullanilan teknik terimlerin aciklanmasi icin bir sozluk bolumu ekleyin.", confidenceLevel: "medium" },
      { id: "rec-3", title: "Gorsel Destek", summary: "Mimari diyagram veya akis semasi ile icerigi zenginlestirin.", confidenceLevel: "low" },
    ],
    commandItems: [
      { id: "cmd-1", title: "Ozetle", description: "Secili metni kisa ve oz olarak ozetler", group: "Duzenleme" },
      { id: "cmd-2", title: "Ton Degistir", description: "Metni resmi veya samimi tona donusturur", group: "Duzenleme" },
      { id: "cmd-3", title: "Cevir", description: "Metni Ingilizce veya Turkce'ye cevirir", group: "Araclar" },
    ],
  },
  AIActionAuditTimeline: {
    title: "Denetim zaman cizelgesi",
    items: [
      { id: "audit-1", title: "Olusturuldu", actor: "system" as const, timestamp: "2024-01-15 10:00", summary: "Talep sisteme kaydedildi" },
      { id: "audit-2", title: "Incelendi", actor: "human" as const, timestamp: "2024-01-15 11:30", summary: "Yonetici tarafindan incelendi", status: "observed" as const },
      { id: "audit-3", title: "Onaylandi", actor: "human" as const, timestamp: "2024-01-15 14:00", summary: "Mudur tarafindan onaylandi", status: "approved" as const },
    ],
  },

  /* ---- Search / Filter ---- */
  SearchFilterListing: {
    title: "Politika Envanteri",
    description: "Arama, filtre ve sonuc yuzeyini ayni recipe altinda toplar.",
    items: [
      React.createElement("div", { key: "r1", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_autonomy.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Governance · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg,#dcfce7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "Ready"),
      ),
      React.createElement("div", { key: "r2", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_secrets.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Security · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-warning-bg,#fef3c7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-warning,#d97706)]" }, "Review"),
      ),
      React.createElement("div", { key: "r3", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_ui_design_system.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "UI/UX · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg,#dcfce7)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "Ready"),
      ),
    ],
    summaryItems: [
      { key: "total", label: "Toplam", value: "24", note: "Kayitli politika", tone: "info" },
      { key: "active", label: "Aktif", value: "18", note: "Uygulanan kural", tone: "success" },
      { key: "review", label: "Inceleme", value: "6", note: "Bekleyen onay", tone: "warning" },
    ],
    emptyStateLabel: "Eslesen sonuc bulunamadi. Filtrelerinizi degistirmeyi deneyin.",
    listTitle: "Sonuclar",
    listDescription: "Filtreye uyan politika listesi.",
    totalCount: 24,
    activeFilters: [
      { key: "status", label: "Durum", value: "Aktif", onRemove: () => {} },
      { key: "owner", label: "Sahip", value: "Governance", onRemove: () => {} },
    ],
    onClearAllFilters: () => {},
    sortOptions: [
      { key: "name", label: "Ad" },
      { key: "date", label: "Tarih" },
      { key: "status", label: "Durum" },
    ],
    activeSort: { key: "date", direction: "desc" as const },
    onSortChange: () => {},
    loading: false,
    size: "default",
    selectable: false,
    selectedKeys: [],
    onSelectionChange: () => {},
    onReload: () => {},
    toolbar: React.createElement("button", {
      type: "button",
      className: "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted,#f1f5f9)]",
    }, React.createElement("svg", { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true" },
      React.createElement("path", { d: "M6 1.5V10.5M6 10.5L3 7.5M6 10.5L9 7.5", stroke: "currentColor", strokeWidth: "1.25", strokeLinecap: "round", strokeLinejoin: "round" }),
    ), "Disa Aktar"),
    "aria-label": "Politika arama sonuclari",
  },
  ReportFilterPanel: {
    submitLabel: "Filtrele",
    resetLabel: "Sifirla",
    children: React.createElement(React.Fragment, null,
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Tarih Araligi"),
        React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
          React.createElement("option", null, "Son 7 gun"),
          React.createElement("option", null, "Son 30 gun"),
          React.createElement("option", null, "Son 90 gun"),
        ),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Departman"),
        React.createElement("select", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm" },
          React.createElement("option", null, "Tumu"),
          React.createElement("option", null, "Muhendislik"),
          React.createElement("option", null, "Pazarlama"),
        ),
      ),
    ),
  },

  /* ---- Notification (additional) ---- */
  NotificationDrawer: {
    open: true,
    disablePortal: true,
    title: "Bildirimler",
    items: [
      { id: "notif-d1", message: "Yeni surum yayinlandi", description: "v2.4.0 uretim ortamina alindi.", type: "info" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 300000 },
      { id: "notif-d2", message: "Derleme tamamlandi", description: "CI/CD pipeline basariyla sonuclandi.", type: "success" as const, priority: "normal" as const, read: true, createdAt: Date.now() - 3600000 },
      { id: "notif-d3", message: "Disk kullanimi %90 uzerinde", description: "Sunucu depolama alani kritik seviyede.", type: "warning" as const, priority: "high" as const, read: false, createdAt: Date.now() - 7200000 },
    ],
  },
  NotificationPanel: {
    title: "Bildirimler",
    items: [
      { id: "notif-p1", message: "Yeni kullanici kaydi", description: "Ahmet Yilmaz sisteme eklendi.", type: "info" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 120000 },
      { id: "notif-p2", message: "Rapor hazirlandi", description: "Aylik performans raporu indirilmeye hazir.", type: "success" as const, priority: "normal" as const, read: false, createdAt: Date.now() - 600000 },
      { id: "notif-p3", message: "Guvenlik uyarisi", description: "Basarisiz giris denemesi tespit edildi.", type: "error" as const, priority: "high" as const, pinned: true, read: false, createdAt: Date.now() - 1800000 },
    ],
    showFilters: true,
  },

  /* ---- Template components ---- */
  ActionBar: {
    items: [
      { value: "export", label: "Disa Aktar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E4}") },
      { value: "archive", label: "Arsivle", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "delete", label: "Sil", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F5D1}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Toplu islem cubugu",
    startSlot: React.createElement("span", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "3 oge secildi"),
  },
  SectionTabs: {
    tabs: [
      { id: "general", label: "Genel", description: "Temel yapilandirma" },
      { id: "advanced", label: "Gelismis", description: "Gelismis ayarlar" },
      { id: "debug", label: "Hata Ayiklama", description: "Hata ayiklama secenekleri" },
    ],
    activeTabId: "general",
    onTabChange: () => {},
  },

  /* ---- Page template compositions (alias → PageLayout) ---- */
  "CRUD Template": {
    title: "Kullanici Yonetimi",
    description: "Organizasyondaki kullanicilar, roller ve izinleri yonetin.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Kullanicilar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Kullanici ara...", readOnly: true }),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Rol: Tumu"),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Durum: Aktif"),
        ),
        React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "+ Kullanici Ekle"),
      ),
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-primary)]" }, "1.248"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Kullanici"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-success,#16a34a)]" }, "1.102"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Aktif"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-warning,#d97706)]" }, "98"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Beklemede"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-secondary)]" }, "48"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Devre Disi"),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] overflow-hidden" },
        React.createElement("table", { className: "w-full text-sm" },
          React.createElement("thead", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]" },
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Ad Soyad"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Rol"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Durum"),
            ),
          ),
          React.createElement("tbody", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Ayse Demir"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "ayse@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Yonetici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-success,#16a34a)]" }), " Aktif"),
            ),
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Mehmet Kaya"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "mehmet@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Duzenleyici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-success,#16a34a)]" }), " Aktif"),
            ),
            React.createElement("tr", null,
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Fatma Celik"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "fatma@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Izleyici")),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "inline-block h-2 w-2 rounded-full bg-[var(--status-warning,#d97706)]" }), " Beklemede"),
            ),
          ),
        ),
      ),
    ),
  },
  "Dashboard Template": {
    title: "Operasyon Panosu",
    description: "Temel performans metrikleri ve sistem sagligi genel gorunumu.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Ana Sayfa", href: "#" },
      { label: "Pano" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Gelir"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "\u20BA1.24M"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u2191 %12.3 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Aktif Kullanici"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "8.432"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u2191 %5.7 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Calisma Suresi"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-success,#16a34a)]" }, "%99.97"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--text-secondary)]" }, "Son 30 gun"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Acik Talepler"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-warning,#d97706)]" }, "23"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-error,#dc2626)]" }, "\u2191 3 dunden beri"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Etkinlik"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "v2.4.1 dagitimi tamamlandi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "Yeni kullanici kayit artisi tespit edildi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "15 dk once"),
            ),
            React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
              React.createElement("span", null, "Veritabani yedeklemesi tamamlandi"),
              React.createElement("span", { className: "text-[var(--text-secondary)]" }, "1 saat once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Sistem Sagligi"),
          React.createElement("div", { className: "space-y-3" },
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "API Sunucusu"), React.createElement("span", { className: "text-[var(--status-success,#16a34a)]" }, "Saglikli")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-success,#16a34a)]", style: { width: "99%" } })),
            ),
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "Veritabani"), React.createElement("span", { className: "text-[var(--status-success,#16a34a)]" }, "Saglikli")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-success,#16a34a)]", style: { width: "95%" } })),
            ),
            React.createElement("div", null,
              React.createElement("div", { className: "flex justify-between text-xs mb-1" }, React.createElement("span", null, "CDN"), React.createElement("span", { className: "text-[var(--status-warning,#d97706)]" }, "Dusuk Performans")),
              React.createElement("div", { className: "h-2 rounded-full bg-[var(--surface-muted)]" }, React.createElement("div", { className: "h-2 rounded-full bg-[var(--status-warning,#d97706)]", style: { width: "78%" } })),
            ),
          ),
        ),
      ),
    ),
  },
  "Detail Template": {
    title: "Siparis #SIP-2024-1847",
    description: "Varlik ozeti ve meta verilerle siparis detay gorunumu.",
    breadcrumbItems: [
      { label: "Siparisler", href: "#" },
      { label: "#SIP-2024-1847" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "flex items-center justify-between mb-3" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-base font-semibold text-[var(--text-primary)]" }, "Acme Teknoloji A.S."),
            React.createElement("div", { className: "text-sm text-[var(--text-secondary)]" }, "Kurumsal Musteri \u2014 Istanbul, TR"),
          ),
          React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-3 py-1 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Teslim Edildi"),
        ),
        React.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Siparis Tarihi"), React.createElement("div", { className: "font-medium" }, "2024-03-15")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Tutar"), React.createElement("div", { className: "font-medium" }, "\u20BA45.200,00")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Odeme"), React.createElement("div", { className: "font-medium" }, "Havale/EFT")),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-3" }, "Kalemler"),
        React.createElement("div", { className: "space-y-2" },
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Kurumsal Lisans (Yillik)"),
            React.createElement("span", null, "1 x \u20BA35.000,00"),
          ),
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Premium Destek"),
            React.createElement("span", null, "1 x \u20BA10.200,00"),
          ),
        ),
      ),
    ),
    detail: React.createElement("div", { className: "space-y-3 p-3" },
      React.createElement("div", { className: "text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider" }, "Zaman Cizelgesi"),
      React.createElement("div", { className: "space-y-2" },
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 15"),
          React.createElement("span", null, "Siparis olusturuldu"),
        ),
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 16"),
          React.createElement("span", null, "Odeme alindi"),
        ),
        React.createElement("div", { className: "flex gap-2 text-xs" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Mar 17"),
          React.createElement("span", null, "Lisans aktiflestirildi"),
        ),
      ),
    ),
  },
  "Settings Template": {
    title: "Organizasyon Ayarlari",
    description: "Organizasyon tercihleri, guvenlik ve bildirim politikalarini yapilandirin.",
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Ayarlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex gap-4 border-b border-[var(--border-subtle)] pb-2 text-sm" },
        React.createElement("span", { className: "border-b-2 border-[var(--action-primary,#2563eb)] pb-2 font-medium text-[var(--action-primary,#2563eb)]" }, "Genel"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Guvenlik"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Bildirimler"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Entegrasyonlar"),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-4" }, "Organizasyon Profili"),
        React.createElement("div", { className: "space-y-3" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Organizasyon Adi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Acme Teknoloji A.S."),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Varsayilan Saat Dilimi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Europe/Istanbul (UTC+3)"),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Iki Faktorlu Dogrulama"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Tum yonetici kullanicilar icin zorunlu"),
            ),
            React.createElement("div", { className: "h-5 w-9 rounded-full bg-[var(--status-success,#16a34a)] relative" },
              React.createElement("div", { className: "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--surface-default,#fff)] shadow" }),
            ),
          ),
        ),
      ),
    ),
  },
  "Command Workspace": {
    title: "Komut Merkezi",
    description: "Birlesik calisma alanindan arama yapin, son calismalara gozatin ve islemleri yurutun.",
    pageWidth: "wide" as const,
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Calisma Alani", href: "#" },
      { label: "Komutlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "\u{1F50D}"),
          React.createElement("span", { className: "text-sm text-[var(--text-secondary)]" }, "Komut, varlik veya islem ara..."),
          React.createElement("span", { className: "ml-auto rounded border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]" }, "⌘K"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Calismalar"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--action-primary,#2563eb)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--action-primary,#2563eb)]" }, "SIPARIS"),
              React.createElement("span", { className: "font-medium" }, "#SIP-2024-1847"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-success,#16a34a)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "KULLANICI"),
              React.createElement("span", { className: "font-medium" }, "Ayse Demir"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "15 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-warning,#d97706)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-warning,#d97706)]" }, "TALEP"),
              React.createElement("span", { className: "font-medium" }, "TLP-5523 CDN gecikmesi"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "1 saat once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Hizli Islemler"),
          React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Yeni Rapor"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Kullanici Ekle"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Dagitim Yap"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Veri Aktar"),
          ),
        ),
      ),
    ),
  },

  /* ---- MenuBar recipe aliases (no-space keys) ---- */
  ActionHeader: {
    items: [
      { value: "save", label: "Kaydet", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4BE}") },
      { value: "discard", label: "Iptal", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{274C}") },
      { value: "publish", label: "Yayinla", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F680}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Islem basligi",
  },
  AppHeader: {
    items: [
      { value: "home", label: "Ana Sayfa", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3E0}") },
      { value: "projects", label: "Projeler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C1}") },
      { value: "team", label: "Ekip", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "settings", label: "Ayarlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2699}\u{FE0F}") },
    ],
    value: "home",
    size: "md" as const,
    appearance: "default" as const,
    ariaLabel: "Uygulama basligi",
    startSlot: React.createElement("span", { className: "text-sm font-bold text-[var(--text-primary)]" }, "MFE Platform"),
  },
  CommandHeader: {
    items: [
      { value: "search", label: "Ara", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F50D}") },
      { value: "filter", label: "Filtrele", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3AF}") },
      { value: "sort", label: "Sirala", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2195}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "outline" as const,
    enableSearchHandoff: true,
    searchPlaceholder: "Komut ara...",
    ariaLabel: "Komut basligi",
  },
  DesktopMenubar: {
    items: [
      { value: "file", label: "Dosya", menuItems: [
        { value: "new", label: "Yeni" },
        { value: "open", label: "Ac" },
        { value: "save", label: "Kaydet" },
      ] },
      { value: "edit", label: "Duzenle", menuItems: [
        { value: "undo", label: "Geri Al" },
        { value: "redo", label: "Yinele" },
        { value: "cut", label: "Kes" },
        { value: "copy", label: "Kopyala" },
      ] },
      { value: "view", label: "Gorunum", menuItems: [
        { value: "zoom-in", label: "Yakinlastir" },
        { value: "zoom-out", label: "Uzaklastir" },
        { value: "fullscreen", label: "Tam Ekran" },
      ] },
      { value: "help", label: "Yardim" },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    submenuTrigger: "hover" as const,
    ariaLabel: "Masaustu menu cubugu",
  },
  NavigationMenu: {
    items: [
      { value: "dashboard", label: "Kontrol Paneli", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4CA}") },
      { value: "orders", label: "Siparisler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}"), badge: React.createElement("span", { className: "rounded-full bg-[var(--status-error,#dc2626)] px-1.5 py-0.5 text-[10px] text-white" }, "3") },
      { value: "customers", label: "Musteriler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "products", label: "Urunler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "reports", label: "Raporlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C8}") },
    ],
    value: "dashboard",
    size: "md" as const,
    labelVisibility: "always" as const,
    ariaLabel: "Ana navigasyon menusu",
  },

  /* ---- Overlay components (missing entries) ---- */
  DetailDrawer: {
    open: true,
    title: "Siparis Detayi",
    subtitle: "#SIP-2024-0847",
    size: "lg" as const,
    disablePortal: true,
    onClose: () => {},
    sections: [
      {
        key: "overview",
        title: "Genel Bilgiler",
        content: React.createElement("div", { className: "space-y-2 text-sm" },
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Musteri"),
            React.createElement("span", { className: "font-medium" }, "Acme Teknoloji A.S."),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Tarih"),
            React.createElement("span", { className: "font-medium" }, "2024-03-15"),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Tutar"),
            React.createElement("span", { className: "font-medium" }, "\u20BA45.200,00"),
          ),
          React.createElement("div", { className: "flex justify-between" },
            React.createElement("span", { className: "text-[var(--text-secondary)]" }, "Durum"),
            React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-2 py-0.5 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Tamamlandi"),
          ),
        ),
      },
      {
        key: "items",
        title: "Kalemler",
        content: React.createElement("div", { className: "space-y-2" },
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Kurumsal Lisans (Yillik)"),
            React.createElement("span", null, "1 x ₺35.000,00"),
          ),
          React.createElement("div", { className: "flex items-center justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs" },
            React.createElement("span", { className: "font-medium" }, "Premium Destek"),
            React.createElement("span", null, "1 x ₺10.200,00"),
          ),
        ),
      },
    ],
    tags: React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-2 py-0.5 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Onaylandi"),
  },
  FormDrawer: {
    open: true,
    title: "Yeni Musteri Ekle",
    subtitle: "Musteri bilgilerini giriniz",
    size: "md" as const,
    placement: "right" as const,
    onClose: () => {},
    children: React.createElement("div", { className: "space-y-4 p-4" },
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Sirket Adi"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "ornek: Acme Teknoloji A.S.", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Yetkili Kisi"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "Ad Soyad", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "info@sirket.com", readOnly: true }),
      ),
      React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("label", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "Telefon"),
        React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm", placeholder: "+90 212 555 0000", readOnly: true }),
      ),
    ),
    footer: React.createElement("div", { className: "flex justify-end gap-2 p-4 border-t border-[var(--border-subtle)]" },
      React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-4 py-1.5 text-xs" }, "Iptal"),
      React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "Kaydet"),
    ),
  },

  /* ---- Advanced data grids ---- */
  EntityGridTemplate: {
    gridId: "demo-entity-grid",
    gridSchemaVersion: 1,
    columnDefs: [
      { field: "name", headerName: "Ad Soyad", flex: 1 },
      { field: "department", headerName: "Departman", flex: 1 },
      { field: "role", headerName: "Rol", width: 150 },
      { field: "status", headerName: "Durum", width: 120 },
    ],
    rowData: [
      { name: "Ayse Demir", department: "Muhendislik", role: "Kidemli Gelistirici", status: "Aktif" },
      { name: "Mehmet Kaya", department: "Tasarim", role: "UX Tasarimci", status: "Aktif" },
      { name: "Fatma Celik", department: "Urun", role: "Urun Yoneticisi", status: "Izinli" },
      { name: "Ali Yildiz", department: "Muhendislik", role: "DevOps Muhendisi", status: "Aktif" },
    ],
    total: 4,
    page: 1,
    pageSize: 10,
    messages: {
      quickFilterPlaceholder: "Hizli filtre...",
      quickFilterLabel: "Hizli Filtre",
      variantLabel: "Gorunum",
      densityToggleLabel: "Yogunluk",
      comfortableDensityLabel: "Rahat",
      compactDensityLabel: "Kompakt",
      densityResetLabel: "Sifirla",
      fullscreenTooltip: "Tam ekran",
      resetFiltersLabel: "Filtreleri sifirla",
      overlayLoadingLabel: "Yukleniyor...",
      overlayNoRowsLabel: "Kayit bulunamadi",
      pageSizeLabel: "Sayfa basina:",
      recordCountLabel: "kayit",
      firstPageLabel: "Ilk sayfa",
      previousPageLabel: "Onceki",
      nextPageLabel: "Sonraki",
      lastPageLabel: "Son sayfa",
    },
  },
  AgGridServer: {
    columnDefs: [
      { field: "orderId", headerName: "Siparis No", width: 140 },
      { field: "customer", headerName: "Musteri", flex: 1 },
      { field: "total", headerName: "Tutar", width: 120 },
      { field: "status", headerName: "Durum", width: 120 },
    ],
    getData: () => Promise.resolve({
      rows: [
        { orderId: "SIP-001", customer: "Acme A.S.", total: "₺12.500", status: "Tamamlandi" },
        { orderId: "SIP-002", customer: "Beta Ltd.", total: "₺8.750", status: "Beklemede" },
        { orderId: "SIP-003", customer: "Gamma Holding", total: "₺23.100", status: "Kargoda" },
      ],
      total: 3,
    }),
    height: 300,
  },

  /* ---- Theme ---- */
  ThemePresetCompare: {
    title: "Tema Karsilastirmasi",
    description: "Iki tema presetini eksen bazinda karsilastirin.",
    leftPreset: {
      presetId: "light-default",
      label: "Acik Tema",
      appearance: "light",
      density: "comfortable",
      intent: "neutral",
      isHighContrast: false,
      isDefaultMode: true,
      themeMode: "light",
    },
    rightPreset: {
      presetId: "dark-compact",
      label: "Koyu Kompakt",
      appearance: "dark",
      density: "compact",
      intent: "branded",
      isHighContrast: true,
      isDefaultMode: false,
      themeMode: "dark",
    },
    axes: ["appearance", "density", "intent", "contrast"],
  },

  /* ---- Toast ---- */
  ToastProvider: {
    position: "top-right" as const,
    duration: 4000,
    maxVisible: 3,
    children: React.createElement("div", { className: "space-y-3 p-4" },
      React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "Toast Provider Demo"),
      React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "ToastProvider uygulamayi sarar ve useToast hook'u ile bildirim gostermeyi saglar."),
      React.createElement("div", { className: "flex gap-2 mt-3" },
        React.createElement("div", { className: "rounded-lg border border-[var(--state-success-text)]/20 bg-[var(--surface-default)] px-3 py-2 text-xs" },
          React.createElement("span", { className: "font-medium text-[var(--state-success-text)]" }, "Basarili: "),
          "Kayit basariyla eklendi.",
        ),
        React.createElement("div", { className: "rounded-lg border border-[var(--state-info-text)]/20 bg-[var(--surface-default)] px-3 py-2 text-xs" },
          React.createElement("span", { className: "font-medium text-[var(--state-info-text)]" }, "Bilgi: "),
          "Yeni guncelleme mevcut.",
        ),
      ),
    ),
  },

  /* ---- Space-separated MenuBar alias keys (point to their PascalCase variants) ---- */
  "App Header": {
    items: [
      { value: "home", label: "Ana Sayfa", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3E0}") },
      { value: "projects", label: "Projeler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C1}") },
      { value: "team", label: "Ekip", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "settings", label: "Ayarlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2699}\u{FE0F}") },
    ],
    value: "home",
    size: "md" as const,
    appearance: "default" as const,
    ariaLabel: "Uygulama basligi",
    startSlot: React.createElement("span", { className: "text-sm font-bold text-[var(--text-primary)]" }, "MFE Platform"),
  },
  "Search / Command Header": {
    items: [
      { value: "search", label: "Ara", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F50D}") },
      { value: "filter", label: "Filtrele", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F3AF}") },
      { value: "sort", label: "Sirala", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{2195}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "outline" as const,
    enableSearchHandoff: true,
    searchPlaceholder: "Komut ara...",
    ariaLabel: "Komut basligi",
  },
  "Action Header": {
    items: [
      { value: "save", label: "Kaydet", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4BE}") },
      { value: "discard", label: "Iptal", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{274C}") },
      { value: "publish", label: "Yayinla", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F680}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Islem basligi",
  },
  "Action Bar": {
    items: [
      { value: "export", label: "Disa Aktar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E4}") },
      { value: "archive", label: "Arsivle", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "delete", label: "Sil", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F5D1}\u{FE0F}") },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    ariaLabel: "Toplu islem cubugu",
    startSlot: React.createElement("span", { className: "text-xs font-medium text-[var(--text-secondary)]" }, "3 oge secildi"),
  },
  "Navigation Menu": {
    items: [
      { value: "dashboard", label: "Kontrol Paneli", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4CA}") },
      { value: "orders", label: "Siparisler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}"), badge: React.createElement("span", { className: "rounded-full bg-[var(--status-error,#dc2626)] px-1.5 py-0.5 text-[10px] text-white" }, "3") },
      { value: "customers", label: "Musteriler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F465}") },
      { value: "products", label: "Urunler", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4E6}") },
      { value: "reports", label: "Raporlar", icon: React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4C8}") },
    ],
    value: "dashboard",
    size: "md" as const,
    labelVisibility: "always" as const,
    ariaLabel: "Ana navigasyon menusu",
  },
  "Desktop Menubar": {
    items: [
      { value: "file", label: "Dosya", menuItems: [
        { value: "new", label: "Yeni" },
        { value: "open", label: "Ac" },
        { value: "save", label: "Kaydet" },
      ] },
      { value: "edit", label: "Duzenle", menuItems: [
        { value: "undo", label: "Geri Al" },
        { value: "redo", label: "Yinele" },
        { value: "cut", label: "Kes" },
        { value: "copy", label: "Kopyala" },
      ] },
      { value: "view", label: "Gorunum", menuItems: [
        { value: "zoom-in", label: "Yakinlastir" },
        { value: "zoom-out", label: "Uzaklastir" },
        { value: "fullscreen", label: "Tam Ekran" },
      ] },
      { value: "help", label: "Yardim" },
    ],
    size: "sm" as const,
    appearance: "ghost" as const,
    submenuTrigger: "hover" as const,
    ariaLabel: "Masaustu menu cubugu",
  },

  /* ---- Non-space alias keys for templates (point to same PageLayout-based preview) ---- */
  CrudTemplate: {
    title: "Kullanici Yonetimi",
    description: "Organizasyondaki kullanicilar, roller ve izinleri yonetin.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Kullanicilar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement("input", { className: "rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm", placeholder: "Kullanici ara...", readOnly: true }),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Rol: Tumu"),
          React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs" }, "Durum: Aktif"),
        ),
        React.createElement("button", { className: "rounded-lg bg-[var(--action-primary,#2563eb)] px-4 py-1.5 text-xs font-medium text-white" }, "+ Kullanici Ekle"),
      ),
      React.createElement("div", { className: "grid grid-cols-3 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--text-primary)]" }, "248"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Kullanici"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-success,#16a34a)]" }, "210"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Aktif"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3 text-center" },
          React.createElement("div", { className: "text-xl font-bold text-[var(--status-warning,#d97706)]" }, "38"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Beklemede"),
        ),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] overflow-hidden" },
        React.createElement("table", { className: "w-full text-sm" },
          React.createElement("thead", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]" },
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Ad Soyad"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "E-posta"),
              React.createElement("th", { className: "px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]" }, "Rol"),
            ),
          ),
          React.createElement("tbody", null,
            React.createElement("tr", { className: "border-b border-[var(--border-subtle)]" },
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Ayse Demir"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "ayse@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Yonetici")),
            ),
            React.createElement("tr", null,
              React.createElement("td", { className: "px-4 py-2.5 font-medium" }, "Mehmet Kaya"),
              React.createElement("td", { className: "px-4 py-2.5 text-[var(--text-secondary)]" }, "mehmet@sirket.com"),
              React.createElement("td", { className: "px-4 py-2.5" }, React.createElement("span", { className: "rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs" }, "Duzenleyici")),
            ),
          ),
        ),
      ),
    ),
  },
  DashboardTemplate: {
    title: "Operasyon Panosu",
    description: "Temel performans metrikleri ve sistem sagligi genel gorunumu.",
    pageWidth: "wide" as const,
    breadcrumbItems: [
      { label: "Ana Sayfa", href: "#" },
      { label: "Pano" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "grid grid-cols-4 gap-3" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Gelir"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "₺1.24M"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u{2191} %12.3 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Aktif Kullanici"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--text-primary)]" }, "8.432"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-success,#16a34a)]" }, "\u{2191} %5.7 gecen aya gore"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Calisma Suresi"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-success,#16a34a)]" }, "%99.97"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--text-secondary)]" }, "Son 30 gun"),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]" }, "Acik Talepler"),
          React.createElement("div", { className: "mt-1 text-2xl font-bold text-[var(--status-warning,#d97706)]" }, "23"),
          React.createElement("div", { className: "mt-1 text-xs text-[var(--status-error,#dc2626)]" }, "\u{2191} 3 dunden beri"),
        ),
      ),
    ),
  },
  DetailTemplate: {
    title: "Siparis #SIP-2024-1847",
    description: "Siparis detay gorunumu.",
    breadcrumbItems: [
      { label: "Siparisler", href: "#" },
      { label: "#SIP-2024-1847" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "flex items-center justify-between mb-3" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-base font-semibold text-[var(--text-primary)]" }, "Acme Teknoloji A.S."),
            React.createElement("div", { className: "text-sm text-[var(--text-secondary)]" }, "Kurumsal Musteri — Istanbul, TR"),
          ),
          React.createElement("span", { className: "rounded-full bg-[var(--status-success,#16a34a)]/10 px-3 py-1 text-xs font-medium text-[var(--status-success,#16a34a)]" }, "Teslim Edildi"),
        ),
        React.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Siparis Tarihi"), React.createElement("div", { className: "font-medium" }, "2024-03-15")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Toplam Tutar"), React.createElement("div", { className: "font-medium" }, "₺45.200,00")),
          React.createElement("div", null, React.createElement("span", { className: "text-xs text-[var(--text-secondary)]" }, "Odeme"), React.createElement("div", { className: "font-medium" }, "Havale/EFT")),
        ),
      ),
    ),
  },
  SettingsTemplate: {
    title: "Organizasyon Ayarlari",
    description: "Organizasyon tercihleri, guvenlik ve bildirim politikalarini yapilandirin.",
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Yonetim", href: "#" },
      { label: "Ayarlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "flex gap-4 border-b border-[var(--border-subtle)] pb-2 text-sm" },
        React.createElement("span", { className: "border-b-2 border-[var(--action-primary,#2563eb)] pb-2 font-medium text-[var(--action-primary,#2563eb)]" }, "Genel"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Guvenlik"),
        React.createElement("span", { className: "pb-2 text-[var(--text-secondary)] cursor-pointer" }, "Bildirimler"),
      ),
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
        React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)] mb-4" }, "Organizasyon Profili"),
        React.createElement("div", { className: "space-y-3" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Organizasyon Adi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Acme Teknoloji A.S."),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
          React.createElement("div", { className: "border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("div", { className: "text-sm font-medium" }, "Varsayilan Saat Dilimi"),
              React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Europe/Istanbul (UTC+3)"),
            ),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-xs" }, "Duzenle"),
          ),
        ),
      ),
    ),
  },
  CommandWorkspace: {
    title: "Komut Merkezi",
    description: "Arama, son calismalara gozatin ve birlesik calisma alanindan islemleri yurutun.",
    pageWidth: "wide" as const,
    stickyHeader: true,
    breadcrumbItems: [
      { label: "Calisma Alani", href: "#" },
      { label: "Komutlar" },
    ],
    children: React.createElement("div", { className: "space-y-4" },
      React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-3" },
        React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2" },
          React.createElement("span", { className: "text-[var(--text-secondary)]" }, "\u{1F50D}"),
          React.createElement("span", { className: "text-sm text-[var(--text-secondary)]" }, "Komut, varlik veya islem ara..."),
          React.createElement("span", { className: "ml-auto rounded border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]" }, "\u{2318}K"),
        ),
      ),
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Son Calismalar"),
          React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--action-primary,#2563eb)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--action-primary,#2563eb)]" }, "SIPARIS"),
              React.createElement("span", { className: "font-medium" }, "#SIP-2024-1847"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "2 dk once"),
            ),
            React.createElement("div", { className: "flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs cursor-pointer" },
              React.createElement("span", { className: "rounded bg-[var(--status-success,#16a34a)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--status-success,#16a34a)]" }, "KULLANICI"),
              React.createElement("span", { className: "font-medium" }, "Ayse Demir"),
              React.createElement("span", { className: "ml-auto text-[var(--text-secondary)]" }, "15 dk once"),
            ),
          ),
        ),
        React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default,#fff)] p-4" },
          React.createElement("div", { className: "mb-3 text-sm font-semibold text-[var(--text-primary)]" }, "Hizli Islemler"),
          React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Yeni Rapor"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Kullanici Ekle"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Dagitim Yap"),
            React.createElement("button", { className: "rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-left hover:bg-[var(--surface-muted)]" }, "Veri Aktar"),
          ),
        ),
      ),
    ),
  },
};

/* ---- X-Charts default props ---- */
DEFAULT_PROPS.KPICard = { title: "Toplam Kullanici", value: "12,847", trend: { direction: "up", value: "+12.5%", positive: true } };
DEFAULT_PROPS.StatWidget = { label: "API Cagrilari", value: 45230, previousValue: 42100, format: "number" };
DEFAULT_PROPS.SparklineChart = { data: [10, 12, 8, 15, 13, 17, 20, 18, 22], type: "area" };
DEFAULT_PROPS.MiniChart = { data: [{ label: "Oca", value: 45 }, { label: "Sub", value: 52 }, { label: "Mar", value: 48 }], type: "bar" };
DEFAULT_PROPS.ChartContainer = { title: "Grafik Basligi", description: "Aciklama metni", height: 200, children: React.createElement("div", { className: "flex h-full items-center justify-center text-sm text-[var(--text-secondary)]" }, "Grafik icerigi burada gorunur") };
DEFAULT_PROPS.ChartLegend = { items: [{ label: "Web", color: "var(--action-primary,#3b82f6)", value: "45%" }, { label: "Mobile", color: "var(--state-success-text,#16a34a)", value: "30%" }, { label: "API", color: "var(--state-warning-text,#d97706)", value: "25%" }], direction: "horizontal" };
DEFAULT_PROPS.ChartDashboard = { columns: 3, gap: "md", children: React.createElement(React.Fragment, null, React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 1"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 2"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 3")) };
DEFAULT_PROPS.GaugeChart = { value: 72, min: 0, max: 100, label: "Performans" };
DEFAULT_PROPS.RadarChart = { data: [{ label: "Hiz", value: 80 }, { label: "Guvenilirlik", value: 90 }, { label: "Olceklenebilirlik", value: 70 }, { label: "Kullanilabilirlik", value: 85 }, { label: "Guvenlik", value: 75 }], categories: ["Hiz", "Guvenilirlik", "Olceklenebilirlik", "Kullanilabilirlik", "Guvenlik"] };

/* ---- X-Data-Grid default props ---- */
DEFAULT_PROPS.DataGridFilterChips = { filters: [{ id: "1", field: "status", label: "Durum", value: "Aktif" }, { id: "2", field: "role", label: "Rol", value: "Admin" }], onRemove: () => {}, onClearAll: () => {} };
DEFAULT_PROPS.DataGridSelectionBar = { selectedCount: 3, onClearSelection: () => {}, children: React.createElement("button", { className: "rounded bg-[var(--action-primary,#3b82f6)] px-3 py-1 text-xs text-white" }, "Toplu Sil") };

/* ---- X-Editor default props ---- */
DEFAULT_PROPS.RichTextEditor = { placeholder: "Icerik yazin...", minHeight: 200 };
DEFAULT_PROPS.SlashCommandMenu = { commands: [{ id: "h1", label: "Baslik 1", category: "Temel", execute: () => {} }, { id: "h2", label: "Baslik 2", category: "Temel", execute: () => {} }], isOpen: true, position: { top: 0, left: 0 }, selectedIndex: 0, onSelect: () => {}, onClose: () => {} };
DEFAULT_PROPS.MentionList = { items: [{ id: "1", label: "Ahmet Yilmaz" }, { id: "2", label: "Ayse Demir" }], isOpen: true, position: { top: 0, left: 0 }, selectedIndex: 0, onSelect: () => {}, onClose: () => {} };
DEFAULT_PROPS.EditorTableMenu = { onInsertTable: () => {}, onAddRowBefore: () => {}, onAddRowAfter: () => {}, onAddColBefore: () => {}, onAddColAfter: () => {}, onDeleteRow: () => {}, onDeleteCol: () => {}, onDeleteTable: () => {}, onMergeCells: () => {}, onSplitCell: () => {} };

/* ---- X-FormBuilder default props ---- */
DEFAULT_PROPS.FormRenderer = { schema: { id: "demo", title: "Kullanici Bilgileri", columns: 2, fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true, span: 1 }, { id: "email", type: "email", name: "email", label: "E-posta", required: true, span: 1 }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }, { label: "Kullanici", value: "user" }], span: 1 }], submitLabel: "Kaydet" }, onSubmit: () => {} };
DEFAULT_PROPS.FormPreview = { schema: { id: "preview", title: "Form Onizleme", fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad" }] } };

/* ---- X-Kanban default props ---- */
DEFAULT_PROPS.KanbanCard = { card: { id: "1", title: "Gorev Basligi", description: "Gorev aciklamasi", priority: "high", assignee: "AY", tags: ["bug", "urgent"] } };
DEFAULT_PROPS.KanbanToolbar = { searchValue: "", onSearchChange: () => {}, onAddColumn: () => {} };
DEFAULT_PROPS.KanbanMetrics = { columns: [{ id: "todo", title: "Yapilacak", policy: { wipLimit: 5 } }, { id: "doing", title: "Yapiliyor", policy: { wipLimit: 3 } }, { id: "done", title: "Tamamlandi" }], cards: [{ id: "1", columnId: "todo", title: "Gorev 1" }, { id: "2", columnId: "todo", title: "Gorev 2" }, { id: "3", columnId: "doing", title: "Gorev 3" }] };

/* ---- X-Scheduler default props ---- */
DEFAULT_PROPS.SchedulerToolbar = { view: "week", date: new Date(), onViewChange: () => {}, onDateChange: () => {} };
DEFAULT_PROPS.EventForm = { onSave: () => {}, onCancel: () => {} };

/** Check whether a component has playground default props configured. */
export function hasPlayground(componentName: string): boolean {
  return componentName in DEFAULT_PROPS;
}

export const PlaygroundPreview: React.FC<PlaygroundPreviewProps> = ({
  componentName,
  propValues,
  compact = false,
}) => {
  const Component = componentRegistry[componentName];
  const startTimeRef = useRef(0);

  const mergedProps = useMemo(() => {
    // Resolve alias: e.g. "Navigation Menu" → use MenuBar's DEFAULT_PROPS
    const resolvedKey = resolveComponentKey(componentName);
    const base = DEFAULT_PROPS[componentName] ?? DEFAULT_PROPS[resolvedKey] ?? {};
    const filtered: Record<string, unknown> = { ...base };

    // Apply playground prop values, filtering out empty strings but preserving 0 and false
    for (const [key, value] of Object.entries(propValues)) {
      if (value === "") continue;
      // Don't override array/object DEFAULT_PROPS with string values from variant axes
      // e.g. "recommendations: empty | populated" axis shouldn't override recommendations: []
      const baseValue = filtered[key];
      if (typeof value === "string" && baseValue != null && typeof baseValue === "object") {
        continue;
      }
      if (typeof value === "boolean" || typeof value === "number") {
        filtered[key] = value;
        continue;
      }
      filtered[key] = value;
    }

    // NON_DOM_SAFE_PROPS: These are handled by the component implementations.
    // If DOM warnings persist for specific props, the fix belongs in the component source.

    // Variant axis → prop mapping for recipe components whose axis names
    // collide with component props (e.g. "results", "filters", "summary").
    if (componentName === "SearchFilterListing") {
      const resultsAxis = propValues.results as string | undefined;
      const filtersAxis = propValues.filters as string | undefined;
      const summaryAxis = propValues.summary as string | undefined;
      const sizeAxis = propValues.size as string | undefined;

      // size axis → size prop
      if (sizeAxis === "compact") {
        filtered.size = "compact";
      } else {
        filtered.size = "default";
      }

      // results axis → items / results prop
      if (resultsAxis === "empty") {
        filtered.items = [];
        delete filtered.results;
      } else if (resultsAxis === "listed") {
        // keep DEFAULT_PROPS items + related listing props
        filtered.items = base.items;
        filtered.totalCount = base.totalCount;
        filtered.sortOptions = base.sortOptions;
        filtered.activeSort = base.activeSort;
        delete filtered.results;
      } else if (resultsAxis === "custom-surface") {
        filtered.results = React.createElement("div", { className: "flex flex-col items-center gap-3 py-8 text-center" },
          React.createElement("div", { className: "text-2xl" }, "\u{1F4CA}"),
          React.createElement("div", { className: "text-sm font-semibold text-[var(--text-primary)]" }, "Ozel sonuc yuzeyi"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "results prop ile tamamen ozellestirilebilir icerik."),
        );
        filtered.items = [];
      } else {
        delete filtered.results;
      }

      // filters axis → filters prop
      if (filtersAxis === "hidden") {
        filtered.filters = undefined;
      } else if (filtersAxis === "visible") {
        filtered.filters = React.createElement(React.Fragment, null,
          React.createElement((MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>).TextInput, { label: "Arama", value: "", size: "sm" }),
          React.createElement((MfeUiKit as unknown as Record<string, React.ComponentType<Record<string, unknown>>>).Select, {
            label: "Durum", selectSize: "sm", value: "all",
            options: [{ label: "Tumunu goster", value: "all" }, { label: "Aktif", value: "active" }, { label: "Incelemede", value: "review" }],
          }),
        );
        filtered.activeFilters = base.activeFilters;
        filtered.onClearAllFilters = base.onClearAllFilters;
      }

      // summary axis → summaryItems prop
      if (summaryAxis === "absent") {
        filtered.summaryItems = [];
      } else if (summaryAxis === "present") {
        filtered.summaryItems = base.summaryItems;
      }
    }

    // ApprovalReview variant axis mapping
    if (componentName === "ApprovalReview") {
      const layoutAxis = propValues.layout as string | undefined;
      const modeAxis = propValues.mode as string | undefined;
      const selectionAxis = propValues.selection as string | undefined;

      // layout axis → reorder checkpoint vs citations
      if (layoutAxis === "evidence-first") {
        filtered.title = "Kanit Oncelikli Inceleme";
        filtered.description = "Kaynaklar ve kanitlar onay kararindan once sunulur.";
        // Swap citations to have more items, showing evidence-focused view
        filtered.citations = [
          { id: "cite-1", title: "Guvenlik Raporu", excerpt: "Tum guvenlik testleri basariyla gecmistir.", source: "Otomatik Tarama v3.2", kind: "doc" as const },
          { id: "cite-2", title: "Performans Analizi", excerpt: "Ortalama yanit suresi %15 iyilesmistir.", source: "APM Raporu", kind: "log" as const },
          { id: "cite-3", title: "Kod Kapsamı", excerpt: "Birim test kapsamı %94 seviyesine ulasmistir.", source: "CI Pipeline", kind: "code" as const },
        ];
      } else {
        delete filtered.layout;
      }

      // mode axis → access control
      if (modeAxis === "readonly") {
        filtered.access = "readonly";
        filtered.title = "Salt Okunur Inceleme";
        filtered.description = "Bu onay tamamlanmis, yalnizca goruntuleme modundadir.";
        filtered.checkpoint = {
          ...(base.checkpoint as Record<string, unknown>),
          status: "approved",
          title: "Onaylandi",
          summary: "Bu degisiklik basariyla onaylanmis ve yayinlanmistir.",
        };
      } else {
        delete filtered.mode;
      }

      // selection axis → controlled citation selection
      if (selectionAxis === "controlled") {
        filtered.selectedCitationId = "cite-1";
        filtered.selectedAuditId = "audit-1";
      } else {
        delete filtered.selection;
      }
    }

    // ── Generic variant axis → prop resolution ──
    // Most axes map directly to props with matching names (e.g. density, size, variant).
    // This table handles exceptions where axis name ≠ prop name or value needs transformation.
    // Shape: ComponentName → { axisName → { axisValue → propsToSet } }
    // A null value for an axis entry means "just delete this axis key from filtered".
    const VARIANT_AXIS_OVERRIDES: Record<string, Record<string, Record<string, Record<string, unknown>> | null>> = {
      TableSimple: {
        surface: { striped: { striped: true }, flat: { striped: false } },
        header: { static: { stickyHeader: false }, sticky: { stickyHeader: true } },
        width: { intrinsic: { fullWidth: false }, "full-width": { fullWidth: true }, auto: { fullWidth: false }, full: { fullWidth: true } },
      },
      Accordion: {
        surface: { bordered: { bordered: true, ghost: false }, ghost: { ghost: true, bordered: false } },
        icon: { visible: { showArrow: true }, hidden: { showArrow: false } },
        "icon-position": { start: { expandIconPosition: "start" }, end: { expandIconPosition: "end" } },
        trigger: { header: { collapsible: "header" }, icon: { collapsible: "icon" }, disabled: { collapsible: "disabled" } },
        spacing: { default: { disableGutters: false }, "no-gutters": { disableGutters: true } },
      },
      Steps: {
        mode: { static: { interactive: false }, interactive: { interactive: true } },
      },
      Descriptions: {
        surface: { bordered: { bordered: true }, plain: { bordered: false } },
      },
      Divider: {
        label: { none: { label: undefined }, text: { label: "Bölüm" } },
        decorative: { true: { decorative: true }, false: { decorative: false } },
      },
      Skeleton: {
        animated: { true: { animated: true }, false: { animated: false } },
      },
      TourCoachmarks: {
        allowSkip: { true: { allowSkip: true }, false: { allowSkip: false } },
        showProgress: { true: { showProgress: true }, false: { showProgress: false } },
      },
      NavigationRail: {
        density: { sm: { size: "sm" }, md: { size: "md" } },
        layout: { regular: { compact: false }, compact: { compact: true } },
        alignment: { start: { align: "start" }, center: { align: "center" } },
        surface: { default: { appearance: "default" }, outline: { appearance: "outline" }, ghost: { appearance: "ghost" } },
        "label-visibility": { always: { labelVisibility: "always" }, active: { labelVisibility: "active" }, none: { labelVisibility: "none" } },
      },
      Segmented: {
        selection: { single: { selectionMode: "single" }, multiple: { selectionMode: "multiple" } },
        layout: { default: { fullWidth: false }, "full-width": { fullWidth: true } },
        surface: { default: { appearance: "default" }, outline: { appearance: "outline" }, ghost: { appearance: "ghost" } },
      },
      DetailSectionTabs: {
        sticky: { true: { sticky: true }, false: { sticky: false } },
        layout: null, // not a real prop, just delete
        description: null, // not a real prop, just delete
      },
      NotificationItemCard: {
        selectable: { on: { selectable: true }, off: { selectable: false } },
      },
      NotificationPanel: {
        selectable: { on: { selectable: true }, off: { selectable: false } },
        grouping: null, // complex config, delete raw axis
        dateGrouping: null,
        filters: null,
      },
      Combobox: {
        freeSolo: { on: { freeSolo: true }, off: { freeSolo: false } },
        popup: { inline: { disablePortal: true }, portal: { disablePortal: false } },
      },
      EmptyErrorLoading: {
        skeleton: { on: { showSkeleton: true }, off: { showSkeleton: false } },
        recovery: null, // complex config, delete raw axis
      },
      AnchorToc: {
        layout: { static: { sticky: false }, sticky: { sticky: true } },
      },
      ConfidenceBadge: {
        layout: { default: { compact: false }, compact: { compact: true } },
        level: { low: { level: "low", label: undefined, score: 0.25 }, medium: { level: "medium", label: undefined, score: 0.55 }, high: { level: "high", label: undefined, score: 0.85 }, "very-high": { level: "very-high", label: undefined, score: 0.97 } },
      },
      RecommendationCard: {
        layout: { default: { compact: false }, compact: { compact: true } },
      },
      CommandPalette: {
        state: { open: { open: true }, closed: { open: false } },
        layout: null, // complex, delete
      },
      DetailSummary: {
        summary: null, // complex (modifies summaryItems array), delete raw axis
        payload: null, // complex, delete
        header: null, // complex, delete
      },
      AgGridServer: {
        surface: null, // complex grid config, delete raw axis
        "data-flow": null,
        schema: null,
      },
      FilterBar: {
        surface: null, // complex config, delete raw axis
        actions: null,
      },
      FormDrawer: {
        footer: null, // complex config, delete raw axis
        surface: null,
      },
      EntitySummaryBlock: {
        surface: null, // complex config, delete raw axis
        identity: null,
        actions: null,
      },
      JsonViewer: {
        depth: null, // complex config, delete raw axis
        surface: null,
        "type badges": null,
      },
      NotificationDrawer: {
        visibility: { open: { open: true }, closed: { open: false } },
        dismiss: null,
        lifecycle: null,
        content: null,
        surface: null,
      },
      PageLayout: {
        surface: null, // complex config, delete raw axis
        header: null,
        footer: null,
      },
      ReportFilterPanel: {
        layout: null, // complex config, delete raw axis
        actions: null,
        surface: null,
      },
      /* ---- Form control primitives — map state axis to real props ---- */
      Switch: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          readonly: { access: "readonly", checked: true },
          disabled: { disabled: true },
        },
        mode: null, // conceptual, not a real prop
      },
      Checkbox: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          indeterminate: { indeterminate: true },
        },
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { access: "readonly" },
          disabled: { disabled: true },
        },
      },
      Radio: {
        state: {
          unchecked: { checked: false },
          checked: { checked: true },
          readonly: { access: "readonly", checked: true },
          disabled: { disabled: true },
          invalid: { error: true },
        },
        grouping: null, // conceptual, not a real prop
      },
      /* ---- Other form controls ---- */
      TextInput: {
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        slots: null, // conceptual
      },
      TextArea: {
        tone: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        resize: null, // CSS resize, not a preview-visible prop
      },
      Select: {
        access: {
          full: {},
          readonly: { readOnly: true },
          disabled: { disabled: true },
          hidden: { access: "hidden" },
        },
        placeholder: null, // not a visual override
        "selection-meta": null,
        "group-description": null,
      },
      Slider: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      DatePicker: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      TimePicker: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        range: null, // conceptual
      },
      Upload: {
        state: {
          default: {},
          invalid: { error: true },
          readonly: { readOnly: true },
          disabled: { disabled: true },
        },
        mode: null, // conceptual
      },
    };

    // Apply overrides
    const overrides = VARIANT_AXIS_OVERRIDES[componentName];
    if (overrides) {
      for (const [axisName, valueMap] of Object.entries(overrides)) {
        const axisValue = propValues[axisName] as string | undefined;
        if (valueMap === null) {
          // null entry → just delete the raw axis string from props
          delete filtered[axisName];
        } else if (axisValue && valueMap[axisValue]) {
          Object.assign(filtered, valueMap[axisValue]);
          delete filtered[axisName]; // Remove the raw axis string
        } else {
          delete filtered[axisName]; // Remove unknown axis values too
        }
      }
    }

    // Generic boolean string cleanup for axes that coincidentally match prop names
    // but pass string "true"/"false" instead of actual booleans.
    for (const [key, value] of Object.entries(filtered)) {
      if (value === "true") { filtered[key] = true; }
      else if (value === "false") { filtered[key] = false; }
    }

    return filtered;
  }, [componentName, propValues]);

  /* ---- Event interceptor: wrap function props to log to Actions Panel ---- */
  const interceptedProps = useMemo(() => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(mergedProps)) {
      if (typeof value === "function" && key.startsWith("on")) {
        // Wrap event handler to log it
        result[key] = (...args: unknown[]) => {
          emitActionLog({
            id: ++_logIdCounter,
            eventName: key,
            timestamp: Date.now(),
            payload: args.map(safeSerializeArg),
            componentName,
          });
          return (value as Function)(...args);
        };
      } else {
        result[key] = value;
      }
    }
    // Also intercept common events that might not have handlers set
    // Skip for compound/container components — they don't forward these to DOM elements
    const COMPOUND_COMPONENTS = new Set([
      "PageLayout", "Tabs", "Accordion", "Steps", "TreeTable",
      "EntityGridTemplate", "AgGridServer", "DetailDrawer", "FormDrawer",
      "NavigationRail", "DetailSectionTabs", "SearchFilterListing",
      "NotificationDrawer", "CitationPanel", "CommandPalette",
      "ApprovalReview", "AIGuidedAuthoring", "DetailSummary",
      "TourCoachmarks", "NotificationPanel", "ReportFilterPanel",
      "FilterBar", "PageHeader", "SummaryStrip", "EntitySummaryBlock",
      "AIActionAuditTimeline", "ApprovalCheckpoint", "PromptComposer",
      "RecommendationCard", "ConfidenceBadge", "ThemePresetCompare",
      "ThemePresetGallery",
    ]);
    if (!COMPOUND_COMPONENTS.has(componentName)) {
      const commonEvents = ["onClick", "onChange", "onFocus", "onBlur", "onMouseEnter", "onMouseLeave", "onKeyDown"];
      for (const evt of commonEvents) {
        if (!(evt in result)) {
          result[evt] = (...args: unknown[]) => {
            emitActionLog({
              id: ++_logIdCounter,
              eventName: evt,
              timestamp: Date.now(),
              payload: args.map(safeSerializeArg),
              componentName,
            });
          };
        }
      }
    }
    return result;
  }, [mergedProps, componentName]);

  const children = useMemo(() => {
    const resolvedKey = resolveComponentKey(componentName);
    // Explicitly defined children (may be undefined for compound/prop-driven components)
    if (componentName in DEFAULT_CHILDREN || resolvedKey in DEFAULT_CHILDREN) {
      return DEFAULT_CHILDREN[componentName] ?? DEFAULT_CHILDREN[resolvedKey];
    }
    // If DEFAULT_PROPS provides children, don't add extra
    if (DEFAULT_PROPS[componentName]?.children != null || DEFAULT_PROPS[resolvedKey]?.children != null) {
      return undefined;
    }
    // Unknown components — try "Content" as generic children
    return "Content";
  }, [componentName]);

  /* ---- Non-component fallback (hooks, utilities, constants, etc.) ---- */
  const nonComponentType = NON_COMPONENT_ENTRIES[componentName];
  if (nonComponentType) {
    const meta = NON_COMPONENT_LABELS[nonComponentType];
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-border-subtle bg-surface-panel p-6">
        <div className="text-center max-w-md">
          <div className="text-2xl mb-2">{meta.icon}</div>
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {componentName}
          </Text>
          <Text as="div" className="mt-0.5 text-xs font-medium text-action-primary">
            {meta.label}
          </Text>
          <Text variant="secondary" className="mt-2 text-xs leading-relaxed">
            {meta.description}
          </Text>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle bg-surface-canvas p-8">
        <div className="text-center">
          <Text as="div" className="text-sm font-medium text-text-primary">
            {componentName}
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            Component not found in registry. Live preview is available for
            exported @mfe/design-system components.
          </Text>
        </div>
      </div>
    );
  }

  // For controlled components that need internal state management
  const needsStatefulWrapper =
    componentName === "Pagination" ||
    componentName === "Tabs" ||
    componentName === "Segmented";

  // Compound components that need special rendering (e.g. Radio → RadioGroup wrapper)
  const isRadioCompound = componentName === "Radio";

  // Drawer / overlay components that use fixed positioning — contain them
  // inside a relative container so they don't cover the entire page.
  const isContainedOverlay =
    componentName === "DetailDrawer" ||
    componentName === "FormDrawer" ||
    componentName === "NotificationDrawer";

  const componentElement = isRadioCompound ? (
    <CompoundRadioPreview interceptedProps={interceptedProps} />
  ) : needsStatefulWrapper ? (
    <StatefulWrapper
      Component={Component}
      componentName={componentName}
      interceptedProps={interceptedProps}
    >
      {children}
    </StatefulWrapper>
  ) : children !== undefined ? (
    <Component {...interceptedProps}>
      {children}
    </Component>
  ) : (
    <Component {...interceptedProps} />
  );

  if (compact) {
    return (
      <ErrorBoundary componentName={componentName}>
        {componentElement}
      </ErrorBoundary>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-panel p-8">
      <div className="flex items-center justify-center">
        <ErrorBoundary componentName={componentName}>
          {isContainedOverlay ? (
            <div
              style={{ position: "relative", width: "100%", height: 420, overflow: "hidden", borderRadius: 16 }}
              className="border border-border-subtle bg-surface-canvas"
            >
              {componentElement}
            </div>
          ) : componentElement}
        </ErrorBoundary>
      </div>
    </div>
  );
};

/* ---- Stateful wrapper for controlled components ---- */

function StatefulWrapper({
  Component,
  componentName,
  interceptedProps,
  children,
}: {
  Component: React.ComponentType<Record<string, unknown>>;
  componentName: string;
  interceptedProps: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const [page, setPage] = React.useState((interceptedProps.current as number) ?? 1);
  const [activeKey, setActiveKey] = React.useState(
    (interceptedProps.activeKey as string) ?? (interceptedProps.value as string) ?? (interceptedProps.defaultActiveKey as string) ?? "",
  );

  const enhancedProps = React.useMemo(() => {
    const props = { ...interceptedProps };
    if (componentName === "Pagination") {
      props.current = page;
      const origOnChange = props.onChange as ((...args: unknown[]) => void) | undefined;
      props.onChange = (newPage: number) => {
        setPage(newPage);
        origOnChange?.(newPage);
      };
    }
    if (componentName === "Tabs") {
      props.activeKey = activeKey;
      const origOnChange = props.onChange as ((...args: unknown[]) => void) | undefined;
      props.onChange = (key: string) => {
        setActiveKey(key);
        origOnChange?.(key);
      };
    }
    if (componentName === "Segmented") {
      props.value = activeKey;
      const origOnChange = props.onValueChange as ((...args: unknown[]) => void) | undefined;
      props.onValueChange = (key: string) => {
        setActiveKey(key);
        origOnChange?.(key);
      };
    }
    return props;
  }, [interceptedProps, componentName, page, activeKey]);

  return children !== undefined ? (
    <Component {...enhancedProps}>
      {children}
    </Component>
  ) : (
    <Component {...enhancedProps} />
  );
}

/* ---- Safe argument serializer for action log ---- */

function safeSerializeArg(arg: unknown): unknown {
  if (arg === null || arg === undefined) return arg;
  if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") return arg;
  if (arg instanceof Event || (typeof arg === "object" && arg !== null && "nativeEvent" in (arg as Record<string, unknown>))) {
    // React SyntheticEvent — extract useful fields
    const evt = arg as Record<string, unknown>;
    return {
      type: evt.type,
      target: evt.target ? `<${(evt.target as HTMLElement).tagName?.toLowerCase?.() ?? "unknown"}>` : undefined,
      currentTarget: evt.currentTarget ? `<${(evt.currentTarget as HTMLElement).tagName?.toLowerCase?.() ?? "unknown"}>` : undefined,
      value: (evt.target as HTMLInputElement)?.value,
    };
  }
  try {
    // Attempt shallow serialization
    return JSON.parse(JSON.stringify(arg));
  } catch {
    return String(arg);
  }
}

/* ---- Error boundary for safe rendering ---- */

type ErrorBoundaryProps = {
  componentName: string;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error when component or props change
    if (prevProps.componentName !== this.props.componentName) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-state-error-bg bg-state-error-bg/10 px-4 py-3">
          <Text as="div" className="text-xs font-medium text-state-error-text">
            Preview error
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            {this.state.error?.message ?? "Unknown error rendering component."}
          </Text>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ---- Compound Radio Preview — renders RadioGroup with multiple options ---- */

function CompoundRadioPreview({ interceptedProps }: { interceptedProps: Record<string, unknown> }) {
  const RadioComp = (MfeUiKit as Record<string, React.ComponentType<Record<string, unknown>>>).Radio;
  const RadioGroupComp = (MfeUiKit as Record<string, React.ComponentType<Record<string, unknown>>>).RadioGroup;

  if (!RadioComp || !RadioGroupComp) {
    return <div>Radio bileşeni yüklenemedi</div>;
  }

  const size = interceptedProps.radioSize as string | undefined;
  const error = interceptedProps.error as boolean | undefined;
  const access = interceptedProps.access as string | undefined;

  return (
    <RadioGroupComp name="bildirim-tercihi" defaultValue="email" direction="vertical">
      <RadioComp value="email" label="E-posta" description="Onemli guncellemeler e-posta ile gonderilir" radioSize={size} error={error} access={access} />
      <RadioComp value="sms" label="SMS" description="Acil bildirimler SMS ile iletilir" radioSize={size} error={error} access={access} />
      <RadioComp value="push" label="Push Bildirimi" description="Tarayici bildirimleri ile anlik uyari" radioSize={size} error={error} access={access} />
    </RadioGroupComp>
  );
}
