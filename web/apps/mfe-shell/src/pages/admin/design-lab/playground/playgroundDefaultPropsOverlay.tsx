import React from "react";
import * as MfeUiKit from "@mfe/design-system";

/**
 * Default props part 2: Overlay, AI, Search/Filter, Notification components
 */
export const DEFAULT_PROPS_OVERLAY: Record<string, Record<string, unknown>> = {
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
    master: React.createElement("div", { className: "flex flex-col gap-2 p-3" },
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
  AvatarGroup: {
    items: [
      { key: "1", name: "Ahmet Yilmaz", src: "" },
      { key: "2", name: "Elif Demir", src: "" },
      { key: "3", name: "Can Ozturk", src: "" },
      { key: "4", name: "Zeynep Kaya", src: "" },
      { key: "5", name: "Murat Celik", src: "" },
    ],
    max: 4,
    size: "md",
    shape: "circle",
  },
  Timeline: {
    items: [
      { key: "1", title: "Proje basladi", description: "Ilk tasarim toplantisi yapildi", status: "completed" },
      { key: "2", title: "Gelistirme", description: "Sprint 1 tamamlandi", status: "completed" },
      { key: "3", title: "Test asamasi", description: "QA sureci devam ediyor", status: "active" },
      { key: "4", title: "Yayinlama", description: "Production deploy bekleniyor", status: "pending" },
    ],
  },

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
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg))] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success))]" }, "Ready"),
      ),
      React.createElement("div", { key: "r2", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_secrets.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "Security · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-warning-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--status-warning))]" }, "Review"),
      ),
      React.createElement("div", { key: "r3", className: "flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3" },
        React.createElement("div", null,
          React.createElement("div", { className: "text-sm font-medium text-[var(--text-primary)]" }, "policy_ui_design_system.v1"),
          React.createElement("div", { className: "text-xs text-[var(--text-secondary)]" }, "UI/UX · Aktif"),
        ),
        React.createElement("span", { className: "rounded-full bg-[var(--status-success-bg))] px-2 py-0.5 text-[10px] font-medium text-[var(--status-success))]" }, "Ready"),
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
      className: "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted))]",
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

};
