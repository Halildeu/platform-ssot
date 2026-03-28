import React from "react";
import { DEFAULT_PROPS } from "./playgroundDefaultProps";


/* ---- X-Charts default props ---- */
DEFAULT_PROPS.KPICard = { title: "Toplam Kullanici", value: "12,847", trend: { direction: "up", value: "+12.5%", positive: true } };
DEFAULT_PROPS.StatWidget = { label: "API Cagrilari", value: 45230, previousValue: 42100, format: "number" };
DEFAULT_PROPS.SparklineChart = { data: [10, 12, 8, 15, 13, 17, 20, 18, 22], type: "area" };
DEFAULT_PROPS.MiniChart = { data: [{ label: "Oca", value: 45 }, { label: "Sub", value: 52 }, { label: "Mar", value: 48 }], type: "bar" };
DEFAULT_PROPS.ChartContainer = { title: "Grafik Basligi", description: "Aciklama metni", height: 200, children: React.createElement("div", { className: "flex h-full items-center justify-center text-sm text-[var(--text-secondary)]" }, "Grafik icerigi burada gorunur") };
DEFAULT_PROPS.ChartLegend = { items: [{ label: "Web", color: "var(--action-primary))", value: "45%" }, { label: "Mobile", color: "var(--state-success-text))", value: "30%" }, { label: "API", color: "var(--state-warning-text))", value: "25%" }], direction: "horizontal" };
DEFAULT_PROPS.ChartDashboard = { columns: 3, gap: "md", children: React.createElement(React.Fragment, null, React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 1"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 2"), React.createElement("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 text-sm" }, "Kart 3")) };
DEFAULT_PROPS.GaugeChart = { value: 72, min: 0, max: 100, label: "Performans" };
DEFAULT_PROPS.RadarChart = { data: [{ label: "Hiz", value: 80 }, { label: "Guvenilirlik", value: 90 }, { label: "Olceklenebilirlik", value: 70 }, { label: "Kullanilabilirlik", value: 85 }, { label: "Guvenlik", value: 75 }], categories: ["Hiz", "Guvenilirlik", "Olceklenebilirlik", "Kullanilabilirlik", "Guvenlik"] };

/* ---- X-Data-Grid default props ---- */
DEFAULT_PROPS.DataGridFilterChips = { filters: [{ id: "1", field: "status", label: "Durum", value: "Aktif" }, { id: "2", field: "role", label: "Rol", value: "Admin" }], onRemove: () => {}, onClearAll: () => {} };
DEFAULT_PROPS.DataGridSelectionBar = { selectedCount: 3, onClearSelection: () => {}, children: React.createElement("button", { className: "rounded-xs bg-[var(--action-primary))] px-3 py-1 text-xs text-text-inverse" }, "Toplu Sil") };

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

/* ---- X-Charts (AG Charts based — render with sample data) ---- */
DEFAULT_PROPS.ScatterChart = { data: [{ x: 10, y: 20 }, { x: 25, y: 35 }, { x: 40, y: 15 }, { x: 55, y: 50 }, { x: 70, y: 30 }], xKey: "x", yKey: "y", size: "md" };
DEFAULT_PROPS.TreemapChart = { data: [{ label: "Kategori A", value: 45 }, { label: "Kategori B", value: 30 }, { label: "Kategori C", value: 25 }], size: "md" };
DEFAULT_PROPS.HeatmapChart = { data: [{ x: "Pzt", y: "09:00", value: 5 }, { x: "Sal", y: "09:00", value: 8 }, { x: "Car", y: "09:00", value: 3 }, { x: "Pzt", y: "10:00", value: 7 }, { x: "Sal", y: "10:00", value: 2 }, { x: "Car", y: "10:00", value: 9 }], xKey: "x", yKey: "y", valueKey: "value", size: "md" };
DEFAULT_PROPS.WaterfallChart = { data: [{ label: "Baslangic", value: 100, type: "total" }, { label: "Satis", value: 50, type: "increase" }, { label: "Gider", value: -30, type: "decrease" }, { label: "Vergi", value: -10, type: "decrease" }, { label: "Toplam", value: 110, type: "total" }], size: "md" };

