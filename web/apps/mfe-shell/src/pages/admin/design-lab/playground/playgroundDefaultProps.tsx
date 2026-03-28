import React from "react";
import * as MfeUiKit from "@mfe/design-system";

/**
 * Default props for components that need minimum props to render.
 * These are merged with playground prop overrides.
 * Part 1: Core components (primitives, form controls, feedback, navigation, data display, layout)
 */
export const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
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
    size: "md",
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
      React.createElement("button", { className: "rounded-lg bg-action-primary px-3 py-1.5 text-xs text-text-inverse" }, "Onayla"),
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
};
