import type { TokenEntry } from "./types";

export const tokenMap4: Record<string, TokenEntry[]> = {
  SettingsTemplate: [
    // Color
    { name: "settings-template-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Ayarlar şablon arka planı" },
    { name: "settings-template-section-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Ayar bölümü arka planı" },
    { name: "settings-template-aside-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Kural paneli arka planı" },
    { name: "settings-template-tab-active", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif sekme vurgu rengi" },
    { name: "settings-template-tab-inactive", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Pasif sekme metin rengi" },
    // Spacing
    { name: "settings-template-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Şablon iç boşluk" },
    { name: "settings-template-section-gap", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Ayar bölümleri arası boşluk" },
    { name: "settings-template-field-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Form alanları arası boşluk" },
    // Typography
    { name: "settings-template-title-size", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Ayarlar başlık boyutu" },
    { name: "settings-template-section-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Bölüm başlık boyutu" },
    { name: "settings-template-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Alan etiket boyutu" },
    // Border
    { name: "settings-template-section-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Bölüm kenar yarıçapı" },
    // Shadow
    { name: "settings-template-section-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Bölüm gölgesi" },
  ],
  ThemePresetCompare: [
    // Color
    { name: "preset-compare-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Karşılaştırma paneli arka planı" },
    { name: "preset-compare-card-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Preset kart arka planı" },
    { name: "preset-compare-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "preset-compare-axis-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Eksen satır arka planı" },
    { name: "preset-compare-text-primary", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Birincil metin rengi" },
    { name: "preset-compare-text-secondary", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İkincil metin rengi" },
    // Spacing
    { name: "preset-compare-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "preset-compare-card-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kart iç boşluk (p-4)" },
    { name: "preset-compare-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Grid blokları arası boşluk (gap-4)" },
    // Typography
    { name: "preset-compare-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Panel başlık boyutu (text-base)" },
    { name: "preset-compare-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Preset etiket boyutu (text-sm)" },
    { name: "preset-compare-axis-label-size", cssVar: "--font-size-xs-alt", resolvedValue: "11px", tier: "component", category: "typography", description: "Eksen üst etiket boyutu (text-[11px])" },
    // Border
    { name: "preset-compare-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-3xl)" },
    { name: "preset-compare-card-radius", cssVar: "--radius-2xl", resolvedValue: "24px", tier: "component", category: "border", description: "Kart kenar yarıçapı (rounded-[24px])" },
    { name: "preset-compare-axis-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "component", category: "border", description: "Eksen satır kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "preset-compare-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Panel gölgesi (shadow-xs)" },
  ],
  ThemePresetGallery: [
    // Color
    { name: "preset-gallery-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Galeri arka planı" },
    { name: "preset-gallery-card-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Preset kart arka planı" },
    { name: "preset-gallery-card-selected-bg", cssVar: "--action-primary-soft", resolvedValue: "rgba(238,242,255,0.98)", tier: "alias", category: "color", description: "Seçili preset kart arka planı" },
    { name: "preset-gallery-card-selected-border", cssVar: "--action-primary-border", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçili preset kenarlık rengi" },
    { name: "preset-gallery-card-hover", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Kart hover arka planı" },
    { name: "preset-gallery-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Galeri kenarlık rengi" },
    { name: "preset-gallery-badge-success", cssVar: "--color-state-success", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Default rozet rengi" },
    { name: "preset-gallery-badge-warning", cssVar: "--color-state-warning", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Yüksek kontrast rozet rengi" },
    // Spacing
    { name: "preset-gallery-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Galeri iç boşluk (p-5)" },
    { name: "preset-gallery-card-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kart iç boşluk (px-4 py-4)" },
    { name: "preset-gallery-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Kartlar arası boşluk (gap-4)" },
    // Typography
    { name: "preset-gallery-title-size", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Galeri başlık boyutu (text-base)" },
    { name: "preset-gallery-label-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Preset etiket boyutu (text-sm)" },
    { name: "preset-gallery-meta-label-size", cssVar: "--font-size-xs-alt", resolvedValue: "11px", tier: "component", category: "typography", description: "Metadata üst etiket boyutu (text-[11px])" },
    // Border
    { name: "preset-gallery-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Galeri kenar yarıçapı (rounded-3xl)" },
    { name: "preset-gallery-card-radius", cssVar: "--radius-3xl-alt", resolvedValue: "26px", tier: "component", category: "border", description: "Kart kenar yarıçapı (rounded-[26px])" },
    // Shadow
    { name: "preset-gallery-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Galeri gölgesi (shadow-xs)" },
  ],
  ThemePreviewCard: [
    // Color
    { name: "preview-card-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Önizleme kartı arka planı" },
    { name: "preview-card-selected-border", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçili kart kenarlık rengi" },
    { name: "preview-card-unselected-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Seçili olmayan kart kenarlık rengi" },
    { name: "preview-card-hover-border", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Hover kenarlık rengi" },
    { name: "preview-card-check-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçim onay daire arka planı" },
    { name: "preview-card-skeleton-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "İskelet önizleme arka planı" },
    { name: "preview-card-button-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Mini buton arka planı" },
    // Spacing
    { name: "preview-card-padding", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Kart iç boşluk (p-2)" },
    { name: "preview-card-inner-padding", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "İç bölüm boşluk (px-2 py-2)" },
    { name: "preview-card-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Öğeler arası boşluk (gap-1)" },
    // Typography
    { name: "preview-card-title-size", cssVar: "--font-size-xs-mini", resolvedValue: "10px", tier: "component", category: "typography", description: "Kart yazı boyutu (text-[10px])" },
    { name: "preview-card-label-size", cssVar: "--font-size-xs-micro", resolvedValue: "9px", tier: "component", category: "typography", description: "Mini etiket boyutu (text-[9px])" },
    // Border
    { name: "preview-card-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "Kart kenar yarıçapı (rounded-xl)" },
    { name: "preview-card-inner-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "component", category: "border", description: "İç bölüm kenar yarıçapı (rounded-lg)" },
    // Shadow
    { name: "preview-card-selected-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Seçili kart gölgesi (shadow-xs)" },
    // Sizing
    { name: "preview-card-check-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Seçim onay daire boyutu (h-4 w-4)" },
  ],
};