/* ---- X-Data-Grid (AG Grid recipe components) ---- */
DEFAULT_PROPS.MasterDetailGrid = { gridId: "demo-master", parentColumnDefs: [{ field: "name", headerName: "Ad" }, { field: "department", headerName: "Departman" }], detailColumnDefs: [{ field: "task", headerName: "Gorev" }, { field: "status", headerName: "Durum" }], parentData: [{ name: "Ahmet Yilmaz", department: "Muhendislik" }, { name: "Ayse Demir", department: "Tasarim" }], getDetailRows: () => [{ task: "Gorev 1", status: "Tamamlandi" }] };
DEFAULT_PROPS.TreeDataGrid = { gridId: "demo-tree", columnDefs: [{ field: "name", headerName: "Ad" }, { field: "size", headerName: "Boyut" }], data: [{ name: "Projeler", size: "—", path: ["Projeler"] }, { name: "Frontend", size: "12MB", path: ["Projeler", "Frontend"] }, { name: "Backend", size: "8MB", path: ["Projeler", "Backend"] }], getDataPath: (row: any) => row.path };
DEFAULT_PROPS.PivotGrid = { gridId: "demo-pivot", columnDefs: [{ field: "country", headerName: "Ulke" }, { field: "sport", headerName: "Spor" }, { field: "medals", headerName: "Madalya" }], data: [{ country: "Turkiye", sport: "Gures", medals: 5 }, { country: "Turkiye", sport: "Atletizm", medals: 3 }, { country: "Almanya", sport: "Gures", medals: 4 }] };
DEFAULT_PROPS.EditableGrid = { gridId: "demo-edit", columnDefs: [{ field: "name", headerName: "Ad", editable: true }, { field: "email", headerName: "E-posta", editable: true }, { field: "role", headerName: "Rol", editable: true }], data: [{ name: "Ahmet", email: "ahmet@ornek.com", role: "Admin" }, { name: "Ayse", email: "ayse@ornek.com", role: "Kullanici" }] };
DEFAULT_PROPS.RowGroupingGrid = { gridId: "demo-group", columnDefs: [{ field: "department", headerName: "Departman" }, { field: "name", headerName: "Ad" }, { field: "salary", headerName: "Maas" }], fetchRows: () => Promise.resolve({ rows: [], lastRow: 0 }), rowGroupCols: ["department"] };

/* ---- X-Scheduler (calendar components) ---- */
DEFAULT_PROPS.SchedulerToolbar = { view: "week", date: new Date(), onViewChange: () => {}, onDateChange: () => {} };
DEFAULT_PROPS.EventForm = { onSave: () => {}, onCancel: () => {} };
DEFAULT_PROPS.Scheduler = { events: [{ id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 30), color: "var(--action-primary)" }, { id: "2", title: "Ogle Yemegi", start: new Date(2025, 2, 21, 12, 0), end: new Date(2025, 2, 21, 13, 0), color: "var(--state-success-text)" }], view: "day", date: new Date(2025, 2, 21) };
DEFAULT_PROPS.SchedulerEvent = { event: { id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 30), color: "var(--action-primary)" } };
DEFAULT_PROPS.AgendaView = { events: [{ id: "1", title: "Sabah Toplantisi", start: new Date(2025, 2, 21, 9, 0), end: new Date(2025, 2, 21, 10, 0), color: "var(--action-primary)" }, { id: "2", title: "Sprint Planlama", start: new Date(2025, 2, 21, 14, 0), end: new Date(2025, 2, 21, 15, 30), color: "var(--action-primary)" }, { id: "3", title: "Kod Inceleme", start: new Date(2025, 2, 22, 11, 0), end: new Date(2025, 2, 22, 12, 0), color: "var(--state-success-text)" }], startDate: new Date(2025, 2, 21), endDate: new Date(2025, 2, 23) };
DEFAULT_PROPS.ResourceView = { events: [{ id: "1", title: "Toplanti", start: new Date(2025, 2, 21, 10, 0), end: new Date(2025, 2, 21, 11, 0), resourceId: "r1", color: "var(--action-primary)" }], resources: [{ id: "r1", name: "Toplanti Odasi A" }, { id: "r2", name: "Toplanti Odasi B" }], date: new Date(2025, 2, 21) };

