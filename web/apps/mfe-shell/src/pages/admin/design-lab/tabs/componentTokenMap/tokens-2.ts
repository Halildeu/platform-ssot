import type { TokenEntry } from "./types";

export const tokenMap2: Record<string, TokenEntry[]> = {
  TreeTable: [
    // Colors
    { name: "treetable-surface-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Tablo yüzey arka plan rengi" },
    { name: "treetable-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Tablo başlık satırı arka plan rengi" },
    { name: "treetable-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Tablo ve hücre kenarlık rengi" },
    { name: "treetable-node-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Düğüm etiket metin rengi" },
    { name: "treetable-selected-ring", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border)/60", tier: "alias", category: "color", description: "Seçili satır halka rengi (%60 opasite)" },
    // Spacing
    { name: "treetable-cell-padding-comfortable", cssVar: "--spacing-3.5", resolvedValue: "14px", tier: "global", category: "spacing", description: "Rahat yoğunluk hücre iç boşluk (px-4 py-3.5)" },
    { name: "treetable-cell-padding-compact", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Sıkı yoğunluk hücre iç boşluk (px-4 py-2.5)" },
    { name: "treetable-indent-step", cssVar: "--spacing-4.5", resolvedValue: "18px", tier: "component", category: "spacing", description: "Her derinlik seviyesi girinti miktarı (18px)" },
    // Typography
    { name: "treetable-header-font-size", cssVar: "--font-size-3xs", resolvedValue: "11px", tier: "component", category: "typography", description: "Başlık font boyutu (text-[11px])" },
    { name: "treetable-header-tracking", cssVar: "--tracking-widest", resolvedValue: "0.18em", tier: "component", category: "typography", description: "Başlık harf aralığı (tracking-[0.18em])" },
    { name: "treetable-node-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Düğüm etiket font kalınlığı (font-semibold)" },
    // Border
    { name: "treetable-surface-radius", cssVar: "--radius-3xl", resolvedValue: "26px", tier: "component", category: "border", description: "Tablo kenar yarıçapı (rounded-[26px])" },
    { name: "treetable-expand-btn-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Genişletme butonu kenar yarıçapı (rounded-full)" },
    // Shadow
    { name: "treetable-surface-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Tablo gölge efekti (shadow-xs)" },
    // Sizing
    { name: "treetable-expand-btn-size", cssVar: "--size-7", resolvedValue: "28px", tier: "component", category: "sizing", description: "Genişletme butonu boyutu (size-7)" },
  ],
  Descriptions: [
    // Colors
    { name: "descriptions-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Öğe etiket metin rengi" },
    { name: "descriptions-value-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Öğe değer metin rengi" },
    { name: "descriptions-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kenarlıklı mod kenarlık rengi" },
    { name: "descriptions-tone-info", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border))", tier: "alias", category: "color", description: "Bilgi tonu sol kenarlık rengi" },
    { name: "descriptions-tone-success", cssVar: "--state-success-border", resolvedValue: "var(--state-success-border))", tier: "alias", category: "color", description: "Başarılı tonu sol kenarlık rengi" },
    { name: "descriptions-tone-warning", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-border)", tier: "alias", category: "color", description: "Uyarı tonu sol kenarlık rengi" },
    { name: "descriptions-tone-danger", cssVar: "--state-danger-border", resolvedValue: "var(--state-danger-border))", tier: "alias", category: "color", description: "Tehlike tonu sol kenarlık rengi" },
    // Spacing
    { name: "descriptions-cell-padding-comfortable", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Rahat yoğunluk hücre iç boşluk (py-4 px-4)" },
    { name: "descriptions-cell-padding-compact", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Sıkı yoğunluk hücre iç boşluk (py-2 px-3)" },
    { name: "descriptions-header-margin", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık alt boşluk (mb-4)" },
    // Typography
    { name: "descriptions-title-font-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "descriptions-label-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Etiket font boyutu (text-xs)" },
    { name: "descriptions-value-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Değer font boyutu (text-sm)" },
    // Border
    { name: "descriptions-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Kenarlıklı mod kenar yarıçapı (rounded-lg)" },
    { name: "descriptions-tone-border-width", cssVar: "--border-width-2", resolvedValue: "2px", tier: "global", category: "border", description: "Ton göstergesi sol kenarlık kalınlığı (border-l-2)" },
  ],
  Slider: [
    // Colors
    { name: "slider-accent", cssVar: "--accent-primary", resolvedValue: "var(--accent-primary)", tier: "alias", category: "color", description: "Kaydırıcı vurgu rengi (accent-color)" },
    { name: "slider-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Giriş çerçeve kenarlık rengi" },
    { name: "slider-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "slider-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Değer göstergesi metin rengi" },
    { name: "slider-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Min/max etiket metin rengi" },
    { name: "slider-badge-bg", cssVar: "--surface-canvas", resolvedValue: "var(--surface-canvas)", tier: "alias", category: "color", description: "Değer rozet arka plan rengi" },
    { name: "slider-badge-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Değer rozet kenarlık rengi" },
    // Spacing
    { name: "slider-badge-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Rozet yatay iç boşluk (px-3)" },
    { name: "slider-content-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "İçerik dikey boşluk (gap-3)" },
    // Typography
    { name: "slider-badge-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Değer rozet font boyutu (text-xs)" },
    { name: "slider-badge-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Değer rozet font kalınlığı (font-semibold)" },
    { name: "slider-label-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Min/max etiket font boyutu (text-xs)" },
    // Border
    { name: "slider-badge-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Değer rozet kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "slider-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Varsayılan giriş yüksekliği (md)" },
  ],
  PageHeader: [
    // Colors
    { name: "page-header-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Sayfa başlığı arka plan rengi" },
    { name: "page-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Alt kenarlık rengi" },
    { name: "page-header-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "page-header-subtitle-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Alt başlık metin rengi" },
    // Spacing
    { name: "page-header-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Yatay iç boşluk (px-6)" },
    { name: "page-header-padding-top", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Üst iç boşluk (pt-4)" },
    { name: "page-header-breadcrumb-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Breadcrumb ile başlık arası boşluk (mb-2)" },
    { name: "page-header-title-actions-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık ve aksiyonlar arası boşluk (gap-4)" },
    { name: "page-header-avatar-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Avatar ile başlık arası boşluk (gap-3)" },
    // Typography
    { name: "page-header-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Başlık font boyutu (text-xl)" },
    { name: "page-header-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "page-header-subtitle-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Alt başlık font boyutu (text-sm)" },
    // Sizing
    { name: "page-header-z-index", cssVar: "--z-sticky", resolvedValue: "100", tier: "component", category: "sizing", description: "Yapışkan başlık z-index değeri" },
  ],
  PageLayout: [
    // Colors
    { name: "page-layout-header-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Başlık bölgesi arka plan rengi" },
    { name: "page-layout-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Başlık alt kenarlık rengi" },
    { name: "page-layout-footer-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Footer arka plan rengi" },
    { name: "page-layout-footer-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Footer üst kenarlık rengi" },
    { name: "page-layout-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Sayfa başlığı metin rengi" },
    { name: "page-layout-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sayfa açıklama metin rengi" },
    // Spacing
    { name: "page-layout-header-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Başlık yatay iç boşluk (px-6)" },
    { name: "page-layout-header-padding-y", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık dikey iç boşluk (py-4)" },
    { name: "page-layout-content-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "İçerik yatay iç boşluk (px-6)" },
    { name: "page-layout-content-padding-y", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İçerik dikey iç boşluk (py-4)" },
    { name: "page-layout-detail-gap", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Ana içerik ve detay arası boşluk (gap-6)" },
    // Sizing
    { name: "page-layout-max-width-default", cssVar: "--max-w-5xl", resolvedValue: "64rem", tier: "component", category: "sizing", description: "Varsayılan sayfa genişliği (max-w-5xl)" },
    { name: "page-layout-max-width-wide", cssVar: "--max-w-7xl", resolvedValue: "80rem", tier: "component", category: "sizing", description: "Geniş sayfa genişliği (max-w-7xl)" },
    { name: "page-layout-detail-width", cssVar: "--size-80", resolvedValue: "320px", tier: "component", category: "sizing", description: "Detay paneli genişliği (w-80)" },
  ],
  FilterBar: [
    // Colors
    { name: "filter-bar-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Filtre çubuğu arka plan rengi" },
    { name: "filter-bar-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Alt kenarlık rengi" },
    { name: "filter-bar-toggle-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Daha fazla filtre düğmesi metin rengi" },
    { name: "filter-bar-toggle-hover-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Düğme hover metin rengi" },
    { name: "filter-bar-toggle-hover-bg", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Düğme hover arka plan rengi" },
    { name: "filter-bar-badge-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif filtre sayısı rozet arka planı" },
    { name: "filter-bar-focus-ring", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odak halkası rengi" },
    // Spacing
    { name: "filter-bar-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Yatay iç boşluk (px-6)" },
    { name: "filter-bar-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Dikey iç boşluk (py-3)" },
    { name: "filter-bar-padding-compact", cssVar: "--spacing-2", resolvedValue: "8px", tier: "component", category: "spacing", description: "Kompakt mod dikey iç boşluk (py-2)" },
    { name: "filter-bar-controls-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Filtre kontrolleri arası boşluk (gap-2)" },
    // Typography
    { name: "filter-bar-toggle-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Düğme font boyutu (text-sm)" },
    { name: "filter-bar-toggle-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Düğme font kalınlığı (font-medium)" },
    // Border
    { name: "filter-bar-toggle-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Düğme kenar yarıçapı (rounded-lg)" },
    // Sizing
    { name: "filter-bar-badge-size", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Aktif filtre rozet boyutu (h-5)" },
  ],
  SummaryStrip: [
    // Colors
    { name: "summary-strip-card-bg", cssVar: "--surface-card", resolvedValue: "var(--surface-card))", tier: "alias", category: "color", description: "Metrik kartı arka plan rengi" },
    { name: "summary-strip-card-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kart kenarlık rengi" },
    { name: "summary-strip-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Metrik etiket metin rengi" },
    { name: "summary-strip-value-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Metrik değer metin rengi" },
    { name: "summary-strip-icon-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "İkon arka plan rengi" },
    { name: "summary-strip-tone-info", cssVar: "--state-info-border", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Info ton sol kenarlık rengi" },
    { name: "summary-strip-tone-success", cssVar: "--state-success-border", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Success ton sol kenarlık rengi" },
    { name: "summary-strip-tone-warning", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Warning ton sol kenarlık rengi" },
    // Spacing
    { name: "summary-strip-card-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kart iç boşluğu (px-4 py-4)" },
    { name: "summary-strip-grid-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kartlar arası boşluk (gap-4)" },
    // Typography
    { name: "summary-strip-label-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Etiket font boyutu (text-xs)" },
    { name: "summary-strip-value-size", cssVar: "--font-size-2xl", resolvedValue: "24px", tier: "global", category: "typography", description: "Değer font boyutu (text-2xl)" },
    { name: "summary-strip-value-weight", cssVar: "--font-weight-bold", resolvedValue: "700", tier: "global", category: "typography", description: "Değer font kalınlığı (font-bold)" },
    // Border
    { name: "summary-strip-card-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Kart kenar yarıçapı (rounded-lg)" },
    // Sizing
    { name: "summary-strip-icon-size", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "İkon kutusu boyutu (h-8 w-8)" },
  ],
  DetailDrawer: [
    // Colors
    { name: "detail-drawer-backdrop", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.4)", tier: "alias", category: "color", description: "Arka plan karartma rengi (bg-surface-inverse/40)" },
    { name: "detail-drawer-surface", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Panel arka plan rengi" },
    { name: "detail-drawer-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Başlık alt kenarlık rengi" },
    { name: "detail-drawer-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "detail-drawer-subtitle-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Alt başlık metin rengi" },
    { name: "detail-drawer-close-text", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Kapatma düğmesi rengi" },
    { name: "detail-drawer-section-title-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Bölüm başlığı metin rengi" },
    // Spacing
    { name: "detail-drawer-header-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Başlık yatay iç boşluk (px-6)" },
    { name: "detail-drawer-section-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Bölüm yatay iç boşluk (px-6)" },
    { name: "detail-drawer-section-padding-y", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bölüm dikey iç boşluk (py-4)" },
    { name: "detail-drawer-footer-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Footer dikey iç boşluk (py-3)" },
    // Typography
    { name: "detail-drawer-title-size", cssVar: "--font-size-lg", resolvedValue: "18px", tier: "global", category: "typography", description: "Başlık font boyutu (text-lg)" },
    // Shadow
    { name: "detail-drawer-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-2xl)" },
    // Sizing
    { name: "detail-drawer-close-size", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Kapatma ikonu boyutu (h-5 w-5)" },
    { name: "detail-drawer-z-index", cssVar: "--z-modal", resolvedValue: "1300", tier: "component", category: "sizing", description: "Panel z-index değeri" },
  ],
  FormDrawer: [
    // Colors
    { name: "form-drawer-backdrop", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.4)", tier: "alias", category: "color", description: "Arka plan karartma rengi (bg-surface-inverse/40)" },
    { name: "form-drawer-surface", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Panel arka plan rengi" },
    { name: "form-drawer-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Başlık alt kenarlık rengi" },
    { name: "form-drawer-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "form-drawer-close-text", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Kapatma düğmesi rengi" },
    { name: "form-drawer-close-hover-bg", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Kapatma düğmesi hover arka planı" },
    { name: "form-drawer-loading-border", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Yükleme spinner kenarlık rengi" },
    // Spacing
    { name: "form-drawer-header-padding-x", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Başlık yatay iç boşluk (px-6)" },
    { name: "form-drawer-body-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Gövde yatay iç boşluk (px-6)" },
    { name: "form-drawer-footer-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Footer dikey iç boşluk (py-3)" },
    // Typography
    { name: "form-drawer-title-size", cssVar: "--font-size-lg", resolvedValue: "18px", tier: "global", category: "typography", description: "Başlık font boyutu (text-lg)" },
    { name: "form-drawer-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    // Shadow
    { name: "form-drawer-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-2xl)" },
    // Sizing
    { name: "form-drawer-z-index", cssVar: "--z-modal", resolvedValue: "1300", tier: "component", category: "sizing", description: "Panel z-index değeri" },
    { name: "form-drawer-spinner-size", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "Yükleme spinner boyutu (h-8 w-8)" },
  ],
  DetailSummary: [
    // Colors
    { name: "detail-summary-panel-bg-start", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Panel gradient başlangıç rengi" },
    { name: "detail-summary-panel-bg-end", cssVar: "--surface-subtle", resolvedValue: "rgba(245,246,255,0.94)", tier: "alias", category: "color", description: "Panel gradient bitiş rengi" },
    { name: "detail-summary-panel-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi (0.8 opasite)" },
    { name: "detail-summary-panel-ring", cssVar: "--color-white-alpha-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Panel dış halka rengi" },
    { name: "detail-summary-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "detail-summary-json-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "JSON görüntüleyici arka plan rengi" },
    // Spacing
    { name: "detail-summary-section-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bölümler arası dikey boşluk (gap-4)" },
    { name: "detail-summary-panel-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluğu (p-5)" },
    { name: "detail-summary-json-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "JSON görüntüleyici iç boşluk (p-4)" },
    // Typography
    { name: "detail-summary-json-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "JSON metin font boyutu (text-xs)" },
    // Border
    { name: "detail-summary-panel-radius", cssVar: "--radius-3xl", resolvedValue: "28px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[28px])" },
    // Shadow
    { name: "detail-summary-panel-shadow", cssVar: "--shadow-premium", resolvedValue: "0 22px 48px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Premium panel gölgesi" },
  ],
  NavigationRail: [
    // Colors
    { name: "nav-rail-default-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Varsayılan görünüm gradient başlangıcı" },
    { name: "nav-rail-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kenarlık rengi (0.8 opasite)" },
    { name: "nav-rail-active-bg", cssVar: "--surface-elevated", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Aktif öge arka plan gradient başlangıcı" },
    { name: "nav-rail-active-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Aktif öge kenarlık rengi (0.7 opasite)" },
    { name: "nav-rail-active-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aktif öge metin rengi" },
    { name: "nav-rail-inactive-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif öge metin rengi" },
    { name: "nav-rail-hover-bg", cssVar: "--surface-hover", resolvedValue: "rgba(255,255,255,0.78)", tier: "alias", category: "color", description: "Hover arka plan rengi" },
    { name: "nav-rail-badge-bg", cssVar: "--surface-panel", resolvedValue: "var(--surface-panel)", tier: "alias", category: "color", description: "Rozet arka plan rengi" },
    // Spacing
    { name: "nav-rail-root-padding", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Kök eleman iç boşluk (p-2)" },
    { name: "nav-rail-item-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Ögeler arası boşluk (gap-2)" },
    { name: "nav-rail-item-padding-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "component", category: "spacing", description: "Küçük öge dikey iç boşluk (py-2)" },
    { name: "nav-rail-item-padding-md", cssVar: "--spacing-3", resolvedValue: "12px", tier: "component", category: "spacing", description: "Orta öge dikey iç boşluk (py-3)" },
    // Typography
    { name: "nav-rail-item-font-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Küçük öge font boyutu (text-xs)" },
    { name: "nav-rail-item-font-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Orta öge font boyutu (text-sm)" },
    // Border
    { name: "nav-rail-root-radius", cssVar: "--radius-3xl", resolvedValue: "30px", tier: "component", category: "border", description: "Kök eleman kenar yarıçapı (rounded-[30px])" },
    { name: "nav-rail-item-radius", cssVar: "--radius-2xl", resolvedValue: "20px", tier: "component", category: "border", description: "Öge kenar yarıçapı (rounded-[20px])" },
    // Shadow
    { name: "nav-rail-shadow", cssVar: "--shadow-premium", resolvedValue: "0 22px 48px -32px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Premium panel gölgesi" },
    { name: "nav-rail-active-shadow", cssVar: "--shadow-active", resolvedValue: "0 18px 36px -28px rgba(15,23,42,0.3)", tier: "component", category: "shadow", description: "Aktif öge gölgesi" },
    // Sizing
    { name: "nav-rail-width-default", cssVar: "--size-64", resolvedValue: "256px", tier: "component", category: "sizing", description: "Varsayılan genişlik (w-64)" },
    { name: "nav-rail-width-compact", cssVar: "--size-20", resolvedValue: "80px", tier: "component", category: "sizing", description: "Kompakt genişlik (w-20)" },
    { name: "nav-rail-icon-size", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "İkon kutusu boyutu (h-6 w-6)" },
  ],
  TextInput: [
    // Colors
    { name: "textinput-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Metin giriş alanı arka plan rengi" },
    { name: "textinput-border-default", cssVar: "--border-default", resolvedValue: "var(--border-default)/80", tier: "alias", category: "color", description: "Varsayılan kenarlık rengi (%80 opasite)" },
    { name: "textinput-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "textinput-border-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)/90", tier: "alias", category: "color", description: "Hata durumu kenarlık rengi" },
    { name: "textinput-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Giriş metni rengi" },
    { name: "textinput-placeholder", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Yer tutucu metin rengi" },
    { name: "textinput-disabled-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Devre dışı arka plan rengi" },
    { name: "textinput-disabled-text", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Devre dışı metin rengi" },
    // Spacing
    { name: "textinput-padding-x-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Küçük boyut yatay iç boşluk (px-3)" },
    { name: "textinput-padding-x-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Orta boyut yatay iç boşluk (px-4)" },
    { name: "textinput-padding-y-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Küçük boyut dikey iç boşluk (py-2)" },
    { name: "textinput-padding-y-md", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Orta boyut dikey iç boşluk (py-3)" },
    // Typography
    { name: "textinput-font-size-sm", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "SM/MD giriş alanı font boyutu (text-sm)" },
    { name: "textinput-font-size-lg", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "LG giriş alanı font boyutu (text-base)" },
    // Border
    { name: "textinput-radius-sm", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Küçük boyut kenar yarıçapı (rounded-xl)" },
    { name: "textinput-radius-md", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Orta/büyük boyut kenar yarıçapı (rounded-2xl)" },
    { name: "textinput-focus-ring", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Odaklanma halkası genişliği (ring-2)" },
    // Shadow
    { name: "textinput-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Varsayılan alan gölgesi" },
    // Sizing
    { name: "textinput-height-sm", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Küçük boyut minimum yükseklik (min-h-10)" },
    { name: "textinput-height-md", cssVar: "--size-11", resolvedValue: "44px", tier: "component", category: "sizing", description: "Orta boyut minimum yükseklik (min-h-11)" },
    { name: "textinput-height-lg", cssVar: "--size-12", resolvedValue: "48px", tier: "component", category: "sizing", description: "Büyük boyut minimum yükseklik (min-h-12)" },
  ],
  TextArea: [
    // Colors
    { name: "textarea-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Metin alanı arka plan rengi" },
    { name: "textarea-border-default", cssVar: "--border-default", resolvedValue: "var(--border-default)/80", tier: "alias", category: "color", description: "Varsayılan kenarlık rengi" },
    { name: "textarea-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "textarea-border-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)/90", tier: "alias", category: "color", description: "Hata durumu kenarlık rengi" },
    { name: "textarea-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Metin alanı metin rengi" },
    { name: "textarea-placeholder", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Yer tutucu metin rengi" },
    { name: "textarea-disabled-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Devre dışı arka plan rengi" },
    // Spacing
    { name: "textarea-padding-x-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Yatay iç boşluk (px-4)" },
    { name: "textarea-padding-y-md", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Dikey iç boşluk (py-3)" },
    // Typography
    { name: "textarea-font-size-sm", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "SM/MD metin alanı font boyutu (text-sm)" },
    { name: "textarea-font-size-lg", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "LG metin alanı font boyutu (text-base)" },
    { name: "textarea-line-height", cssVar: "--leading-6", resolvedValue: "24px", tier: "global", category: "typography", description: "Metin alanı satır yüksekliği (leading-6)" },
    // Border
    { name: "textarea-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Metin alanı kenar yarıçapı (rounded-2xl)" },
    { name: "textarea-focus-ring", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Odaklanma halkası genişliği (ring-2)" },
    // Shadow
    { name: "textarea-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Varsayılan metin alanı gölgesi" },
  ],
  TimePicker: [
    // Colors
    { name: "timepicker-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Saat seçici arka plan rengi" },
    { name: "timepicker-border-default", cssVar: "--border-default", resolvedValue: "var(--border-default)/80", tier: "alias", category: "color", description: "Varsayılan kenarlık rengi" },
    { name: "timepicker-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "timepicker-border-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)/90", tier: "alias", category: "color", description: "Hata durumu kenarlık rengi" },
    { name: "timepicker-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Saat değeri metin rengi" },
    { name: "timepicker-disabled-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Devre dışı arka plan rengi" },
    { name: "timepicker-readonly-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Salt okunur arka plan rengi" },
    // Spacing
    { name: "timepicker-padding-x", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Yatay iç boşluk (px-4)" },
    { name: "timepicker-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Dikey iç boşluk (py-3)" },
    // Typography
    { name: "timepicker-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Saat seçici font boyutu (text-sm)" },
    // Border
    { name: "timepicker-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Saat seçici kenar yarıçapı (rounded-2xl)" },
    { name: "timepicker-focus-ring", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Odaklanma halkası genişliği" },
    // Sizing
    { name: "timepicker-height-md", cssVar: "--size-11", resolvedValue: "44px", tier: "component", category: "sizing", description: "Orta boyut minimum yükseklik (min-h-11)" },
  ],
  Upload: [
    // Colors
    { name: "upload-dropzone-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Yükleme alanı arka plan rengi" },
    { name: "upload-dropzone-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Yükleme alanı kenarlık rengi" },
    { name: "upload-dropzone-border-active", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Sürükle-bırak aktif kenarlık rengi" },
    { name: "upload-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Yükleme yardım metni rengi" },
    { name: "upload-icon", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Yükleme ikonu rengi" },
    { name: "upload-file-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Dosya adı metin rengi" },
    { name: "upload-file-size-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Dosya boyutu metin rengi" },
    // Spacing
    { name: "upload-padding-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Küçük boyut iç boşluk (px-3 py-3)" },
    { name: "upload-padding-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Orta boyut iç boşluk (px-4 py-4)" },
    { name: "upload-padding-lg", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Büyük boyut iç boşluk (px-5 py-5)" },
    // Typography
    { name: "upload-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Yükleme alanı font boyutu" },
    // Border
    { name: "upload-radius-sm", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Küçük boyut kenar yarıçapı (rounded-xl)" },
    { name: "upload-radius-md", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Orta/büyük boyut kenar yarıçapı (rounded-2xl)" },
    // Sizing
    { name: "upload-icon-size", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Yükleme ikonu kutu boyutu" },
  ],
  Segmented: [
    // Colors
    { name: "segmented-bg", cssVar: "--segmented-bg", resolvedValue: "var(--surface-muted)", tier: "component", category: "color", description: "Segmented kontrol arka plan rengi (default görünüm)" },
    { name: "segmented-active-bg", cssVar: "--segmented-active-bg", resolvedValue: "var(--surface-default)", tier: "component", category: "color", description: "Aktif segment arka plan rengi" },
    { name: "segmented-active-text", cssVar: "--segmented-active-text", resolvedValue: "var(--text-primary)", tier: "component", category: "color", description: "Aktif segment metin rengi" },
    { name: "segmented-text", cssVar: "--segmented-text", resolvedValue: "var(--text-secondary)", tier: "component", category: "color", description: "Pasif segment metin rengi" },
    { name: "segmented-border", cssVar: "--segmented-border", resolvedValue: "var(--border-subtle)", tier: "component", category: "color", description: "Outline görünüm kenarlık rengi" },
    { name: "segmented-active-border", cssVar: "--segmented-active-border", resolvedValue: "var(--action-primary)", tier: "component", category: "color", description: "Outline görünüm aktif kenarlık rengi" },
    // Spacing
    { name: "segmented-padding-x-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Küçük segment yatay iç boşluk (px-2)" },
    { name: "segmented-padding-x-md", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Orta segment yatay iç boşluk (px-3)" },
    { name: "segmented-padding-x-lg", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Büyük segment yatay iç boşluk (px-4)" },
    { name: "segmented-container-padding", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Container iç boşluk (p-1)" },
    // Typography
    { name: "segmented-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Küçük segment font boyutu (text-xs)" },
    { name: "segmented-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Orta segment font boyutu (text-sm)" },
    { name: "segmented-font-size-lg", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Büyük segment font boyutu (text-base)" },
    // Border
    { name: "segmented-radius-rounded", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Rounded şekil kenar yarıçapı (rounded-lg)" },
    { name: "segmented-radius-pill", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Pill şekil kenar yarıçapı (rounded-full)" },
    // Shadow
    { name: "segmented-active-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Aktif segment gölgesi" },
  ],
  MobileStepper: [
    // Colors
    { name: "mobilestepper-dot-active", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif adım noktası rengi" },
    { name: "mobilestepper-dot-inactive", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Pasif adım noktası rengi" },
    { name: "mobilestepper-progress-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "İlerleme çubuğu arka plan rengi" },
    { name: "mobilestepper-progress-fill", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "İlerleme çubuğu dolgu rengi" },
    { name: "mobilestepper-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Adım metin rengi" },
    // Spacing
    { name: "mobilestepper-dot-gap", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Noktalar arası boşluk (gap-1.5)" },
    { name: "mobilestepper-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Container iç boşluk (px-4)" },
    // Typography
    { name: "mobilestepper-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Adım metin font boyutu (text-xs)" },
    // Sizing
    { name: "mobilestepper-dot-size", cssVar: "--size-2", resolvedValue: "8px", tier: "component", category: "sizing", description: "Adım noktası boyutu (h-2 w-2)" },
    { name: "mobilestepper-progress-height", cssVar: "--size-1", resolvedValue: "4px", tier: "component", category: "sizing", description: "İlerleme çubuğu yüksekliği (h-1)" },
    // Motion
    { name: "mobilestepper-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease", tier: "global", category: "motion", description: "Adım geçiş animasyonu süresi" },
  ],
  TablePagination: [
    // Colors
    { name: "tablepagination-bg", cssVar: "--surface-default", resolvedValue: "white/70", tier: "alias", category: "color", description: "Sayfalama araç çubuğu arka plan rengi" },
    { name: "tablepagination-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/70", tier: "alias", category: "color", description: "Sayfalama kenarlık rengi" },
    { name: "tablepagination-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Aralık bilgisi metin rengi" },
    { name: "tablepagination-button-hover", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Navigasyon butonu hover rengi" },
    { name: "tablepagination-disabled-text", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Devre dışı buton metin rengi" },
    // Spacing
    { name: "tablepagination-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Navigasyon butonları arası boşluk (gap-2)" },
    { name: "tablepagination-padding-x", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Aksiyon grubu yatay iç boşluk (px-2)" },
    { name: "tablepagination-padding-y", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Aksiyon grubu dikey iç boşluk (py-1)" },
    // Typography
    { name: "tablepagination-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Sayfalama metin font boyutu" },
    // Border
    { name: "tablepagination-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Aksiyon grubu kenar yarıçapı (rounded-full)" },
    // Shadow
    { name: "tablepagination-shadow", cssVar: "--shadow-pagination", resolvedValue: "0 12px 24px -22px rgba(15,23,42,0.2)", tier: "component", category: "shadow", description: "Sayfalama araç çubuğu gölgesi" },
  ],
  Empty: [
    // Colors
    { name: "empty-icon-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "İkon container arka plan rengi" },
    { name: "empty-icon-color", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İkon ve SVG rengi" },
    { name: "empty-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "empty-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Açıklama metin rengi" },
    // Spacing
    { name: "empty-padding-compact", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Kompakt dikey iç boşluk (py-6)" },
    { name: "empty-padding-default", cssVar: "--spacing-12", resolvedValue: "48px", tier: "global", category: "spacing", description: "Varsayılan dikey iç boşluk (py-12)" },
    { name: "empty-icon-margin", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İkon alt boşluk (mb-4)" },
    { name: "empty-action-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Aksiyon butonları arası boşluk (gap-2)" },
    // Typography
    { name: "empty-title-size-default", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Varsayılan başlık font boyutu (text-base)" },
    { name: "empty-title-size-compact", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Kompakt başlık font boyutu (text-sm)" },
    { name: "empty-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "empty-description-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Açıklama font boyutu (text-sm)" },
    // Border
    { name: "empty-icon-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "İkon container kenar yarıçapı (rounded-2xl)" },
    // Sizing
    { name: "empty-icon-box-default", cssVar: "--size-14", resolvedValue: "56px", tier: "component", category: "sizing", description: "Varsayılan ikon kutusu boyutu (h-14 w-14)" },
    { name: "empty-icon-box-compact", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Kompakt ikon kutusu boyutu (h-10 w-10)" },
  ],
  Tabs: [
    // Colors
    { name: "tabs-line-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Line varyant alt kenarlık rengi" },
    { name: "tabs-active-indicator", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif sekme gösterge rengi" },
    { name: "tabs-active-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aktif sekme metin rengi" },
    { name: "tabs-inactive-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif sekme metin rengi" },
    { name: "tabs-enclosed-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Enclosed varyant container arka plan rengi" },
    { name: "tabs-enclosed-active-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Enclosed varyant aktif sekme arka planı" },
    { name: "tabs-pill-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Pill varyant aktif sekme arka planı" },
    { name: "tabs-pill-active-text", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Pill varyant aktif sekme metin rengi" },
    // Spacing
    { name: "tabs-padding-x-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Küçük sekme yatay iç boşluk (px-3)" },
    { name: "tabs-padding-x-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Orta sekme yatay iç boşluk (px-4)" },
    { name: "tabs-padding-x-lg", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Büyük sekme yatay iç boşluk (px-5)" },
    { name: "tabs-gap-sm", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Küçük ikon-etiket boşluğu (gap-1.5)" },
    { name: "tabs-gap-md", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Orta ikon-etiket boşluğu (gap-2)" },
    // Typography
    { name: "tabs-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Küçük sekme font boyutu (text-xs)" },
    { name: "tabs-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Orta sekme font boyutu (text-sm)" },
    { name: "tabs-font-size-lg", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Büyük sekme font boyutu (text-base)" },
    // Border
    { name: "tabs-enclosed-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Enclosed container kenar yarıçapı (rounded-xl)" },
    { name: "tabs-enclosed-tab-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Enclosed sekme kenar yarıçapı (rounded-lg)" },
    { name: "tabs-pill-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Pill sekme kenar yarıçapı (rounded-full)" },
    { name: "tabs-indicator-width", cssVar: "--border-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Line varyant aktif gösterge kalınlığı (border-b-2)" },
    // Shadow
    { name: "tabs-enclosed-active-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Enclosed aktif sekme gölgesi" },
    { name: "tabs-pill-active-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Pill aktif sekme gölgesi" },
  ],
  Toast: [
    // Colors
    { name: "toast-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Toast bildirim arka plan rengi" },
    { name: "toast-info-indicator", cssVar: "--state-info-text", resolvedValue: "var(--state-info-text)", tier: "alias", category: "color", description: "Bilgi bildirimi gösterge rengi" },
    { name: "toast-success-indicator", cssVar: "--state-success-text", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Başarı bildirimi gösterge rengi" },
    { name: "toast-warning-indicator", cssVar: "--state-warning-text", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Uyarı bildirimi gösterge rengi" },
    { name: "toast-error-indicator", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Hata bildirimi gösterge rengi" },
    { name: "toast-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Toast mesaj metin rengi" },
    { name: "toast-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Toast başlık metin rengi" },
    // Spacing
    { name: "toast-container-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Toast'lar arası boşluk (gap-2)" },
    { name: "toast-viewport-inset", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Viewport kenar mesafesi (top-4 right-4)" },
    { name: "toast-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Tekil toast iç boşluğu (p-4)" },
    // Typography
    { name: "toast-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "toast-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Toast mesaj font boyutu (text-sm)" },
    // Border
    { name: "toast-border-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Toast kenar yarıçapı (rounded-xl)" },
    // Shadow
    { name: "toast-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Toast gölgesi (shadow-lg)" },
    // Sizing
    { name: "toast-indicator-width", cssVar: "--size-1", resolvedValue: "4px", tier: "component", category: "sizing", description: "Sol gösterge çubuğu genişliği (w-1)" },
  ],
  EmptyErrorLoading: [
    // Colors
    { name: "eel-section-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Dış bölüm arka plan rengi (bg-surface-muted)" },
    { name: "eel-section-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Dış bölüm kenarlık rengi (border-subtle)" },
    { name: "eel-inner-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "İç içerik alanı arka planı (bg-surface-default)" },
    { name: "eel-inner-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "İç içerik alanı kenarlık rengi" },
    { name: "eel-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi (text-primary)" },
    { name: "eel-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Açıklama metin rengi (text-secondary)" },
    // Spacing
    { name: "eel-section-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Dış bölüm iç boşluğu (p-5)" },
    { name: "eel-inner-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İç içerik alanı boşluğu (p-4)" },
    { name: "eel-content-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İçerik elemanları arası boşluk (gap-4)" },
    // Typography
    { name: "eel-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "eel-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "eel-description-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Açıklama font boyutu (text-sm)" },
    // Border
    { name: "eel-section-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "global", category: "border", description: "Dış bölüm kenar yarıçapı (rounded-3xl)" },
    { name: "eel-inner-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "global", category: "border", description: "İç alan kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "eel-section-shadow", cssVar: "--shadow-xs", resolvedValue: "shadow-xs", tier: "global", category: "shadow", description: "Dış bölüm gölgesi (shadow-xs)" },
  ],
  LinkInline: [
    // Colors
    { name: "linkinline-primary-text", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary ton bağlantı metin rengi" },
    { name: "linkinline-primary-hover", cssVar: "--action-primary-hover", resolvedValue: "var(--action-primary-hover)", tier: "alias", category: "color", description: "Primary ton hover metin rengi" },
    { name: "linkinline-secondary-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Secondary ton bağlantı metin rengi" },
    { name: "linkinline-secondary-hover", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Secondary ton hover metin rengi" },
    { name: "linkinline-visited", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Ziyaret edilmiş bağlantı rengi (visited)" },
    { name: "linkinline-current-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aktif sayfa bağlantı metin rengi (current)" },
    { name: "linkinline-current-decoration", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif sayfa alt çizgi rengi" },
    { name: "linkinline-disabled-text", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Devre dışı bağlantı metin rengi" },
    { name: "linkinline-disabled-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Devre dışı bağlantı arka planı" },
    { name: "linkinline-disabled-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Devre dışı bağlantı kenarlık rengi" },
    { name: "linkinline-focus-ring", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odak halkası rengi (ring-action-primary/30)" },
    // Spacing
    { name: "linkinline-icon-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "İkon ve metin arası boşluk (gap-1)" },
    { name: "linkinline-disabled-px", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Devre dışı yatay iç boşluk (px-2)" },
    // Typography
    { name: "linkinline-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Bağlantı font kalınlığı (font-medium)" },
    { name: "linkinline-current-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Aktif sayfa font kalınlığı (font-semibold)" },
    // Border
    { name: "linkinline-radius", cssVar: "--radius-md", resolvedValue: "6px", tier: "global", category: "border", description: "Bağlantı kenar yarıçapı (rounded-md)" },
    { name: "linkinline-underline-offset", cssVar: "--underline-offset-4", resolvedValue: "4px", tier: "component", category: "border", description: "Alt çizgi uzaklığı (underline-offset-4)" },
  ],
  MenuBar: [
    // Colors
    { name: "menubar-bg-default", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Varsayılan görünüm arka plan gradyanı" },
    { name: "menubar-border-default", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Varsayılan görünüm kenarlık rengi" },
    { name: "menubar-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif sekme arka plan rengi" },
    { name: "menubar-active-text", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aktif sekme metin rengi" },
    { name: "menubar-inactive-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif sekme metin rengi" },
    { name: "menubar-hover-bg", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Hover durumu arka plan rengi" },
    { name: "menubar-badge-bg", cssVar: "--feedback-error", resolvedValue: "var(--feedback-error)", tier: "alias", category: "color", description: "Badge arka plan rengi" },
    // Spacing
    { name: "menubar-gap-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Küçük boyut öğe arası boşluk (gap-2)" },
    { name: "menubar-gap-md", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Orta boyut öğe arası boşluk (gap-2.5)" },
    { name: "menubar-padding-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Küçük boyut yatay iç boşluk (px-3)" },
    { name: "menubar-padding-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Orta boyut yatay iç boşluk (px-4)" },
    // Typography
    { name: "menubar-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Küçük boyut font boyutu (text-xs)" },
    { name: "menubar-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Orta boyut font boyutu (text-sm)" },
    // Border
    { name: "menubar-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Kök container kenar yarıçapı (rounded-2xl)" },
    { name: "menubar-item-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Tekil öğe kenar yarıçapı (rounded-xl)" },
    // Shadow
    { name: "menubar-shadow", cssVar: "--shadow-menubar", resolvedValue: "0 20px 46px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "MenuBar gölgesi (shadow-lg)" },
    // Sizing
    { name: "menubar-height-sm", cssVar: "--size-9", resolvedValue: "36px", tier: "component", category: "sizing", description: "Küçük boyut minimum yükseklik (min-h-9)" },
    { name: "menubar-height-md", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Orta boyut minimum yükseklik (min-h-10)" },
  ],
  AppHeader: [
    // Colors
    { name: "appheader-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Uygulama header arka plan rengi" },
    { name: "appheader-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Header alt kenarlık rengi" },
    { name: "appheader-brand-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Marka/logo metin rengi" },
    { name: "appheader-nav-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Navigasyon öğesi metin rengi" },
    { name: "appheader-nav-active", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif navigasyon öğesi rengi" },
    { name: "appheader-utility-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sağ yardımcı alan metin rengi" },
    // Spacing
    { name: "appheader-padding-x", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Header yatay iç boşluk (px-4)" },
    { name: "appheader-padding-y", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Header dikey iç boşluk (py-2)" },
    { name: "appheader-slot-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlangıç/bitiş slot arası boşluk (gap-3)" },
    // Typography
    { name: "appheader-brand-weight", cssVar: "--font-weight-bold", resolvedValue: "700", tier: "global", category: "typography", description: "Marka metin kalınlığı (font-bold)" },
    { name: "appheader-nav-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Navigasyon öğesi font boyutu (text-sm)" },
    // Border
    { name: "appheader-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Header kenar yarıçapı (rounded-2xl)" },
    // Sizing
    { name: "appheader-height", cssVar: "--size-14", resolvedValue: "56px", tier: "component", category: "sizing", description: "Header minimum yükseklik" },
  ],
  NavigationMenu: [
    // Colors
    { name: "navmenu-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Navigasyon menü arka plan rengi" },
    { name: "navmenu-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Navigasyon menü kenarlık rengi" },
    { name: "navmenu-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif rota arka plan rengi" },
    { name: "navmenu-active-text", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aktif rota metin rengi" },
    { name: "navmenu-inactive-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif rota metin rengi" },
    { name: "navmenu-hover-bg", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Hover durumu arka plan rengi" },
    // Spacing
    { name: "navmenu-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Container iç boşluk (px-4)" },
    { name: "navmenu-item-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Menü öğeleri arası boşluk (gap-2)" },
    // Typography
    { name: "navmenu-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Menü öğesi font boyutu (text-sm)" },
    { name: "navmenu-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Menü öğesi font kalınlığı (font-medium)" },
    // Border
    { name: "navmenu-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Container kenar yarıçapı (rounded-2xl)" },
    { name: "navmenu-item-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Öğe kenar yarıçapı (rounded-xl)" },
    // Shadow
    { name: "navmenu-shadow", cssVar: "--shadow-menubar", resolvedValue: "0 20px 46px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Navigasyon menü gölgesi" },
  ],
  ActionHeader: [
    // Colors
    { name: "actionheader-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aksiyon header arka plan rengi" },
    { name: "actionheader-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Aksiyon header kenarlık rengi" },
    { name: "actionheader-action-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aksiyon buton metin rengi" },
    { name: "actionheader-selection-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçim sayacı arka plan rengi" },
    { name: "actionheader-selection-text", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Seçim sayacı metin rengi" },
    { name: "actionheader-disabled-text", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Devre dışı aksiyon metin rengi" },
    // Spacing
    { name: "actionheader-padding-x", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Header yatay iç boşluk (px-4)" },
    { name: "actionheader-padding-y", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Header dikey iç boşluk (py-2)" },
    { name: "actionheader-action-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Aksiyon butonları arası boşluk (gap-2)" },
    // Typography
    { name: "actionheader-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Aksiyon buton font boyutu (text-sm)" },
    { name: "actionheader-badge-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Seçim sayacı font boyutu (text-xs)" },
    // Border
    { name: "actionheader-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Header kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "actionheader-shadow", cssVar: "--shadow-menubar", resolvedValue: "0 20px 46px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Aksiyon header gölgesi" },
  ],
  ContextMenu: [
    // Colors
    { name: "contextmenu-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Menü arka plan rengi (bg-surface-default)" },
    { name: "contextmenu-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Menü kenarlık rengi (border-default)" },
    { name: "contextmenu-item-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Menü öğesi metin rengi (text-primary)" },
    { name: "contextmenu-item-hover", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Öğe hover arka plan rengi (surface-hover)" },
    { name: "contextmenu-danger-text", cssVar: "--feedback-error", resolvedValue: "var(--feedback-error)", tier: "alias", category: "color", description: "Tehlikeli öğe metin rengi (feedback-error)" },
    { name: "contextmenu-label-text", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Grup etiketi metin rengi (text-tertiary)" },
    { name: "contextmenu-shortcut-text", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Kısayol metin rengi (text-tertiary)" },
    { name: "contextmenu-separator", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Ayırıcı çizgi rengi (border-default)" },
    // Spacing
    { name: "contextmenu-item-px", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Öğe yatay iç boşluk (px-3)" },
    { name: "contextmenu-item-py", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Öğe dikey iç boşluk (py-1.5)" },
    { name: "contextmenu-icon-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "İkon-etiket arası boşluk (gap-2)" },
    { name: "contextmenu-container-py", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Container dikey iç boşluk (py-1)" },
    // Typography
    { name: "contextmenu-item-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Öğe font boyutu (text-sm)" },
    { name: "contextmenu-label-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Grup etiketi font boyutu (text-xs)" },
    { name: "contextmenu-label-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Grup etiketi font kalınlığı (font-semibold)" },
    // Border
    { name: "contextmenu-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Menü kenar yarıçapı (rounded-lg)" },
    // Shadow
    { name: "contextmenu-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Menü gölgesi (shadow-lg)" },
    // Sizing
    { name: "contextmenu-min-width", cssVar: "--size-40", resolvedValue: "160px", tier: "component", category: "sizing", description: "Menü minimum genişlik (min-w-[160px])" },
    { name: "contextmenu-icon-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "İkon boyutu (w-4 h-4)" },
  ],
  DesktopMenubar: [
    // Colors
    { name: "desktopmenubar-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Masaüstü menü çubuğu arka plan rengi" },
    { name: "desktopmenubar-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Menü çubuğu kenarlık rengi" },
    { name: "desktopmenubar-root-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Kök menü öğesi metin rengi" },
    { name: "desktopmenubar-root-hover", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Kök menü öğesi hover arka planı" },
    { name: "desktopmenubar-submenu-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Alt menü panel arka plan rengi" },
    { name: "desktopmenubar-submenu-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Alt menü panel kenarlık rengi" },
    { name: "desktopmenubar-item-hover", cssVar: "--surface-hover", resolvedValue: "var(--surface-hover)", tier: "alias", category: "color", description: "Alt menü öğesi hover arka planı" },
    // Spacing
    { name: "desktopmenubar-root-px", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Kök öğe yatay iç boşluk (px-3)" },
    { name: "desktopmenubar-root-py", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Kök öğe dikey iç boşluk (py-2)" },
    { name: "desktopmenubar-submenu-padding", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Alt menü iç boşluk (py-1)" },
    // Typography
    { name: "desktopmenubar-root-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Kök menü öğesi font boyutu (text-sm)" },
    { name: "desktopmenubar-root-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Kök menü öğesi font kalınlığı (font-medium)" },
    // Border
    { name: "desktopmenubar-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Menü çubuğu kenar yarıçapı (rounded-2xl)" },
    { name: "desktopmenubar-submenu-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Alt menü kenar yarıçapı (rounded-lg)" },
    // Shadow
    { name: "desktopmenubar-shadow", cssVar: "--shadow-menubar", resolvedValue: "0 20px 46px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Menü çubuğu gölgesi" },
    { name: "desktopmenubar-submenu-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "component", category: "shadow", description: "Alt menü panel gölgesi (shadow-lg)" },
  ],
};
