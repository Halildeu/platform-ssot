import type { TokenEntry } from "./types";

export const tokenMap3: Record<string, TokenEntry[]> = {
  NotificationDrawer: [
    // Color
    { name: "notificationdrawer-overlay-bg", cssVar: "--color-overlay", resolvedValue: "rgba(15,23,42,0.4)", tier: "alias", category: "color", description: "Drawer açıldığında arka plan örtü rengi" },
    { name: "notificationdrawer-panel-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Drawer panel arka plan rengi" },
    { name: "notificationdrawer-close-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Kapatma butonu metin rengi" },
    { name: "notificationdrawer-close-hover", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Kapatma butonu hover rengi" },
    // Spacing
    { name: "notificationdrawer-panel-padding", cssVar: "--spacing-0", resolvedValue: "0px", tier: "global", category: "spacing", description: "Panel iç boşluk (panel içeriği NotificationPanel tarafından yönetilir)" },
    // Sizing
    { name: "notificationdrawer-max-width", cssVar: "--size-md", resolvedValue: "28rem", tier: "component", category: "sizing", description: "Drawer maksimum genişliği (max-w-md)" },
    { name: "notificationdrawer-height", cssVar: "--size-full", resolvedValue: "100%", tier: "component", category: "sizing", description: "Drawer yüksekliği (tam ekran)" },
    // Border
    { name: "notificationdrawer-radius", cssVar: "--radius-none", resolvedValue: "0px", tier: "component", category: "border", description: "Panel kenar yarıçapı (sağ kenar çekmece)" },
    // Shadow
    { name: "notificationdrawer-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "component", category: "shadow", description: "Drawer panel gölgesi" },
    // Motion
    { name: "notificationdrawer-transition", cssVar: "--transition-slide", resolvedValue: "300ms ease", tier: "component", category: "motion", description: "Drawer açılış/kapanış animasyonu (slide)" },
  ],
  NotificationPanel: [
    // Color
    { name: "notificationpanel-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Panel arka plan rengi (gradient)" },
    { name: "notificationpanel-header-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.86)", tier: "alias", category: "color", description: "Başlık bölümü arka plan rengi" },
    { name: "notificationpanel-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Başlık alt çizgi rengi" },
    { name: "notificationpanel-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "notificationpanel-summary-text", cssVar: "--text-subtle", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Özet etiketi metin rengi" },
    { name: "notificationpanel-empty-bg", cssVar: "--surface-muted", resolvedValue: "rgba(243,245,252,0.88)", tier: "alias", category: "color", description: "Boş durum arka plan rengi" },
    { name: "notificationpanel-filter-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif filtre butonu arka planı" },
    // Spacing
    { name: "notificationpanel-header-px", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Başlık yatay iç boşluk (px-6)" },
    { name: "notificationpanel-header-py", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık dikey iç boşluk (py-4)" },
    { name: "notificationpanel-content-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İçerik yatay iç boşluk (px-4)" },
    { name: "notificationpanel-section-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bölüm arası boşluk (gap-4)" },
    // Typography
    { name: "notificationpanel-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "notificationpanel-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "notificationpanel-section-label-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Bölüm etiketi font boyutu" },
    // Border
    { name: "notificationpanel-radius", cssVar: "--radius-3xl", resolvedValue: "30px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[30px])" },
    // Shadow
    { name: "notificationpanel-shadow", cssVar: "--shadow-panel", resolvedValue: "0 34px 70px -38px rgba(15,23,42,0.36)", tier: "component", category: "shadow", description: "Panel premium gölgesi" },
  ],
  NotificationItemCard: [
    // Color
    { name: "notificationitemcard-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.97)", tier: "alias", category: "color", description: "Kart arka plan rengi (gradient)" },
    { name: "notificationitemcard-high-bg", cssVar: "--state-warning-bg", resolvedValue: "rgba(255,251,235,0.96)", tier: "alias", category: "color", description: "Yüksek öncelik arka plan rengi" },
    { name: "notificationitemcard-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kart kenarlık rengi" },
    { name: "notificationitemcard-high-border", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-border)", tier: "alias", category: "color", description: "Yüksek öncelik kenarlık rengi" },
    { name: "notificationitemcard-message-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Okunmamış mesaj metin rengi" },
    { name: "notificationitemcard-read-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Okunmuş mesaj metin rengi" },
    { name: "notificationitemcard-timestamp-text", cssVar: "--text-subtle", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Zaman damgası metin rengi" },
    { name: "notificationitemcard-action-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.82)", tier: "alias", category: "color", description: "Aksiyon butonu arka planı" },
    // Spacing
    { name: "notificationitemcard-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kart iç boşluk (p-4)" },
    { name: "notificationitemcard-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "İçerik arası boşluk (gap-3)" },
    // Typography
    { name: "notificationitemcard-badge-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Tip rozet font boyutu" },
    { name: "notificationitemcard-timestamp-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Zaman damgası font boyutu" },
    // Border
    { name: "notificationitemcard-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Kart kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "notificationitemcard-shadow", cssVar: "--shadow-card", resolvedValue: "0 26px 54px -34px rgba(15,23,42,0.32)", tier: "component", category: "shadow", description: "Kart premium gölgesi" },
  ],
  ToastProvider: [
    // Color
    { name: "toast-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Toast arka plan rengi" },
    { name: "toast-info-border", cssVar: "--state-info-text", resolvedValue: "var(--state-info-text)", tier: "alias", category: "color", description: "Bilgi toast kenarlık rengi" },
    { name: "toast-success-border", cssVar: "--state-success-text", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Başarı toast kenarlık rengi" },
    { name: "toast-warning-border", cssVar: "--state-warning-text", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Uyarı toast kenarlık rengi" },
    { name: "toast-error-border", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Hata toast kenarlık rengi" },
    { name: "toast-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Toast başlık metin rengi" },
    { name: "toast-message-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Toast mesaj metin rengi" },
    { name: "toast-dismiss-hover", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Kapatma butonu hover arka planı" },
    // Spacing
    { name: "toast-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Toast iç boşluk (p-4)" },
    { name: "toast-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "İçerik elemanları arası boşluk (gap-3)" },
    { name: "toast-container-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Toast'lar arası boşluk (gap-2)" },
    // Typography
    { name: "toast-title-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Toast başlık font boyutu (text-sm)" },
    { name: "toast-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Toast başlık font kalınlığı" },
    // Sizing
    { name: "toast-width", cssVar: "--size-80", resolvedValue: "320px", tier: "component", category: "sizing", description: "Toast genişliği (w-80)" },
    { name: "toast-indicator-size", cssVar: "--size-2", resolvedValue: "8px", tier: "component", category: "sizing", description: "Renk göstergesi boyutu (h-2 w-2)" },
    // Border
    { name: "toast-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Toast kenar yarıçapı (rounded-xl)" },
    // Shadow
    { name: "toast-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Toast gölgesi (shadow-lg)" },
    // Motion
    { name: "toast-enter-animation", cssVar: "--animate-slide-in", resolvedValue: "slide-in-from-right-full fade-in", tier: "component", category: "motion", description: "Toast giriş animasyonu" },
  ],
  TourCoachmarks: [
    // Color
    { name: "tourcoachmarks-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Panel arka plan rengi" },
    { name: "tourcoachmarks-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "tourcoachmarks-accent-bar", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Üst kenar gradient aksanı" },
    { name: "tourcoachmarks-title-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Tur başlığı metin rengi" },
    { name: "tourcoachmarks-step-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Adım başlığı metin rengi" },
    { name: "tourcoachmarks-step-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/10", tier: "alias", category: "color", description: "Aktif adım butonu arka planı" },
    { name: "tourcoachmarks-step-inactive-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Pasif adım butonu arka planı" },
    { name: "tourcoachmarks-progress-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İlerleme sayacı metin rengi" },
    // Spacing
    { name: "tourcoachmarks-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-6)" },
    { name: "tourcoachmarks-section-gap", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Bölümler arası boşluk (gap-6)" },
    { name: "tourcoachmarks-step-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Adım kartları arası boşluk (gap-2)" },
    // Typography
    { name: "tourcoachmarks-title-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Tur başlığı font boyutu (text-xs, uppercase)" },
    { name: "tourcoachmarks-step-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Adım başlığı font boyutu (text-xl)" },
    { name: "tourcoachmarks-description-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Açıklama metin font boyutu (text-sm)" },
    // Border
    { name: "tourcoachmarks-radius", cssVar: "--radius-3xl", resolvedValue: "32px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[2rem])" },
    { name: "tourcoachmarks-step-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Adım butonu kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "tourcoachmarks-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-2xl)" },
  ],
  JsonViewer: [
    // Color
    { name: "jsonviewer-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Görüntüleyici arka plan rengi (gradient)" },
    { name: "jsonviewer-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Dış kenarlık rengi" },
    { name: "jsonviewer-string-text", cssVar: "--state-info-text", resolvedValue: "var(--state-info-text)", tier: "alias", category: "color", description: "String değer metin rengi" },
    { name: "jsonviewer-number-text", cssVar: "--state-success-text", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Number değer metin rengi" },
    { name: "jsonviewer-boolean-text", cssVar: "--state-warning-text", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Boolean değer metin rengi" },
    { name: "jsonviewer-null-text", cssVar: "--text-subtle", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Null değer metin rengi" },
    { name: "jsonviewer-key-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Anahtar (key) metin rengi" },
    { name: "jsonviewer-node-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Düğüm arka plan rengi" },
    // Spacing
    { name: "jsonviewer-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kapsayıcı iç boşluk (p-4)" },
    { name: "jsonviewer-node-padding-x", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Düğüm yatay iç boşluk (px-4)" },
    { name: "jsonviewer-node-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Düğüm dikey iç boşluk (py-3)" },
    { name: "jsonviewer-indent", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Alt düğüm girinti boşluğu (ml-4 pl-4)" },
    // Typography
    { name: "jsonviewer-key-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Anahtar font boyutu (text-sm)" },
    { name: "jsonviewer-value-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Değer (code) font boyutu (text-xs)" },
    // Border
    { name: "jsonviewer-radius", cssVar: "--radius-3xl", resolvedValue: "28px", tier: "component", category: "border", description: "Kapsayıcı kenar yarıçapı (rounded-[28px])" },
    { name: "jsonviewer-node-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Düğüm kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "jsonviewer-shadow", cssVar: "--shadow-panel", resolvedValue: "0 22px 48px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Kapsayıcı premium gölgesi" },
    // Sizing
    { name: "jsonviewer-max-height", cssVar: "--size-custom", resolvedValue: "420px", tier: "component", category: "sizing", description: "Varsayılan maksimum yükseklik" },
  ],
  AnchorToc: [
    // Color
    { name: "anchortoc-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Navigasyon arka plan rengi" },
    { name: "anchortoc-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Dış kenarlık rengi" },
    { name: "anchortoc-title-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "anchortoc-count-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sayaç rozet arka plan rengi" },
    { name: "anchortoc-active-bg", cssVar: "--accent-soft", resolvedValue: "rgba(79,70,229,0.06)", tier: "alias", category: "color", description: "Aktif öğe arka plan rengi" },
    { name: "anchortoc-active-border", cssVar: "--accent-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif öğe kenarlık rengi" },
    { name: "anchortoc-item-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif öğe metin rengi" },
    { name: "anchortoc-item-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Öğe hover arka plan rengi" },
    // Spacing
    { name: "anchortoc-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Navigasyon iç boşluk (p-4)" },
    { name: "anchortoc-item-padding-comfortable", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Rahat yoğunluk öğe iç boşluk (p-3)" },
    { name: "anchortoc-item-padding-compact", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Sıkı yoğunluk öğe iç boşluk (p-2.5)" },
    { name: "anchortoc-level2-indent", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "2. seviye girinti boşluğu (pl-4)" },
    { name: "anchortoc-level3-indent", cssVar: "--spacing-8", resolvedValue: "32px", tier: "global", category: "spacing", description: "3. seviye girinti boşluğu (pl-8)" },
    // Typography
    { name: "anchortoc-title-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Başlık font boyutu (uppercase, tracking)" },
    { name: "anchortoc-item-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Öğe font kalınlığı (font-medium)" },
    // Border
    { name: "anchortoc-radius", cssVar: "--radius-3xl", resolvedValue: "28px", tier: "component", category: "border", description: "Navigasyon kenar yarıçapı (rounded-[28px])" },
    { name: "anchortoc-item-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Öğe kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "anchortoc-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Navigasyon gölgesi (shadow-xs)" },
  ],
  Tree: [
    // Color
    { name: "tree-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Ağaç kapsayıcı arka plan rengi" },
    { name: "tree-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kapsayıcı kenarlık rengi" },
    { name: "tree-node-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Düğüm kart arka plan rengi" },
    { name: "tree-node-info-border", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border)", tier: "alias", category: "color", description: "Bilgi tonu düğüm kenarlık rengi" },
    { name: "tree-node-success-border", cssVar: "--state-success-border", resolvedValue: "var(--state-success-border)", tier: "alias", category: "color", description: "Başarı tonu düğüm kenarlık rengi" },
    { name: "tree-node-warning-border", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-border)", tier: "alias", category: "color", description: "Uyarı tonu düğüm kenarlık rengi" },
    { name: "tree-node-danger-border", cssVar: "--state-danger-border", resolvedValue: "var(--state-danger-border)", tier: "alias", category: "color", description: "Tehlike tonu düğüm kenarlık rengi" },
    { name: "tree-node-selected-ring", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border)/60", tier: "alias", category: "color", description: "Seçili düğüm halka rengi" },
    { name: "tree-label-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Düğüm etiket metin rengi" },
    { name: "tree-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Düğüm açıklama metin rengi" },
    { name: "tree-connector-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/70", tier: "alias", category: "color", description: "Alt düğüm bağlantı çizgisi rengi" },
    // Spacing
    { name: "tree-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kapsayıcı iç boşluk (p-4)" },
    { name: "tree-node-px-comfortable", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Rahat yoğunluk düğüm yatay iç boşluk (px-4)" },
    { name: "tree-node-py-comfortable", cssVar: "--spacing-3.5", resolvedValue: "14px", tier: "global", category: "spacing", description: "Rahat yoğunluk düğüm dikey iç boşluk (py-3.5)" },
    { name: "tree-child-indent", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Alt düğüm girinti boşluğu (pl-4)" },
    // Typography
    { name: "tree-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Düğüm etiket font boyutu (text-sm)" },
    { name: "tree-label-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Düğüm etiket font kalınlığı" },
    // Border
    { name: "tree-radius", cssVar: "--radius-3xl", resolvedValue: "26px", tier: "component", category: "border", description: "Kapsayıcı kenar yarıçapı (rounded-[26px])" },
    { name: "tree-node-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Düğüm kart kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "tree-node-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Düğüm kart gölgesi (shadow-xs)" },
    // Sizing
    { name: "tree-toggle-size", cssVar: "--size-7", resolvedValue: "28px", tier: "component", category: "sizing", description: "Genişlet/daralt butonu boyutu (size-7)" },
  ],
  AgGridServer: [
    // Color
    { name: "aggridserver-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Grid kapsayıcı arka plan rengi" },
    { name: "aggridserver-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Grid dış kenarlık rengi" },
    { name: "aggridserver-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sütun başlık arka plan rengi" },
    { name: "aggridserver-header-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sütun başlık metin rengi" },
    { name: "aggridserver-row-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)/60", tier: "alias", category: "color", description: "Satır hover arka plan rengi" },
    { name: "aggridserver-cell-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Hücre metin rengi" },
    { name: "aggridserver-loading-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Yükleniyor metin rengi" },
    // Spacing
    { name: "aggridserver-cell-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Hücre yatay iç boşluk (px-4)" },
    { name: "aggridserver-cell-py", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Hücre dikey iç boşluk (py-2)" },
    // Typography
    { name: "aggridserver-cell-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Hücre font boyutu (text-sm)" },
    { name: "aggridserver-header-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    // Border
    { name: "aggridserver-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Grid kenar yarıçapı (rounded-lg)" },
    { name: "aggridserver-cell-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "border", description: "Hücre kenarlık rengi" },
    // Sizing
    { name: "aggridserver-height", cssVar: "--size-custom", resolvedValue: "600px", tier: "component", category: "sizing", description: "Varsayılan grid yüksekliği" },
  ],
  EntityGridTemplate: [
    // Color
    { name: "entitygrid-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Grid kapsayıcı arka plan rengi" },
    { name: "entitygrid-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Grid dış kenarlık rengi" },
    { name: "entitygrid-toolbar-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Araç çubuğu arka plan rengi" },
    { name: "entitygrid-toolbar-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Araç çubuğu metin rengi" },
    { name: "entitygrid-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sütun başlık arka plan rengi" },
    { name: "entitygrid-row-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)/60", tier: "alias", category: "color", description: "Satır hover arka plan rengi" },
    { name: "entitygrid-row-selected-bg", cssVar: "--accent-soft", resolvedValue: "rgba(79,70,229,0.06)", tier: "alias", category: "color", description: "Seçili satır arka plan rengi" },
    { name: "entitygrid-pagination-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sayfalama metin rengi" },
    // Spacing
    { name: "entitygrid-toolbar-padding", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Araç çubuğu iç boşluk (p-3)" },
    { name: "entitygrid-toolbar-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Araç çubuğu elemanları arası boşluk (gap-2)" },
    { name: "entitygrid-cell-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Hücre yatay iç boşluk (px-4)" },
    // Typography
    { name: "entitygrid-cell-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Hücre font boyutu (text-sm)" },
    { name: "entitygrid-header-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    // Border
    { name: "entitygrid-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Grid kenar yarıçapı (rounded-lg)" },
    // Sizing
    { name: "entitygrid-min-height", cssVar: "--size-custom", resolvedValue: "400px", tier: "component", category: "sizing", description: "Minimum grid yüksekliği" },
  ],
  TableSimple: [
    // Color
    { name: "tablesimple-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Tablo arka plan rengi" },
    { name: "tablesimple-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Tablo dış kenarlık rengi" },
    { name: "tablesimple-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Başlık satırı arka plan rengi" },
    { name: "tablesimple-header-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Başlık metin rengi (uppercase)" },
    { name: "tablesimple-cell-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Hücre metin rengi" },
    { name: "tablesimple-cell-secondary-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İkincil hücre metin rengi" },
    { name: "tablesimple-stripe-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)/60", tier: "alias", category: "color", description: "Zebra şerit satır arka plan rengi" },
    { name: "tablesimple-caption-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Tablo başlığı metin rengi" },
    // Spacing
    { name: "tablesimple-px-comfortable", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Rahat yoğunluk yatay iç boşluk (px-4)" },
    { name: "tablesimple-py-comfortable", cssVar: "--spacing-3.5", resolvedValue: "14px", tier: "global", category: "spacing", description: "Rahat yoğunluk dikey iç boşluk (py-3.5)" },
    { name: "tablesimple-py-compact", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Sıkı yoğunluk dikey iç boşluk (py-2.5)" },
    // Typography
    { name: "tablesimple-header-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Başlık font boyutu (uppercase, tracking)" },
    { name: "tablesimple-cell-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Hücre font boyutu (text-sm)" },
    { name: "tablesimple-caption-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Tablo başlığı font boyutu (text-base)" },
    // Border
    { name: "tablesimple-radius", cssVar: "--radius-3xl", resolvedValue: "26px", tier: "component", category: "border", description: "Tablo kenar yarıçapı (rounded-[26px])" },
    // Shadow
    { name: "tablesimple-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Tablo gölgesi (shadow-xs)" },
  ],
  EntitySummaryBlock: [
    // Color
    { name: "entitysummary-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Kart arka plan rengi (gradient)" },
    { name: "entitysummary-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/80", tier: "alias", category: "color", description: "Kart kenarlık rengi" },
    { name: "entitysummary-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "entitysummary-subtitle-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Alt başlık metin rengi" },
    { name: "entitysummary-divider", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/70", tier: "alias", category: "color", description: "Üst bölüm ayırıcı çizgi rengi" },
    { name: "entitysummary-shimmer", cssVar: "--color-white", resolvedValue: "rgba(255,255,255,0.90)", tier: "component", category: "color", description: "Üst kenar ışık çizgisi rengi" },
    // Spacing
    { name: "entitysummary-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Kart iç boşluk (p-6)" },
    { name: "entitysummary-header-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Avatar ve metin arası boşluk (gap-4)" },
    { name: "entitysummary-header-pb", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Üst bölüm alt boşluk (pb-5)" },
    // Typography
    { name: "entitysummary-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Başlık font boyutu (text-xl)" },
    { name: "entitysummary-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    { name: "entitysummary-subtitle-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Alt başlık font boyutu (text-sm)" },
    // Border
    { name: "entitysummary-radius", cssVar: "--radius-4xl", resolvedValue: "32px", tier: "component", category: "border", description: "Kart kenar yarıçapı (rounded-[32px])" },
    // Shadow
    { name: "entitysummary-shadow", cssVar: "--shadow-panel", resolvedValue: "0 24px 52px -36px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Premium kart gölgesi" },
  ],
  ReportFilterPanel: [
    // Color
    { name: "reportfilter-submit-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Filtrele butonu arka plan rengi" },
    { name: "reportfilter-submit-text", cssVar: "--action-primary-text", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Filtrele butonu metin rengi" },
    { name: "reportfilter-reset-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Sıfırla butonu arka plan rengi" },
    { name: "reportfilter-reset-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sıfırla butonu metin rengi" },
    { name: "reportfilter-reset-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Sıfırla butonu kenarlık rengi" },
    { name: "reportfilter-reset-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sıfırla butonu hover arka plan rengi" },
    { name: "reportfilter-focus-ring", cssVar: "--selection-outline", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Buton odaklanma halka rengi" },
    // Spacing
    { name: "reportfilter-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Filtre elemanları arası boşluk (gap-3)" },
    { name: "reportfilter-button-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Buton yatay iç boşluk (px-4)" },
    { name: "reportfilter-button-py", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Buton dikey iç boşluk (py-2)" },
    { name: "reportfilter-field-min-width", cssVar: "--size-custom", resolvedValue: "200px", tier: "component", category: "spacing", description: "Filtre alanı minimum genişlik (min-w-[200px])" },
    // Typography
    { name: "reportfilter-button-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Buton font boyutu (text-sm)" },
    { name: "reportfilter-button-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Buton font kalınlığı" },
    // Border
    { name: "reportfilter-button-radius", cssVar: "--radius-md", resolvedValue: "6px", tier: "global", category: "border", description: "Buton kenar yarıçapı (rounded-md)" },
  ],
  DetailSectionTabs: [
    // Color
    { name: "detailsectiontabs-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)/95", tier: "alias", category: "color", description: "Sekme çubuğu arka plan rengi" },
    { name: "detailsectiontabs-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Sekme çubuğu kenarlık rengi" },
    { name: "detailsectiontabs-active-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aktif sekme arka plan rengi" },
    { name: "detailsectiontabs-active-ring", cssVar: "--border-default", resolvedValue: "var(--border-default)/80", tier: "alias", category: "color", description: "Aktif sekme halka rengi" },
    { name: "detailsectiontabs-label-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Sekme etiket metin rengi" },
    { name: "detailsectiontabs-hint-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)/90", tier: "alias", category: "color", description: "Bilgi ipucu ikon arka planı" },
    { name: "detailsectiontabs-hint-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Bilgi ipucu ikon kenarlık rengi" },
    // Spacing
    { name: "detailsectiontabs-padding", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Sekme çubuğu iç boşluk (p-1.5)" },
    { name: "detailsectiontabs-item-px", cssVar: "--spacing-3.5", resolvedValue: "14px", tier: "global", category: "spacing", description: "Sekme öğesi yatay iç boşluk (px-3.5)" },
    { name: "detailsectiontabs-item-py", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Sekme öğesi dikey iç boşluk (py-2)" },
    { name: "detailsectiontabs-gap", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Sekmeler arası boşluk (gap-1.5)" },
    // Typography
    { name: "detailsectiontabs-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Sekme etiket font boyutu (text-sm)" },
    { name: "detailsectiontabs-label-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Sekme etiket font kalınlığı" },
    { name: "detailsectiontabs-badge-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Rozet font boyutu (text-[11px])" },
    // Border
    { name: "detailsectiontabs-radius", cssVar: "--radius-3xl", resolvedValue: "20px", tier: "component", category: "border", description: "Sekme çubuğu kenar yarıçapı (rounded-[20px])" },
    // Shadow
    { name: "detailsectiontabs-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Sekme çubuğu gölgesi (shadow-xs)" },
    { name: "detailsectiontabs-active-shadow", cssVar: "--shadow-custom", resolvedValue: "0 14px 28px -18px rgba(38,28,89,0.55)", tier: "component", category: "shadow", description: "Aktif sekme gölgesi" },
  ],
  SectionTabs: [
    // Color
    { name: "sectiontabs-root-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)/95", tier: "alias", category: "color", description: "Kök kapsayıcı arka plan rengi" },
    { name: "sectiontabs-root-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kök kenarlık rengi" },
    { name: "sectiontabs-active-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aktif sekme arka plan rengi" },
    { name: "sectiontabs-active-ring", cssVar: "--border-default", resolvedValue: "var(--border-default)/80", tier: "alias", category: "color", description: "Aktif sekme halka rengi" },
    { name: "sectiontabs-active-accent", cssVar: "--accent-soft", resolvedValue: "rgba(79,70,229,0.06)/70", tier: "alias", category: "color", description: "Aktif sekme aksanlı iç halka" },
    { name: "sectiontabs-label-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Sekme etiket metin rengi" },
    { name: "sectiontabs-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Sekme açıklama metin rengi" },
    { name: "sectiontabs-badge-bg", cssVar: "--accent-soft", resolvedValue: "rgba(79,70,229,0.06)", tier: "alias", category: "color", description: "Rozet arka plan rengi" },
    // Spacing
    { name: "sectiontabs-root-padding", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Kök iç boşluk (p-1.5)" },
    { name: "sectiontabs-item-compact-px", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Sıkı yoğunluk yatay iç boşluk (px-3)" },
    { name: "sectiontabs-item-compact-py", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Sıkı yoğunluk dikey iç boşluk (py-1.5)" },
    { name: "sectiontabs-item-comfortable-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Rahat yoğunluk yatay iç boşluk (px-4)" },
    { name: "sectiontabs-item-comfortable-py", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Rahat yoğunluk dikey iç boşluk (py-2.5)" },
    // Typography
    { name: "sectiontabs-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Etiket font boyutu (text-sm)" },
    { name: "sectiontabs-label-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Etiket font kalınlığı" },
    { name: "sectiontabs-badge-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Rozet font boyutu (text-[11px])" },
    { name: "sectiontabs-description-size", cssVar: "--font-size-2xs", resolvedValue: "11px", tier: "global", category: "typography", description: "Açıklama font boyutu (text-[11px])" },
    // Border
    { name: "sectiontabs-root-radius", cssVar: "--radius-3xl", resolvedValue: "20px", tier: "component", category: "border", description: "Kök kenar yarıçapı (rounded-[20px])" },
    // Shadow
    { name: "sectiontabs-root-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Kök kapsayıcı gölgesi (shadow-xs)" },
    { name: "sectiontabs-active-shadow", cssVar: "--shadow-custom", resolvedValue: "0 14px 28px -18px rgba(38,28,89,0.55)", tier: "component", category: "shadow", description: "Aktif sekme gölgesi" },
    // Motion
    { name: "sectiontabs-description-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease-out", tier: "global", category: "motion", description: "Açıklama göster/gizle geçiş animasyonu" },
  ],
  ActionBar: [
    // Color
    { name: "actionbar-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Araç çubuğu arka plan rengi" },
    { name: "actionbar-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Araç çubuğu kenarlık rengi" },
    { name: "actionbar-item-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Öğe metin rengi" },
    { name: "actionbar-item-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Öğe hover arka plan rengi" },
    { name: "actionbar-active-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Aktif öğe arka plan rengi" },
    { name: "actionbar-active-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aktif öğe metin rengi" },
    { name: "actionbar-badge-bg", cssVar: "--accent-soft", resolvedValue: "rgba(79,70,229,0.06)", tier: "alias", category: "color", description: "Seçim rozeti arka plan rengi" },
    { name: "actionbar-divider", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Grup ayırıcı rengi" },
    // Spacing
    { name: "actionbar-padding", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Çubuk iç boşluk (p-1.5)" },
    { name: "actionbar-item-px", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Öğe yatay iç boşluk (px-3)" },
    { name: "actionbar-item-py", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Öğe dikey iç boşluk (py-2)" },
    { name: "actionbar-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Öğeler arası boşluk (gap-1)" },
    // Typography
    { name: "actionbar-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Öğe etiket font boyutu (text-sm)" },
    { name: "actionbar-label-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Öğe etiket font kalınlığı" },
    // Border
    { name: "actionbar-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Çubuk kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "actionbar-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Çubuk gölgesi (shadow-xs)" },
  ],
  ApprovalReview: [
    // Color
    { name: "approval-review-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "İnceleme paneli arka plan rengi" },
    { name: "approval-review-bg-gradient", cssVar: "--surface-muted", resolvedValue: "rgba(245,246,255,0.94)", tier: "alias", category: "color", description: "İnceleme paneli gradient bitiş rengi" },
    { name: "approval-review-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "İnceleme paneli kenarlık rengi" },
    { name: "approval-review-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "approval-review-ring", cssVar: "--color-white-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Dış halka rengi (ring)" },
    // Spacing
    { name: "approval-review-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "approval-review-grid-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Grid öğeleri arası boşluk (gap-4)" },
    { name: "approval-review-title-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Başlık-açıklama arası boşluk (mt-1)" },
    // Typography
    { name: "approval-review-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "approval-review-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    { name: "approval-review-desc-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Açıklama font boyutu (text-sm)" },
    // Border
    { name: "approval-review-radius", cssVar: "--radius-3xl", resolvedValue: "32px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[32px])" },
    // Shadow
    { name: "approval-review-shadow", cssVar: "--shadow-xl", resolvedValue: "0 24px 52px -36px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel gölgesi (premium surface)" },
  ],
  ApprovalCheckpoint: [
    // Color
    { name: "checkpoint-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Kontrol noktası arka plan rengi" },
    { name: "checkpoint-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kontrol noktası kenarlık rengi" },
    { name: "checkpoint-status-pending", cssVar: "--color-state-warning", resolvedValue: "var(--color-state-warning)", tier: "alias", category: "color", description: "Bekleyen durum rozet rengi" },
    { name: "checkpoint-status-approved", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "Onaylı durum rozet rengi" },
    { name: "checkpoint-status-rejected", cssVar: "--color-state-danger", resolvedValue: "var(--color-state-danger)", tier: "alias", category: "color", description: "Reddedilmiş durum rozet rengi" },
    { name: "checkpoint-ring", cssVar: "--color-white-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Dış halka rengi (ring)" },
    // Spacing
    { name: "checkpoint-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "checkpoint-header-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlık bölümü öğe boşluğu (gap-3)" },
    { name: "checkpoint-badge-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Rozet arası boşluk (gap-2)" },
    { name: "checkpoint-actions-mt", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Aksiyonlar üst boşluğu (mt-5)" },
    // Typography
    { name: "checkpoint-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    { name: "checkpoint-title-tracking", cssVar: "--tracking-tight", resolvedValue: "-0.03em", tier: "component", category: "typography", description: "Başlık harf aralığı (tracking-[-0.03em])" },
    // Border
    { name: "checkpoint-radius", cssVar: "--radius-3xl", resolvedValue: "32px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[32px])" },
    // Shadow
    { name: "checkpoint-shadow", cssVar: "--shadow-xl", resolvedValue: "0 24px 52px -36px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel gölgesi (premium surface)" },
  ],
  AIGuidedAuthoring: [
    // Color
    { name: "ai-authoring-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "AI yazarlık paneli arka plan rengi" },
    { name: "ai-authoring-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "ai-authoring-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "ai-authoring-confidence-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Güven skoru kutusu arka plan rengi" },
    // Spacing
    { name: "ai-authoring-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "ai-authoring-grid-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Grid öğeleri arası boşluk (gap-4)" },
    { name: "ai-authoring-header-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlık bölümü öğe boşluğu (gap-3)" },
    { name: "ai-authoring-confidence-px", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Güven kutusu yatay iç boşluk (px-4)" },
    { name: "ai-authoring-confidence-py", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Güven kutusu dikey iç boşluk (py-3)" },
    // Typography
    { name: "ai-authoring-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "ai-authoring-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    { name: "ai-authoring-confidence-label-size", cssVar: "--font-size-xs", resolvedValue: "11px", tier: "component", category: "typography", description: "Güven etiketi font boyutu" },
    // Border
    { name: "ai-authoring-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "global", category: "border", description: "Panel kenar yarıçapı (rounded-3xl)" },
    { name: "ai-authoring-confidence-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Güven kutusu kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "ai-authoring-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-xs)" },
  ],
  AIActionAuditTimeline: [
    // Color
    { name: "audit-timeline-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Denetim zaman çizelgesi arka plan rengi" },
    { name: "audit-timeline-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "audit-timeline-dot-active", cssVar: "--accent-primary", resolvedValue: "var(--accent-primary)", tier: "alias", category: "color", description: "Seçili zaman noktası rengi" },
    { name: "audit-timeline-dot-default", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Varsayılan zaman noktası rengi" },
    { name: "audit-timeline-line", cssVar: "--border-subtle", resolvedValue: "rgba(203,213,225,0.65)", tier: "component", category: "color", description: "Bağlantı çizgisi rengi" },
    { name: "audit-timeline-actor-ai", cssVar: "--color-state-info", resolvedValue: "var(--color-state-info)", tier: "alias", category: "color", description: "AI aktörü rozet rengi" },
    { name: "audit-timeline-actor-human", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "İnsan aktörü rozet rengi" },
    // Spacing
    { name: "audit-timeline-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "audit-timeline-item-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Zaman öğeleri arası boşluk (gap-3)" },
    { name: "audit-timeline-content-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Nokta-içerik arası boşluk (gap-4)" },
    // Typography
    { name: "audit-timeline-title-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Öğe başlığı font boyutu (text-sm)" },
    { name: "audit-timeline-timestamp-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Zaman damgası font boyutu (text-xs)" },
    // Border
    { name: "audit-timeline-radius", cssVar: "--radius-3xl", resolvedValue: "32px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[32px])" },
    { name: "audit-timeline-item-radius", cssVar: "--radius-2xl", resolvedValue: "24px", tier: "component", category: "border", description: "Öğe kartı kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "audit-timeline-shadow", cssVar: "--shadow-xl", resolvedValue: "0 24px 52px -36px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel gölgesi (premium surface)" },
  ],
  PromptComposer: [
    // Color
    { name: "prompt-composer-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Prompt düzenleyici arka plan rengi" },
    { name: "prompt-composer-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "prompt-composer-contract-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sözleşme kartı arka plan rengi" },
    { name: "prompt-composer-scope-active", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif kapsam butonu rengi" },
    { name: "prompt-composer-guardrail-badge", cssVar: "--color-state-warning", resolvedValue: "var(--color-state-warning)", tier: "alias", category: "color", description: "Koruma kuralı rozet rengi" },
    // Spacing
    { name: "prompt-composer-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "prompt-composer-grid-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Grid öğeleri arası boşluk (gap-4)" },
    { name: "prompt-composer-field-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Form alanları arası boşluk (gap-4)" },
    { name: "prompt-composer-contract-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Sözleşme kartı iç boşluk (p-4)" },
    // Typography
    { name: "prompt-composer-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Başlık font boyutu (text-base)" },
    { name: "prompt-composer-title-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı" },
    // Border
    { name: "prompt-composer-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "global", category: "border", description: "Panel kenar yarıçapı (rounded-3xl)" },
    { name: "prompt-composer-contract-radius", cssVar: "--radius-2xl", resolvedValue: "24px", tier: "component", category: "border", description: "Sözleşme kartı kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "prompt-composer-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-xs)" },
  ],
  RecommendationCard: [
    // Color
    { name: "recommendation-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Öneri kartı arka plan rengi" },
    { name: "recommendation-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kart kenarlık rengi" },
    { name: "recommendation-tone-info", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border)", tier: "alias", category: "color", description: "Bilgi tonu kenarlık rengi" },
    { name: "recommendation-tone-success", cssVar: "--state-success-border", resolvedValue: "var(--state-success-border)", tier: "alias", category: "color", description: "Başarı tonu kenarlık rengi" },
    { name: "recommendation-tone-warning", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-border)", tier: "alias", category: "color", description: "Uyarı tonu kenarlık rengi" },
    { name: "recommendation-rationale-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Gerekçe bölümü arka plan rengi" },
    // Spacing
    { name: "recommendation-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Kart iç boşluk (p-5)" },
    { name: "recommendation-header-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlık bölümü öğe boşluğu (gap-3)" },
    { name: "recommendation-badge-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Rozet arası boşluk (gap-2)" },
    { name: "recommendation-actions-mt", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Aksiyonlar üst boşluğu (mt-5)" },
    // Typography
    { name: "recommendation-title-preset", cssVar: "--font-preset-title", resolvedValue: "preset: title", tier: "component", category: "typography", description: "Başlık font ön ayarı (Text preset=title)" },
    { name: "recommendation-rationale-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Gerekçe metin font boyutu (text-sm)" },
    // Border
    { name: "recommendation-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "global", category: "border", description: "Kart kenar yarıçapı (rounded-3xl)" },
    { name: "recommendation-rationale-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Gerekçe bölümü kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "recommendation-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Kart gölgesi (shadow-xs)" },
  ],
  ConfidenceBadge: [
    // Color
    { name: "confidence-low-tone", cssVar: "--color-state-warning", resolvedValue: "var(--color-state-warning)", tier: "alias", category: "color", description: "Düşük güven rozet rengi (warning)" },
    { name: "confidence-medium-tone", cssVar: "--color-state-info", resolvedValue: "var(--color-state-info)", tier: "alias", category: "color", description: "Orta güven rozet rengi (info)" },
    { name: "confidence-high-tone", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "Yüksek güven rozet rengi (success)" },
    { name: "confidence-very-high-tone", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "Çok yüksek güven rozet rengi (success)" },
    // Typography
    { name: "confidence-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Rozet etiket font boyutu" },
    { name: "confidence-score-format", cssVar: "--font-variant-numeric", resolvedValue: "tabular-nums", tier: "component", category: "typography", description: "Skor sayısal format (tabular-nums)" },
    // Sizing
    { name: "confidence-badge-height", cssVar: "--size-badge", resolvedValue: "24px", tier: "component", category: "sizing", description: "Rozet yüksekliği" },
  ],
  CitationPanel: [
    // Color
    { name: "citation-panel-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Atıf paneli arka plan rengi" },
    { name: "citation-panel-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "citation-panel-item-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.9)", tier: "alias", category: "color", description: "Atıf öğesi arka plan rengi" },
    { name: "citation-panel-item-selected-bg", cssVar: "--accent-soft", resolvedValue: "rgba(238,242,255,0.98)", tier: "alias", category: "color", description: "Seçili atıf öğesi arka plan rengi" },
    { name: "citation-panel-kind-policy", cssVar: "--color-state-info", resolvedValue: "var(--color-state-info)", tier: "alias", category: "color", description: "Politika türü rozet rengi" },
    { name: "citation-panel-kind-code", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "Kod türü rozet rengi" },
    { name: "citation-panel-kind-log", cssVar: "--color-state-warning", resolvedValue: "var(--color-state-warning)", tier: "alias", category: "color", description: "Log türü rozet rengi" },
    { name: "citation-panel-ring", cssVar: "--color-white-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Dış halka rengi (ring)" },
    // Spacing
    { name: "citation-panel-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "citation-panel-item-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Atıf öğeleri arası boşluk (gap-3)" },
    { name: "citation-panel-item-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Atıf öğesi iç boşluk (px-4 py-4)" },
    // Typography
    { name: "citation-panel-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Panel başlık font boyutu (text-base)" },
    { name: "citation-panel-item-title-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Atıf öğesi başlık font boyutu (text-sm)" },
    // Border
    { name: "citation-panel-radius", cssVar: "--radius-3xl", resolvedValue: "32px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[32px])" },
    { name: "citation-panel-item-radius", cssVar: "--radius-2xl", resolvedValue: "26px", tier: "component", category: "border", description: "Atıf öğesi kenar yarıçapı (rounded-[26px])" },
    { name: "citation-panel-excerpt-radius", cssVar: "--radius-xl", resolvedValue: "20px", tier: "component", category: "border", description: "Alıntı bölümü kenar yarıçapı (rounded-[20px])" },
    // Shadow
    { name: "citation-panel-shadow", cssVar: "--shadow-xl", resolvedValue: "0 24px 52px -36px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel gölgesi (premium surface)" },
    { name: "citation-panel-item-shadow", cssVar: "--shadow-md", resolvedValue: "0 16px 30px -28px rgba(15,23,42,0.16)", tier: "component", category: "shadow", description: "Atıf öğesi gölgesi" },
  ],
  CommandHeader: [
    // Color
    { name: "command-header-bg", cssVar: "--surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Komut başlığı arka plan rengi" },
    { name: "command-header-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Başlık alt kenarlık rengi" },
    { name: "command-header-search-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Arama alanı arka plan rengi" },
    { name: "command-header-search-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Arama metni rengi" },
    { name: "command-header-search-placeholder", cssVar: "--text-tertiary", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Arama placeholder rengi" },
    { name: "command-header-favorite-active", cssVar: "--color-state-warning", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Aktif favori yıldız rengi" },
    { name: "command-header-recent-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Son kullanılanlar bölümü arka planı" },
    // Spacing
    { name: "command-header-padding-x", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık yatay iç boşluk" },
    { name: "command-header-padding-y", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlık dikey iç boşluk" },
    { name: "command-header-search-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Arama ikonu ve metin arası boşluk" },
    // Typography
    { name: "command-header-search-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Arama alanı yazı boyutu" },
    { name: "command-header-label-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Menü etiket yazı boyutu" },
    // Border
    { name: "command-header-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Arama alanı kenar yarıçapı" },
    // Shadow
    { name: "command-header-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Başlık gölgesi" },
  ],
  CommandWorkspace: [
    // Color
    { name: "command-workspace-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Komut çalışma alanı arka planı" },
    { name: "command-workspace-sidebar-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Bağlam paneli arka plan rengi" },
    { name: "command-workspace-search-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Arama çubuğu arka planı" },
    { name: "command-workspace-result-hover", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Sonuç satırı hover arka planı" },
    { name: "command-workspace-queue-bg", cssVar: "--accent-soft", resolvedValue: "rgba(238,242,255,0.98)", tier: "alias", category: "color", description: "Son işler kuyruğu arka planı" },
    // Spacing
    { name: "command-workspace-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Çalışma alanı iç boşluk" },
    { name: "command-workspace-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Panel blokları arası boşluk" },
    { name: "command-workspace-result-padding", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Sonuç satırı iç boşluk" },
    // Typography
    { name: "command-workspace-title-size", cssVar: "--font-size-lg", resolvedValue: "18px", tier: "global", category: "typography", description: "Çalışma alanı başlık boyutu" },
    { name: "command-workspace-result-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Sonuç metni boyutu" },
    // Border
    { name: "command-workspace-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Çalışma alanı kenar yarıçapı" },
    { name: "command-workspace-sidebar-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Bağlam paneli kenar yarıçapı" },
    // Shadow
    { name: "command-workspace-shadow", cssVar: "--shadow-md", resolvedValue: "0 4px 6px -1px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Çalışma alanı gölgesi" },
  ],
  CrudTemplate: [
    // Color
    { name: "crud-template-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "CRUD şablon arka planı" },
    { name: "crud-template-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Başlık alanı arka planı" },
    { name: "crud-template-filter-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Filtre çubuğu arka planı" },
    { name: "crud-template-row-hover", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Tablo satırı hover rengi" },
    { name: "crud-template-row-selected", cssVar: "--accent-soft", resolvedValue: "rgba(238,242,255,0.98)", tier: "alias", category: "color", description: "Seçili satır arka planı" },
    // Spacing
    { name: "crud-template-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Şablon dış boşluk" },
    { name: "crud-template-header-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Başlık elemanları arası boşluk" },
    { name: "crud-template-filter-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Filtre elemanları arası boşluk" },
    // Typography
    { name: "crud-template-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Sayfa başlık boyutu" },
    { name: "crud-template-summary-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Özet metrik boyutu" },
    // Border
    { name: "crud-template-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Şablon kart kenar yarıçapı" },
    { name: "crud-template-table-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "border", description: "Tablo kenarlık rengi" },
    // Sizing
    { name: "crud-template-filter-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Filtre çubuğu yüksekliği" },
  ],
  DashboardTemplate: [
    // Color
    { name: "dashboard-template-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Dashboard arka planı" },
    { name: "dashboard-template-kpi-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "KPI kart arka planı" },
    { name: "dashboard-template-kpi-accent", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "KPI vurgu rengi" },
    { name: "dashboard-template-card-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Özet kart arka planı" },
    { name: "dashboard-template-card-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Özet kart kenarlık rengi" },
    // Spacing
    { name: "dashboard-template-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Dashboard iç boşluk" },
    { name: "dashboard-template-card-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kartlar arası boşluk" },
    { name: "dashboard-template-kpi-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "KPI kart iç boşluk" },
    // Typography
    { name: "dashboard-template-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Dashboard başlık boyutu" },
    { name: "dashboard-template-kpi-value-size", cssVar: "--font-size-2xl", resolvedValue: "24px", tier: "global", category: "typography", description: "KPI değer yazı boyutu" },
    { name: "dashboard-template-kpi-label-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "KPI etiket yazı boyutu" },
    // Border
    { name: "dashboard-template-card-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Kart kenar yarıçapı" },
    // Shadow
    { name: "dashboard-template-card-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Kart gölgesi" },
  ],
  DetailTemplate: [
    // Color
    { name: "detail-template-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Detay şablon arka planı" },
    { name: "detail-template-header-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Varlık başlık alanı arka planı" },
    { name: "detail-template-rail-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Inspector rail arka planı" },
    { name: "detail-template-section-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Bölüm ayırıcı kenarlık rengi" },
    { name: "detail-template-metadata-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Metadata etiket rengi" },
    // Spacing
    { name: "detail-template-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Şablon iç boşluk" },
    { name: "detail-template-section-gap", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Bölümler arası boşluk" },
    { name: "detail-template-rail-width", cssVar: "--size-72", resolvedValue: "288px", tier: "component", category: "spacing", description: "Inspector rail genişliği" },
    // Typography
    { name: "detail-template-entity-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Varlık başlık boyutu" },
    { name: "detail-template-section-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Bölüm başlık boyutu" },
    { name: "detail-template-metadata-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Metadata yazı boyutu" },
    // Border
    { name: "detail-template-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Şablon kart kenar yarıçapı" },
    { name: "detail-template-rail-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "component", category: "border", description: "Rail kenar yarıçapı" },
  ],
};