/* ---- X-Kanban (board components) ---- */
DEFAULT_PROPS.KanbanBoard = { columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }, { id: "done", title: "Tamamlandi" }], cards: [{ id: "1", columnId: "todo", title: "API entegrasyonu", priority: "high", tags: ["backend"] }, { id: "2", columnId: "todo", title: "UI tasarimi", priority: "medium", tags: ["frontend"] }, { id: "3", columnId: "doing", title: "Test yazimi", priority: "low", tags: ["qa"] }, { id: "4", columnId: "done", title: "Dokumantasyon", priority: "low" }] };
DEFAULT_PROPS.KanbanColumn = { column: { id: "todo", title: "Yapilacak" }, cards: [{ id: "1", columnId: "todo", title: "API entegrasyonu", priority: "high" }, { id: "2", columnId: "todo", title: "UI tasarimi", priority: "medium" }] };
DEFAULT_PROPS.KanbanSwimlane = { swimlane: { id: "s1", title: "Sprint 42", color: "var(--action-primary)" }, columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }], cards: [{ id: "1", columnId: "todo", title: "Gorev 1", swimlaneId: "s1" }] };
DEFAULT_PROPS.KanbanCardDetail = { card: { id: "1", title: "API Entegrasyonu", description: "REST API endpoint'lerini entegre et", columnId: "doing", priority: "high", assignee: "AY", tags: ["backend", "api"], dueDate: "2025-04-01" }, columns: [{ id: "todo", title: "Yapilacak" }, { id: "doing", title: "Yapiliyor" }, { id: "done", title: "Tamamlandi" }], onUpdate: () => {}, onClose: () => {} };

/* ---- X-Editor (dialogs & sub-components) ---- */
DEFAULT_PROPS.EditorToolbar = { editorRef: { current: null } };
DEFAULT_PROPS.EditorMenuBubble = { editorRef: { current: null } };
DEFAULT_PROPS.EditorLinkDialog = { isOpen: true, initialUrl: "https://ornek.com", initialText: "Ornek Baglanti", onConfirm: () => {}, onClose: () => {} };
DEFAULT_PROPS.EditorImageUpload = { isOpen: true, onInsert: () => {}, onClose: () => {} };

/* ---- X-FormBuilder (advanced form components) ---- */
DEFAULT_PROPS.MultiStepForm = { schema: { id: "multi", title: "Kayit Formu", steps: [{ id: "s1", title: "Kisisel Bilgiler", fields: ["name", "email"] }, { id: "s2", title: "Hesap Bilgileri", fields: ["role"] }], fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true }, { id: "email", type: "email", name: "email", label: "E-posta", required: true }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }, { label: "Kullanici", value: "user" }] }], showProgress: true, allowStepNavigation: true } };
DEFAULT_PROPS.FormSummary = { schema: { id: "summary", fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad" }, { id: "email", type: "email", name: "email", label: "E-posta" }, { id: "role", type: "select", name: "role", label: "Rol", options: [{ label: "Admin", value: "admin" }] }] }, values: { name: "Ahmet Yilmaz", email: "ahmet@ornek.com", role: "admin" } };
DEFAULT_PROPS.RepeatableFieldGroup = { fields: [{ id: "item", type: "text", name: "item", label: "Kalem" }, { id: "qty", type: "number", name: "qty", label: "Miktar" }], values: [{ item: "Urun A", qty: 5 }, { item: "Urun B", qty: 3 }], onChange: () => {}, addLabel: "Satir Ekle" };
DEFAULT_PROPS.FieldRenderer = { field: { id: "demo", type: "text", name: "demo", label: "Ornek Alan", placeholder: "Deger girin..." }, value: "", onChange: () => {}, onBlur: () => {} };

/* ---- Primitives (missing) ---- */
DEFAULT_PROPS.Drawer = { open: false, title: "Ornek Cekmece", placement: "right", size: "md", keepMounted: true, disablePortal: true, onClose: () => {}, children: React.createElement("div", { className: "p-4 text-sm" }, "Cekmece icerigi burada gorunur.") };
DEFAULT_PROPS.HStack = { gap: "md", children: React.createElement(React.Fragment, null, React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 1"), React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 2"), React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 3")) };
DEFAULT_PROPS.VStack = { gap: "md", children: React.createElement(React.Fragment, null, React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 1"), React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 2"), React.createElement("div", { className: "rounded-lg border border-border-subtle px-3 py-2 text-sm" }, "Oge 3")) };
DEFAULT_PROPS.CardHeader = { children: React.createElement("div", { className: "text-sm font-semibold" }, "Kart Basligi") };
DEFAULT_PROPS.CardBody = { children: React.createElement("div", { className: "text-sm" }, "Kart govde icerigi burada yer alir.") };
DEFAULT_PROPS.CardFooter = { children: React.createElement("div", { className: "flex justify-end gap-2" }, React.createElement("button", { className: "rounded-lg border border-border-subtle px-3 py-1.5 text-xs" }, "Iptal"), React.createElement("button", { className: "rounded-lg bg-action-primary px-3 py-1.5 text-xs text-text-inverse" }, "Kaydet")) };
DEFAULT_PROPS.Slot = { children: React.createElement("div", { className: "rounded-lg border border-dashed border-border-subtle p-4 text-sm text-center text-text-secondary" }, "Slot icerigi — alt bilesenler burada birlestirilir") };

/* ---- Components (missing) ---- */
DEFAULT_PROPS.AppSidebar = { mode: "expanded", header: React.createElement("div", { className: "text-sm font-bold" }, "Uygulama"), children: React.createElement("div", { className: "flex flex-col gap-1 p-2 text-sm" }, React.createElement("div", { className: "rounded-lg px-3 py-2 bg-surface-muted font-medium" }, "Ana Sayfa"), React.createElement("div", { className: "rounded-lg px-3 py-2" }, "Projeler"), React.createElement("div", { className: "rounded-lg px-3 py-2" }, "Ayarlar")) };
DEFAULT_PROPS.ErrorBoundary = { fallback: React.createElement("div", { className: "rounded-lg border border-state-error-border bg-state-error-bg p-4 text-sm text-state-error-text" }, "Bir hata olustu. Lutfen sayfayi yenileyin."), children: React.createElement("div", { className: "p-4 text-sm" }, "Hata siniri tarafindan korunan icerik") };
DEFAULT_PROPS.InputNumber = { label: "Miktar", placeholder: "0", min: 0, max: 100, step: 1, description: "0 ile 100 arasinda bir deger girin." };

/* ---- Charts (missing) ---- */
DEFAULT_PROPS.BarChart = { data: [{ label: "Oca", value: 45 }, { label: "Sub", value: 52 }, { label: "Mar", value: 48 }, { label: "Nis", value: 61 }, { label: "May", value: 55 }], xKey: "label", yKey: "value", size: "md" };
DEFAULT_PROPS.LineChart = { data: [{ label: "Oca", value: 30 }, { label: "Sub", value: 45 }, { label: "Mar", value: 38 }, { label: "Nis", value: 52 }, { label: "May", value: 48 }], xKey: "label", yKey: "value", size: "md" };
DEFAULT_PROPS.PieChart = { data: [{ label: "Web", value: 45 }, { label: "Mobil", value: 30 }, { label: "API", value: 25 }], labelKey: "label", valueKey: "value", size: "md" };
DEFAULT_PROPS.AreaChart = { data: [{ label: "Oca", value: 20 }, { label: "Sub", value: 35 }, { label: "Mar", value: 28 }, { label: "Nis", value: 42 }, { label: "May", value: 38 }], xKey: "label", yKey: "value", size: "md" };

/* ---- Generative UI / Adaptive Interface (missing) ---- */
DEFAULT_PROPS.AILayoutBuilder = { blocks: [{ id: "b1", type: "metric", title: "Toplam Kullanici", value: "8.432" }, { id: "b2", type: "chart", title: "Haftalik Trend" }, { id: "b3", type: "table", title: "Son Islemler" }], intent: "dashboard", density: "comfortable" };
DEFAULT_PROPS.AdaptiveForm = { fields: [{ id: "name", type: "text", name: "name", label: "Ad Soyad", required: true }, { id: "email", type: "email", name: "email", label: "E-posta", required: true }, { id: "department", type: "select", name: "department", label: "Departman", options: [{ label: "Muhendislik", value: "eng" }, { label: "Tasarim", value: "design" }] }], layout: "vertical", size: "md" };
DEFAULT_PROPS.SmartDashboard = { widgets: [{ id: "w1", type: "metric", title: "Gelir", value: "1.24M", trend: { direction: "up", value: "+12.3%" } }, { id: "w2", type: "metric", title: "Kullanicilar", value: "8.432", trend: { direction: "up", value: "+5.7%" } }, { id: "w3", type: "chart", title: "Haftalik Trend", size: "lg" }], density: "comfortable" };

/* ---- Advanced Grid (missing) ---- */
DEFAULT_PROPS.GridShell = { columnDefs: [{ field: "name", headerName: "Ad" }, { field: "role", headerName: "Rol" }], rowData: [{ name: "Ayse", role: "Yonetici" }, { name: "Mehmet", role: "Gelistirici" }], height: 200 };
DEFAULT_PROPS.GridToolbar = { quickFilterPlaceholder: "Hizli filtre...", showDensityToggle: true, showFullscreen: true };
DEFAULT_PROPS.VariantIntegration = { gridId: "demo-variant", variants: [{ id: "default", label: "Varsayilan" }, { id: "compact", label: "Kompakt" }], activeVariant: "default" };

/* ---- X-Suite: FieldRegistry (missing DEFAULT_PROPS) ---- */
DEFAULT_PROPS.FieldRegistry = { fields: [{ id: "text", type: "text", label: "Metin Alani" }, { id: "number", type: "number", label: "Sayi Alani" }, { id: "select", type: "select", label: "Secim Alani" }] };

/* ---- Enterprise (missing) ---- */
DEFAULT_PROPS.AgingBuckets = { title: "Vade Analizi", buckets: [{ label: "0-30 gun", value: 45200, count: 12 }, { label: "31-60 gun", value: 23100, count: 8 }, { label: "61-90 gun", value: 12800, count: 5 }, { label: "90+ gun", value: 8400, count: 3 }] };
DEFAULT_PROPS.ApprovalWorkflow = { title: "Onay Is Akisi", steps: [{ id: "s1", label: "Talep", status: "completed", actor: "Ahmet Y." }, { id: "s2", label: "Yonetici Onayi", status: "completed", actor: "Elif D." }, { id: "s3", label: "Finans Onayi", status: "current", actor: "Mehmet K." }, { id: "s4", label: "CEO Onayi", status: "pending" }] };
DEFAULT_PROPS.BulletChart = { title: "Performans", value: 275, target: 300, max: 400, ranges: [{ value: 150, color: "var(--state-error-bg)" }, { value: 250, color: "var(--state-warning-bg)" }, { value: 400, color: "var(--state-success-bg))" }] };
DEFAULT_PROPS.AuditLog = { title: "Denetim Kayitlari", entries: [{ id: "1", action: "Kullanici olusturuldu", actor: "Sistem", timestamp: "2024-03-15 09:00", level: "info" }, { id: "2", action: "Rol degistirildi", actor: "Ahmet Y.", timestamp: "2024-03-15 10:30", level: "warning" }, { id: "3", action: "Erisim reddedildi", actor: "Bilinmeyen", timestamp: "2024-03-15 11:15", level: "error" }] };
DEFAULT_PROPS.TenantSwitcher = { tenants: [{ id: "t1", name: "Acme A.S.", active: true }, { id: "t2", name: "Beta Ltd." }, { id: "t3", name: "Gamma Holding" }] };
DEFAULT_PROPS.OnboardingChecklist = { title: "Baslangic Rehberi", items: [{ id: "1", label: "Hesap olustur", completed: true }, { id: "2", label: "Profil tamamla", completed: true }, { id: "3", label: "Ekip uyeleri ekle", completed: false }, { id: "4", label: "Ilk projeyi baslat", completed: false }] };
DEFAULT_PROPS.PermissionMatrix = { title: "Yetki Matrisi", roles: ["Admin", "Editor", "Viewer"], permissions: [{ label: "Okuma", values: [true, true, true] }, { label: "Yazma", values: [true, true, false] }, { label: "Silme", values: [true, false, false] }, { label: "Yonetim", values: [true, false, false] }] };
DEFAULT_PROPS.DataPipeline = { title: "Veri Hatti", stages: [{ id: "s1", label: "Veri Toplama", status: "completed", duration: "2.3s" }, { id: "s2", label: "Donusum", status: "completed", duration: "1.1s" }, { id: "s3", label: "Dogrulama", status: "running", duration: "..." }, { id: "s4", label: "Yukleme", status: "pending" }] };

/* ---- Inline preview stubs (batch 1 — primitives & form) ---- */
DEFAULT_PROPS.AutoComplete = { label: "Sehir", placeholder: "Sehir ara...", options: [{ value: "istanbul", label: "Istanbul" }, { value: "ankara", label: "Ankara" }, { value: "izmir", label: "Izmir" }], description: "Bir sehir secin." };
DEFAULT_PROPS.Calendar = { defaultDate: new Date(2025, 2, 21) };
DEFAULT_PROPS.Carousel = { items: [{ id: "1", content: React.createElement("div", { className: "flex h-40 items-center justify-center rounded-lg bg-surface-muted text-sm" }, "Slayt 1") }, { id: "2", content: React.createElement("div", { className: "flex h-40 items-center justify-center rounded-lg bg-surface-muted text-sm" }, "Slayt 2") }, { id: "3", content: React.createElement("div", { className: "flex h-40 items-center justify-center rounded-lg bg-surface-muted text-sm" }, "Slayt 3") }] };
DEFAULT_PROPS.Cascader = { label: "Kategori", placeholder: "Kategori secin...", options: [{ value: "elektronik", label: "Elektronik", children: [{ value: "telefon", label: "Telefon" }, { value: "bilgisayar", label: "Bilgisayar" }] }, { value: "giyim", label: "Giyim", children: [{ value: "erkek", label: "Erkek" }, { value: "kadin", label: "Kadin" }] }] };
DEFAULT_PROPS.ColorPicker = { label: "Renk", defaultValue: "var(--action-primary)", description: "Tema rengi secin." };
DEFAULT_PROPS.DateRangePicker = { label: "Tarih Araligi", startPlaceholder: "Baslangic", endPlaceholder: "Bitis", description: "Rapor tarih araligini secin." };
DEFAULT_PROPS.FileUploadZone = { label: "Dosya Yukle", accept: ".pdf,.png,.jpg,.xlsx", maxSize: 10485760, description: "Dosyalari surukleyip birakin veya secin. Maks 10MB." };
DEFAULT_PROPS.FloatButton = { icon: React.createElement("span", { style: { fontSize: 18 } }, "+"), label: "Ekle" };
DEFAULT_PROPS.InlineEdit = { value: "Duzenlenebilir metin", onSave: () => {}, onCancel: () => {} };
DEFAULT_PROPS.Mentions = { placeholder: "@kisi ile bahset...", options: [{ id: "1", label: "Ahmet Yilmaz" }, { id: "2", label: "Ayse Demir" }, { id: "3", label: "Mehmet Kaya" }] };
DEFAULT_PROPS.QRCode = { value: "https://ornek.com", size: 128 };
DEFAULT_PROPS.Rating = { label: "Degerlendirme", defaultValue: 3, max: 5, size: "md" };
DEFAULT_PROPS.Toast = { title: "Basarili", description: "Islem tamamlandi.", variant: "success", duration: 5000 };
DEFAULT_PROPS.Transfer = { sourceTitle: "Mevcut", targetTitle: "Secilen", dataSource: [{ key: "1", label: "React" }, { key: "2", label: "Vue" }, { key: "3", label: "Angular" }, { key: "4", label: "Svelte" }], targetKeys: ["1"] };
DEFAULT_PROPS.Watermark = { text: "TASLAK", children: React.createElement("div", { className: "h-32 rounded-lg border border-border-subtle p-4 text-sm" }, "Filigranli icerik alani") };

/* ---- Inline preview stubs (batch 2 — data viz / charts) ---- */
DEFAULT_PROPS.BoxPlot = { data: [{ label: "Q1", min: 10, q1: 25, median: 45, q3: 65, max: 90 }, { label: "Q2", min: 15, q1: 30, median: 50, q3: 70, max: 85 }], size: "md" };
DEFAULT_PROPS.ControlChart = { data: [{ x: 1, y: 50 }, { x: 2, y: 52 }, { x: 3, y: 48 }, { x: 4, y: 55 }, { x: 5, y: 47 }, { x: 6, y: 53 }], ucl: 58, lcl: 42, cl: 50, title: "Kontrol Grafigi" };
DEFAULT_PROPS.FunnelChart = { data: [{ label: "Ziyaret", value: 1000 }, { label: "Kayit", value: 600 }, { label: "Deneme", value: 350 }, { label: "Satin Alma", value: 120 }], size: "md" };
DEFAULT_PROPS.HeatmapCalendar = { data: [{ date: "2025-03-01", value: 3 }, { date: "2025-03-05", value: 8 }, { date: "2025-03-10", value: 5 }, { date: "2025-03-15", value: 12 }, { date: "2025-03-20", value: 7 }], startDate: "2025-03-01", endDate: "2025-03-31" };
DEFAULT_PROPS.HistogramChart = { data: [{ bin: "0-10", count: 5 }, { bin: "10-20", count: 12 }, { bin: "20-30", count: 18 }, { bin: "30-40", count: 8 }, { bin: "40-50", count: 3 }], size: "md" };
DEFAULT_PROPS.MicroChart = { data: [5, 8, 3, 12, 7, 10, 6], type: "sparkline", width: 80, height: 24 };
DEFAULT_PROPS.ParetoChart = { data: [{ label: "Hata A", value: 45 }, { label: "Hata B", value: 30 }, { label: "Hata C", value: 15 }, { label: "Hata D", value: 10 }], size: "md" };
DEFAULT_PROPS.SankeyDiagram = { nodes: [{ id: "a", label: "Kaynak A" }, { id: "b", label: "Kaynak B" }, { id: "c", label: "Hedef C" }, { id: "d", label: "Hedef D" }], links: [{ source: "a", target: "c", value: 30 }, { source: "a", target: "d", value: 20 }, { source: "b", target: "c", value: 15 }, { source: "b", target: "d", value: 35 }] };

/* ---- Inline preview stubs (batch 3 — enterprise / process) ---- */
DEFAULT_PROPS.ActivityFeed = { items: [{ id: "1", actor: "Ahmet Y.", action: "dosya yukledi", target: "rapor.pdf", timestamp: "5 dk once" }, { id: "2", actor: "Elif D.", action: "yorum ekledi", target: "Gorev #42", timestamp: "12 dk once" }, { id: "3", actor: "Sistem", action: "yedekleme tamamlandi", timestamp: "1 saat once" }] };
DEFAULT_PROPS.CommentThread = { comments: [{ id: "1", author: "Ahmet Yilmaz", content: "Bu degisiklik onaylanabilir.", timestamp: "10:30", avatar: "AY" }, { id: "2", author: "Elif Demir", content: "Katiliyorum, birlestirelim.", timestamp: "10:45", avatar: "ED" }] };
DEFAULT_PROPS.ComparisonTable = { columns: [{ key: "feature", label: "Ozellik" }, { key: "planA", label: "Baslangic" }, { key: "planB", label: "Profesyonel" }, { key: "planC", label: "Kurumsal" }], rows: [{ feature: "Kullanici", planA: "5", planB: "25", planC: "Sinirsiz" }, { feature: "Depolama", planA: "1 GB", planB: "10 GB", planC: "100 GB" }, { feature: "Destek", planA: "E-posta", planB: "Oncelikli", planC: "7/24" }] };
DEFAULT_PROPS.DataExportDialog = { open: false, title: "Veri Disa Aktar", formats: [{ id: "csv", label: "CSV" }, { id: "xlsx", label: "Excel" }, { id: "pdf", label: "PDF" }], onExport: () => {}, onClose: () => {}, keepMounted: true, disablePortal: true };
DEFAULT_PROPS.DecisionMatrix = { title: "Karar Matrisi", criteria: [{ id: "c1", label: "Maliyet", weight: 0.3 }, { id: "c2", label: "Kalite", weight: 0.4 }, { id: "c3", label: "Sure", weight: 0.3 }], alternatives: [{ id: "a1", label: "Secenek A", scores: { c1: 8, c2: 7, c3: 9 } }, { id: "a2", label: "Secenek B", scores: { c1: 6, c2: 9, c3: 7 } }] };
DEFAULT_PROPS.EmptyStateBuilder = { icon: React.createElement("span", { style: { fontSize: 32 } }, "\u{1F4E6}"), title: "Henuz icerik yok", description: "Baslangic icin yeni bir oge olusturun.", actionLabel: "Olustur", onAction: () => {} };
DEFAULT_PROPS.ExecutiveKPIStrip = { kpis: [{ id: "1", label: "Gelir", value: "2.4M", trend: "+12%", status: "success" }, { id: "2", label: "Maliyet", value: "890K", trend: "-3%", status: "success" }, { id: "3", label: "Kar Marji", value: "%28", trend: "+2%", status: "info" }] };
DEFAULT_PROPS.FilterPresets = { presets: [{ id: "1", label: "Aktif Kayitlar", filters: { status: "active" } }, { id: "2", label: "Son 30 Gun", filters: { period: "30d" } }, { id: "3", label: "Yuksek Oncelik", filters: { priority: "high" } }], activePresetId: "1" };
DEFAULT_PROPS.FineKinney = { title: "Fine-Kinney Risk Degerlendirmesi", risks: [{ id: "1", hazard: "Elektrik carpmasi", probability: 6, frequency: 3, severity: 15, score: 270 }, { id: "2", hazard: "Dusme", probability: 3, frequency: 6, severity: 7, score: 126 }, { id: "3", hazard: "Kimyasal maruz kalma", probability: 2, frequency: 2, severity: 40, score: 160 }] };
DEFAULT_PROPS.FlowBuilder = { nodes: [{ id: "1", type: "start", label: "Baslangic", x: 50, y: 50 }, { id: "2", type: "process", label: "Islem", x: 200, y: 50 }, { id: "3", type: "end", label: "Bitis", x: 350, y: 50 }], edges: [{ from: "1", to: "2" }, { from: "2", to: "3" }] };
DEFAULT_PROPS.GanttTimeline = { tasks: [{ id: "1", title: "Tasarim", start: "2025-03-01", end: "2025-03-10", progress: 100 }, { id: "2", title: "Gelistirme", start: "2025-03-08", end: "2025-03-25", progress: 60 }, { id: "3", title: "Test", start: "2025-03-20", end: "2025-03-30", progress: 10 }] };
DEFAULT_PROPS.GovernanceBoard = { title: "Yonetisim Panosu", items: [{ id: "1", label: "Veri Gizliligi", status: "compliant", owner: "Guvenlik Ekibi" }, { id: "2", label: "Erisim Kontrolu", status: "warning", owner: "IT Ekibi" }, { id: "3", label: "Denetim Kayitlari", status: "compliant", owner: "Uyumluluk" }] };
DEFAULT_PROPS.MetricComparisonCard = { title: "Performans Karsilastirmasi", current: { label: "Bu Ay", value: 8420 }, previous: { label: "Gecen Ay", value: 7350 }, unit: "islem", trend: "up" };
DEFAULT_PROPS.NotificationCenter = { notifications: [{ id: "1", title: "Yeni mesaj", description: "Ahmet sizden bahsetti", read: false, timestamp: "5 dk once" }, { id: "2", title: "Gorev tamamlandi", description: "Sprint gorev #42 kapatildi", read: true, timestamp: "1 saat once" }], unreadCount: 1 };
DEFAULT_PROPS.OrgChart = { nodes: [{ id: "1", label: "CEO", title: "Genel Mudur" }, { id: "2", label: "CTO", title: "Teknoloji Muduru", parentId: "1" }, { id: "3", label: "CFO", title: "Finans Muduru", parentId: "1" }, { id: "4", label: "Muhendislik", title: "Ekip Lideri", parentId: "2" }] };
DEFAULT_PROPS.PivotTable = { data: [{ bolge: "Marmara", urun: "A", satis: 120 }, { bolge: "Marmara", urun: "B", satis: 80 }, { bolge: "Ege", urun: "A", satis: 95 }, { bolge: "Ege", urun: "B", satis: 110 }], rows: ["bolge"], columns: ["urun"], values: ["satis"] };
DEFAULT_PROPS.ProcessFlow = { steps: [{ id: "1", label: "Siparis", status: "completed" }, { id: "2", label: "Odeme", status: "completed" }, { id: "3", label: "Hazirlama", status: "active" }, { id: "4", label: "Kargo", status: "pending" }, { id: "5", label: "Teslim", status: "pending" }] };
DEFAULT_PROPS.RiskMatrix = { title: "Risk Matrisi", risks: [{ id: "1", label: "Veri Kaybi", likelihood: 2, impact: 5 }, { id: "2", label: "Sistem Cokme", likelihood: 3, impact: 4 }, { id: "3", label: "Gecikme", likelihood: 4, impact: 2 }], likelihoodLabels: ["Cok Dusuk", "Dusuk", "Orta", "Yuksek", "Cok Yuksek"], impactLabels: ["Onemsiz", "Dusuk", "Orta", "Yuksek", "Kritik"] };
DEFAULT_PROPS.SWOTMatrix = { title: "SWOT Analizi", strengths: ["Guclu muhendislik ekibi", "Modern teknoloji yigini"], weaknesses: ["Sinirli pazarlama butcesi", "Kucuk musteri tabani"], opportunities: ["Buyuyen pazar", "Yeni ortakliklar"], threats: ["Rekabet artisi", "Regulator degisiklikler"] };
DEFAULT_PROPS.StatusTimeline = { items: [{ id: "1", label: "Siparis alindi", timestamp: "09:00", status: "completed" }, { id: "2", label: "Isleniyor", timestamp: "09:15", status: "completed" }, { id: "3", label: "Kargoya verildi", timestamp: "11:30", status: "active" }, { id: "4", label: "Teslim edildi", status: "pending" }] };
DEFAULT_PROPS.ThemeLayout = { mode: "light", children: React.createElement("div", { className: "rounded-lg border border-border-subtle p-4 text-sm" }, "Tema duzeni icerik alani") };
DEFAULT_PROPS.TrainingTracker = { title: "Egitim Takibi", modules: [{ id: "1", title: "Giris Egitimi", progress: 100, status: "completed" }, { id: "2", title: "Guvenlik Egitimi", progress: 60, status: "in_progress" }, { id: "3", title: "Ileri Duzey", progress: 0, status: "not_started" }] };
DEFAULT_PROPS.ValueStream = { title: "Deger Akisi", stages: [{ id: "1", label: "Fikir", leadTime: "2 gun", processTime: "4 saat" }, { id: "2", label: "Gelistirme", leadTime: "5 gun", processTime: "3 gun" }, { id: "3", label: "Test", leadTime: "2 gun", processTime: "1 gun" }, { id: "4", label: "Yayin", leadTime: "1 gun", processTime: "2 saat" }] };
