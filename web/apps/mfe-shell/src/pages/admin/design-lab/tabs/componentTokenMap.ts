/* ------------------------------------------------------------------ */
/*  Component Token Map — Maps components to design tokens they use     */
/*                                                                     */
/*  Each entry: token name, CSS variable, resolved value, tier,        */
/*  and category for grouping.                                         */
/*                                                                     */
/*  Surpasses AntD component tokens with: tier info, live preview,     */
/*  override code generation                                           */
/* ------------------------------------------------------------------ */

export type TokenTier = "global" | "alias" | "component";

export type TokenCategory = "color" | "spacing" | "typography" | "border" | "shadow" | "sizing" | "motion";

export type TokenEntry = {
  name: string;
  cssVar: string;
  resolvedValue: string;
  tier: TokenTier;
  category: TokenCategory;
  description?: string;
};

export const TOKEN_TIER_META: Record<TokenTier, { label: string; color: string }> = {
  global: { label: "Global", color: "bg-blue-100 text-blue-700" },
  alias: { label: "Alias", color: "bg-purple-100 text-purple-700" },
  component: { label: "Component", color: "bg-amber-100 text-amber-700" },
};

export const TOKEN_CATEGORY_META: Record<TokenCategory, { label: string; icon: string }> = {
  color: { label: "Color", icon: "🎨" },
  spacing: { label: "Spacing", icon: "📏" },
  typography: { label: "Typography", icon: "🔤" },
  border: { label: "Border", icon: "🔲" },
  shadow: { label: "Shadow", icon: "🌗" },
  sizing: { label: "Sizing", icon: "📐" },
  motion: { label: "Motion", icon: "✨" },
};

/* ---- Token data per component ---- */

const _tokenMap: Record<string, TokenEntry[]> = {
  Button: [
    // Colors
    { name: "button-bg-primary", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Primary button background" },
    { name: "button-bg-primary-hover", cssVar: "--color-action-primary-hover", resolvedValue: "#1d4ed8", tier: "alias", category: "color", description: "Primary button hover background" },
    { name: "button-bg-secondary", cssVar: "--color-surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Secondary button background" },
    { name: "button-bg-ghost", cssVar: "--color-transparent", resolvedValue: "transparent", tier: "component", category: "color", description: "Ghost button background" },
    { name: "button-text-primary", cssVar: "--color-text-inverse", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Primary button text" },
    { name: "button-text-secondary", cssVar: "--color-text-primary", resolvedValue: "#0f172a", tier: "alias", category: "color", description: "Secondary button text" },
    { name: "button-border", cssVar: "--color-border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Button border color" },
    { name: "button-focus-ring", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Focus ring color" },
    { name: "button-disabled-bg", cssVar: "--color-surface-disabled", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Disabled button background" },
    { name: "button-disabled-text", cssVar: "--color-text-disabled", resolvedValue: "#94a3b8", tier: "alias", category: "color", description: "Disabled button text" },
    // Spacing
    { name: "button-padding-x-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Small button horizontal padding" },
    { name: "button-padding-x-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Medium button horizontal padding" },
    { name: "button-padding-x-lg", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Large button horizontal padding" },
    { name: "button-padding-y-sm", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Small button vertical padding" },
    { name: "button-padding-y-md", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Medium button vertical padding" },
    { name: "button-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Gap between icon and label" },
    // Typography
    { name: "button-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Small button font size" },
    { name: "button-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Medium button font size" },
    { name: "button-font-size-lg", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Large button font size" },
    { name: "button-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Button font weight" },
    // Border
    { name: "button-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Button border radius" },
    { name: "button-border-width", cssVar: "--border-width-default", resolvedValue: "1px", tier: "global", category: "border", description: "Button border width" },
    // Shadow
    { name: "button-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Button shadow" },
    // Sizing
    { name: "button-height-sm", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "Small button height" },
    { name: "button-height-md", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Medium button height" },
    { name: "button-height-lg", cssVar: "--size-12", resolvedValue: "48px", tier: "component", category: "sizing", description: "Large button height" },
    // Motion
    { name: "button-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease", tier: "global", category: "motion", description: "Button transition duration" },
  ],
  Input: [
    { name: "input-bg", cssVar: "--color-surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Input background" },
    { name: "input-bg-disabled", cssVar: "--color-surface-disabled", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Disabled input background" },
    { name: "input-border", cssVar: "--color-border-default", resolvedValue: "#cbd5e1", tier: "alias", category: "color", description: "Input border" },
    { name: "input-border-focus", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Focused input border" },
    { name: "input-border-error", cssVar: "--color-feedback-error", resolvedValue: "#ef4444", tier: "alias", category: "color", description: "Error state border" },
    { name: "input-text", cssVar: "--color-text-primary", resolvedValue: "#0f172a", tier: "alias", category: "color", description: "Input text" },
    { name: "input-placeholder", cssVar: "--color-text-tertiary", resolvedValue: "#94a3b8", tier: "alias", category: "color", description: "Placeholder text" },
    { name: "input-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Input height" },
    { name: "input-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Input horizontal padding" },
    { name: "input-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Input border radius" },
    { name: "input-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Input font size" },
    { name: "input-focus-ring-width", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Focus ring width" },
  ],
  Select: [
    { name: "select-bg", cssVar: "--color-surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Select trigger background" },
    { name: "select-border", cssVar: "--color-border-default", resolvedValue: "#cbd5e1", tier: "alias", category: "color", description: "Select border" },
    { name: "select-dropdown-bg", cssVar: "--color-surface-elevated", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Dropdown background" },
    { name: "select-option-hover", cssVar: "--color-surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Option hover background" },
    { name: "select-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Select trigger height" },
    { name: "select-dropdown-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Dropdown shadow" },
    { name: "select-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Select border radius" },
  ],
  Alert: [
    { name: "alert-bg-info", cssVar: "--color-feedback-info-light", resolvedValue: "#eff6ff", tier: "alias", category: "color", description: "Info alert background" },
    { name: "alert-bg-success", cssVar: "--color-feedback-success-light", resolvedValue: "#f0fdf4", tier: "alias", category: "color", description: "Success alert background" },
    { name: "alert-bg-warning", cssVar: "--color-feedback-warning-light", resolvedValue: "#fffbeb", tier: "alias", category: "color", description: "Warning alert background" },
    { name: "alert-bg-error", cssVar: "--color-feedback-error-light", resolvedValue: "#fef2f2", tier: "alias", category: "color", description: "Error alert background" },
    { name: "alert-border-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Alert border radius" },
    { name: "alert-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Alert padding" },
    { name: "alert-icon-size", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Alert icon size" },
  ],
  Checkbox: [
    { name: "checkbox-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Checkbox size" },
    { name: "checkbox-border", cssVar: "--color-border-default", resolvedValue: "#cbd5e1", tier: "alias", category: "color", description: "Checkbox border" },
    { name: "checkbox-checked-bg", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Checked background" },
    { name: "checkbox-border-radius", cssVar: "--radius-sm", resolvedValue: "4px", tier: "global", category: "border", description: "Checkbox border radius" },
    { name: "checkbox-label-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Gap between checkbox and label" },
  ],
  Modal: [
    { name: "modal-overlay-bg", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.5)", tier: "alias", category: "color", description: "Backdrop overlay" },
    { name: "modal-surface-bg", cssVar: "--color-surface-elevated", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Modal surface" },
    { name: "modal-border-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Modal border radius" },
    { name: "modal-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "global", category: "shadow", description: "Modal shadow" },
    { name: "modal-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Modal content padding" },
    { name: "modal-max-width", cssVar: "--size-lg", resolvedValue: "512px", tier: "component", category: "sizing", description: "Default max width" },
  ],
  Pagination: [
    { name: "pagination-item-size", cssVar: "--size-9", resolvedValue: "36px", tier: "component", category: "sizing", description: "Page button size" },
    { name: "pagination-active-bg", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Active page background" },
    { name: "pagination-active-text", cssVar: "--color-text-inverse", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Active page text" },
    { name: "pagination-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Gap between page buttons" },
    { name: "pagination-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Page button radius" },
  ],
  SearchFilterListing: [
    // Color
    { name: "sfl-surface-card", cssVar: "--surface-card", resolvedValue: "var(--surface-default-bg, #fff)", tier: "alias", category: "color", description: "Panel arka plan rengi (koyu modda otomatik uyum saglar)" },
    { name: "sfl-surface-muted", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Chip, skeleton, totalCount badge ve bos durum ikon arka plani" },
    { name: "sfl-surface-hover", cssVar: "--surface-hover", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Filtre chip hover arka plan rengi" },
    { name: "sfl-text-primary", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Baslik, liste basligi ve chip metin rengi" },
    { name: "sfl-text-secondary", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Aciklama, eyebrow, siralama ve totalCount metin rengi" },
    { name: "sfl-action-primary-bg", cssVar: "--action-primary-bg", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Chip kaldir hover, secim sayaci badge ve tumunu temizle link rengi" },
    { name: "sfl-selection-outline", cssVar: "--selection-outline", resolvedValue: "#3b82f6", tier: "alias", category: "color", description: "Secim cubugu kenarligi ve siralama dropdown focus rengi" },
    { name: "sfl-selection-bg", cssVar: "--selection-bg", resolvedValue: "#eff6ff", tier: "alias", category: "color", description: "Secim cubugu arka plan rengi" },
    { name: "sfl-border-subtle", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel, chip ve siralama dropdown kenarlik rengi" },
    // Spacing
    { name: "sfl-panel-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel ic boslugu (default mod, p-5)" },
    { name: "sfl-panel-padding-compact", cssVar: "--spacing-3", resolvedValue: "12px", tier: "component", category: "spacing", description: "Panel ic boslugu (compact mod, p-3)" },
    { name: "sfl-section-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bolumler arasi dikey bosluk (space-y-4 / space-y-2 compact)" },
    { name: "sfl-chip-padding", cssVar: "--spacing-2.5", resolvedValue: "10px / 4px", tier: "component", category: "spacing", description: "Filtre chip ic boslugu (px-2.5 py-1)" },
    // Typography
    { name: "sfl-title-font", cssVar: "--font-size-base", resolvedValue: "16px / 600 / -0.02em", tier: "global", category: "typography", description: "Liste basligi font boyutu, kalinligi ve harf araligi" },
    { name: "sfl-chip-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Filtre chip, totalCount badge ve eyebrow font boyutu" },
    { name: "sfl-count-tabular", cssVar: "font-variant-numeric", resolvedValue: "tabular-nums", tier: "component", category: "typography", description: "totalCount badge monospace rakam hizalamasi" },
    // Border
    { name: "sfl-panel-radius", cssVar: "--radius-3xl", resolvedValue: "28px", tier: "component", category: "border", description: "Panel kenar yuvarlama (rounded-[28px])" },
    { name: "sfl-chip-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Filtre chip ve totalCount badge tam yuvarlak kenar" },
    { name: "sfl-skeleton-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Yukleme iskeleti blok kenar yuvarlama" },
    // Shadow
    { name: "sfl-panel-shadow", cssVar: "--shadow-panel", resolvedValue: "0 22px 48px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel golge efekti (backdrop-blur-xs ile)" },
    // Motion
    { name: "sfl-transition", cssVar: "transition-all", resolvedValue: "all 200ms ease", tier: "component", category: "motion", description: "Panel, chip ve secim cubugu gecis animasyonu (duration-200)" },
    { name: "sfl-skeleton-pulse", cssVar: "animate-pulse", resolvedValue: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite", tier: "component", category: "motion", description: "Yukleme iskeleti nabiz animasyonu" },
    // Sizing
    { name: "sfl-chip-remove-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Chip kaldir butonu boyutu (h-4 w-4)" },
    { name: "sfl-count-badge-size", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "Secim sayaci badge boyutu (h-6 w-6)" },
    { name: "sfl-reload-btn-size", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "Yeniden yukle butonu boyutu (h-8 w-8)" },
  ],
  Avatar: [
    // Colors
    { name: "avatar-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Avatar arka plan rengi (fallback)" },
    { name: "avatar-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Avatar baş harf metin rengi" },
    { name: "avatar-icon-fallback", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Varsayılan ikon rengi (src/initials yoksa)" },
    // Sizing
    { name: "avatar-size-xs", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "Ekstra küçük avatar boyutu (h-6 w-6)" },
    { name: "avatar-size-sm", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "Küçük avatar boyutu (h-8 w-8)" },
    { name: "avatar-size-md", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Orta avatar boyutu (h-10 w-10)" },
    { name: "avatar-size-lg", cssVar: "--size-12", resolvedValue: "48px", tier: "component", category: "sizing", description: "Büyük avatar boyutu (h-12 w-12)" },
    { name: "avatar-size-xl", cssVar: "--size-14", resolvedValue: "56px", tier: "component", category: "sizing", description: "Ekstra büyük avatar boyutu (h-14 w-14)" },
    { name: "avatar-size-2xl", cssVar: "--size-16", resolvedValue: "64px", tier: "component", category: "sizing", description: "En büyük avatar boyutu (h-16 w-16)" },
    // Typography
    { name: "avatar-font-size-xs", cssVar: "--font-size-3xs", resolvedValue: "10px", tier: "global", category: "typography", description: "XS avatar font boyutu" },
    { name: "avatar-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "SM avatar font boyutu" },
    { name: "avatar-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "MD avatar font boyutu" },
    { name: "avatar-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Avatar baş harf font kalınlığı" },
    // Border
    { name: "avatar-radius-circle", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Yuvarlak avatar kenar yarıçapı" },
    { name: "avatar-radius-square", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Kare avatar kenar yarıçapı" },
  ],
  Badge: [
    // Colors
    { name: "badge-bg-default", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Varsayılan badge arka plan rengi" },
    { name: "badge-text-default", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Varsayılan badge metin rengi" },
    { name: "badge-bg-primary", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/10", tier: "alias", category: "color", description: "Primary badge arka plan rengi (%10 opasite)" },
    { name: "badge-text-primary", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary badge metin rengi" },
    { name: "badge-bg-success", cssVar: "--state-success-bg", resolvedValue: "var(--state-success-bg)", tier: "alias", category: "color", description: "Başarılı badge arka plan rengi" },
    { name: "badge-text-success", cssVar: "--state-success-text", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Başarılı badge metin rengi" },
    { name: "badge-bg-error", cssVar: "--state-error-bg", resolvedValue: "var(--state-error-bg)", tier: "alias", category: "color", description: "Hata badge arka plan rengi" },
    { name: "badge-text-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Hata badge metin rengi" },
    // Spacing
    { name: "badge-padding-x-sm", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Küçük badge yatay iç boşluk (px-1.5)" },
    { name: "badge-padding-x-md", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Orta badge yatay iç boşluk (px-2)" },
    { name: "badge-padding-x-lg", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Büyük badge yatay iç boşluk (px-2.5)" },
    // Typography
    { name: "badge-font-size-sm", cssVar: "--font-size-3xs", resolvedValue: "10px", tier: "global", category: "typography", description: "Küçük badge font boyutu" },
    { name: "badge-font-size-md", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Orta/büyük badge font boyutu" },
    { name: "badge-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Badge font kalınlığı" },
    // Border
    { name: "badge-border-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Badge kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "badge-dot-size", cssVar: "--size-2", resolvedValue: "8px", tier: "component", category: "sizing", description: "Nokta (dot) gösterge boyutu" },
  ],
  Tag: [
    // Colors
    { name: "tag-bg-default", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Varsayılan etiket arka plan rengi" },
    { name: "tag-text-default", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Varsayılan etiket metin rengi" },
    { name: "tag-border-default", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Varsayılan etiket kenarlık rengi" },
    { name: "tag-bg-primary", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/10", tier: "alias", category: "color", description: "Primary etiket arka plan rengi (%10 opasite)" },
    { name: "tag-text-primary", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary etiket metin rengi" },
    { name: "tag-bg-success", cssVar: "--state-success-bg", resolvedValue: "var(--state-success-bg)", tier: "alias", category: "color", description: "Başarılı etiket arka plan rengi" },
    { name: "tag-bg-error", cssVar: "--state-error-bg", resolvedValue: "var(--state-error-bg)", tier: "alias", category: "color", description: "Hata etiket arka plan rengi" },
    // Spacing
    { name: "tag-padding-x-sm", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Küçük etiket yatay iç boşluk" },
    { name: "tag-padding-x-md", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Orta etiket yatay iç boşluk" },
    { name: "tag-padding-x-lg", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Büyük etiket yatay iç boşluk" },
    { name: "tag-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "İkon ve metin arası boşluk (gap-1)" },
    // Typography
    { name: "tag-font-size-sm", cssVar: "--font-size-3xs", resolvedValue: "10px", tier: "global", category: "typography", description: "Küçük etiket font boyutu" },
    { name: "tag-font-size-md", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Orta/büyük etiket font boyutu" },
    { name: "tag-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Etiket font kalınlığı" },
    // Border
    { name: "tag-border-radius", cssVar: "--radius-md", resolvedValue: "6px", tier: "global", category: "border", description: "Etiket kenar yarıçapı (rounded-md)" },
    { name: "tag-border-width", cssVar: "--border-width-default", resolvedValue: "1px", tier: "global", category: "border", description: "Etiket kenarlık kalınlığı" },
    // Sizing
    { name: "tag-height-sm", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Küçük etiket yüksekliği (h-5)" },
    { name: "tag-height-md", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "Orta etiket yüksekliği (h-6)" },
    { name: "tag-height-lg", cssVar: "--size-7", resolvedValue: "28px", tier: "component", category: "sizing", description: "Büyük etiket yüksekliği (h-7)" },
    { name: "tag-icon-size", cssVar: "--size-3", resolvedValue: "12px", tier: "component", category: "sizing", description: "Etiket ikon boyutu (h-3 w-3)" },
  ],
  Radio: [
    // Colors
    { name: "radio-border-default", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Seçilmemiş radio kenarlık rengi" },
    { name: "radio-border-checked", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçili radio kenarlık rengi" },
    { name: "radio-dot-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Seçili radio iç nokta rengi" },
    { name: "radio-border-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Hata durumu kenarlık rengi" },
    { name: "radio-label-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Radio etiket metin rengi" },
    { name: "radio-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Radio açıklama metin rengi" },
    // Spacing
    { name: "radio-label-gap", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Radio ve etiket arası boşluk (gap-2.5)" },
    { name: "radio-group-gap-vertical", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Dikey grup radio arası boşluk" },
    { name: "radio-group-gap-horizontal", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Yatay grup radio arası boşluk" },
    // Typography
    { name: "radio-label-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Radio etiket font boyutu (text-sm)" },
    { name: "radio-label-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Radio etiket font kalınlığı" },
    { name: "radio-description-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Radio açıklama font boyutu" },
    // Border
    { name: "radio-border-width", cssVar: "--border-width-2", resolvedValue: "2px", tier: "global", category: "border", description: "Radio kenarlık kalınlığı (border-2)" },
    { name: "radio-border-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Radio kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "radio-outer-sm", cssVar: "--size-3.5", resolvedValue: "14px", tier: "component", category: "sizing", description: "Küçük radio dış daire boyutu" },
    { name: "radio-outer-md", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Orta radio dış daire boyutu" },
    { name: "radio-outer-lg", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Büyük radio dış daire boyutu" },
    { name: "radio-inner-md", cssVar: "--size-2", resolvedValue: "8px", tier: "component", category: "sizing", description: "Orta radio iç nokta boyutu" },
    // Motion
    { name: "radio-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease", tier: "global", category: "motion", description: "Radio renk geçiş süresi (duration-150)" },
  ],
  Switch: [
    // Colors
    { name: "switch-track-checked", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Açık durumdaki track arka plan rengi" },
    { name: "switch-track-unchecked", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Kapalı durumdaki track arka plan rengi" },
    { name: "switch-thumb-bg", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "global", category: "color", description: "Thumb (düğme) arka plan rengi" },
    { name: "switch-label-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Switch etiket metin rengi" },
    { name: "switch-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Switch açıklama metin rengi" },
    // Spacing
    { name: "switch-label-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Switch ve etiket arası boşluk (gap-3)" },
    { name: "switch-thumb-offset", cssVar: "--spacing-0.5", resolvedValue: "2px", tier: "component", category: "spacing", description: "Thumb iç kenar boşluğu" },
    // Typography
    { name: "switch-label-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Switch etiket font boyutu" },
    { name: "switch-label-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Switch etiket font kalınlığı" },
    { name: "switch-description-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Switch açıklama font boyutu" },
    // Border
    { name: "switch-track-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Track kenar yarıçapı (rounded-full)" },
    { name: "switch-thumb-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Thumb kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "switch-track-w-sm", cssVar: "--size-7", resolvedValue: "28px", tier: "component", category: "sizing", description: "Küçük track genişliği (w-7)" },
    { name: "switch-track-h-sm", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Küçük track yüksekliği (h-4)" },
    { name: "switch-track-w-md", cssVar: "--size-9", resolvedValue: "36px", tier: "component", category: "sizing", description: "Orta track genişliği (w-9)" },
    { name: "switch-track-h-md", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Orta track yüksekliği (h-5)" },
    { name: "switch-thumb-sm", cssVar: "--size-3", resolvedValue: "12px", tier: "component", category: "sizing", description: "Küçük thumb boyutu (h-3 w-3)" },
    { name: "switch-thumb-md", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Orta thumb boyutu (h-4 w-4)" },
    // Shadow
    { name: "switch-thumb-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Thumb gölge efekti" },
    // Motion
    { name: "switch-transition", cssVar: "--transition-normal", resolvedValue: "200ms ease", tier: "global", category: "motion", description: "Track ve thumb geçiş süresi (duration-200)" },
  ],
  Divider: [
    // Colors
    { name: "divider-color", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Ayırıcı çizgi rengi" },
    { name: "divider-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Ayırıcı etiket metin rengi" },
    // Spacing
    { name: "divider-spacing-sm", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Küçük dikey boşluk (my-2)" },
    { name: "divider-spacing-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Orta dikey boşluk (my-4)" },
    { name: "divider-spacing-lg", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Büyük dikey boşluk (my-6)" },
    { name: "divider-label-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Etiket ve çizgi arası boşluk (gap-3)" },
    // Typography
    { name: "divider-label-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Ayırıcı etiket font boyutu (text-xs)" },
    { name: "divider-label-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Ayırıcı etiket font kalınlığı" },
    // Sizing
    { name: "divider-thickness", cssVar: "--size-px", resolvedValue: "1px", tier: "component", category: "sizing", description: "Ayırıcı çizgi kalınlığı (h-px / w-px)" },
  ],
  Tooltip: [
    // Colors
    { name: "tooltip-bg", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Tooltip arka plan rengi (koyu tema)" },
    { name: "tooltip-text", cssVar: "--text-inverse", resolvedValue: "var(--text-inverse)", tier: "alias", category: "color", description: "Tooltip metin rengi (açık)" },
    { name: "tooltip-arrow-color", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Ok göstergesi rengi" },
    // Spacing
    { name: "tooltip-padding-x", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "Tooltip yatay iç boşluk (px-2.5)" },
    { name: "tooltip-padding-y", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Tooltip dikey iç boşluk (py-1.5)" },
    { name: "tooltip-offset", cssVar: "--spacing-2", resolvedValue: "8px", tier: "component", category: "spacing", description: "Tooltip ve tetikleyici arası mesafe (mb-2/mt-2)" },
    // Typography
    { name: "tooltip-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Tooltip font boyutu (text-xs)" },
    { name: "tooltip-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Tooltip font kalınlığı" },
    // Border
    { name: "tooltip-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Tooltip kenar yarıçapı (rounded-lg)" },
    { name: "tooltip-arrow-size", cssVar: "--border-width-4", resolvedValue: "4px", tier: "component", category: "border", description: "Ok göstergesi boyutu (border-4)" },
    // Shadow
    { name: "tooltip-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Tooltip gölge efekti" },
    // Motion
    { name: "tooltip-open-delay", cssVar: "--duration-200", resolvedValue: "200ms", tier: "component", category: "motion", description: "Tooltip görünme gecikmesi (varsayılan)" },
    { name: "tooltip-animation", cssVar: "--animate-fade-in", resolvedValue: "fade-in-0 zoom-in-95", tier: "component", category: "motion", description: "Tooltip giriş animasyonu" },
  ],
  Text: [
    // Colors
    { name: "text-color-default", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Varsayılan metin rengi" },
    { name: "text-color-secondary", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İkincil metin rengi" },
    { name: "text-color-muted", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Soluk metin rengi" },
    { name: "text-color-success", cssVar: "--state-success-text", resolvedValue: "var(--state-success-text)", tier: "alias", category: "color", description: "Başarılı durum metin rengi" },
    { name: "text-color-warning", cssVar: "--state-warning-text", resolvedValue: "var(--state-warning-text)", tier: "alias", category: "color", description: "Uyarı durum metin rengi" },
    { name: "text-color-error", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Hata durum metin rengi" },
    { name: "text-color-info", cssVar: "--state-info-text", resolvedValue: "var(--state-info-text)", tier: "alias", category: "color", description: "Bilgi durum metin rengi" },
    // Typography
    { name: "text-font-size-xs", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Ekstra küçük font boyutu (text-xs)" },
    { name: "text-font-size-sm", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Küçük font boyutu (text-sm)" },
    { name: "text-font-size-base", cssVar: "--font-size-base", resolvedValue: "16px", tier: "global", category: "typography", description: "Temel font boyutu (text-base)" },
    { name: "text-font-size-lg", cssVar: "--font-size-lg", resolvedValue: "18px", tier: "global", category: "typography", description: "Büyük font boyutu (text-lg)" },
    { name: "text-font-size-xl", cssVar: "--font-size-xl", resolvedValue: "20px", tier: "global", category: "typography", description: "Ekstra büyük font boyutu (text-xl)" },
    { name: "text-font-size-2xl", cssVar: "--font-size-2xl", resolvedValue: "24px", tier: "global", category: "typography", description: "2XL font boyutu (text-2xl)" },
    { name: "text-font-size-3xl", cssVar: "--font-size-3xl", resolvedValue: "30px", tier: "global", category: "typography", description: "3XL font boyutu (text-3xl)" },
    { name: "text-font-size-4xl", cssVar: "--font-size-4xl", resolvedValue: "36px", tier: "global", category: "typography", description: "4XL font boyutu (text-4xl)" },
    { name: "text-font-weight-normal", cssVar: "--font-weight-normal", resolvedValue: "400", tier: "global", category: "typography", description: "Normal font kalınlığı" },
    { name: "text-font-weight-medium", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Orta font kalınlığı" },
    { name: "text-font-weight-semibold", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Yarı kalın font kalınlığı" },
    { name: "text-font-weight-bold", cssVar: "--font-weight-bold", resolvedValue: "700", tier: "global", category: "typography", description: "Kalın font kalınlığı" },
    { name: "text-font-family-mono", cssVar: "--font-family-mono", resolvedValue: "monospace", tier: "global", category: "typography", description: "Monospace font ailesi" },
  ],
  Dropdown: [
    // Colors
    { name: "dropdown-menu-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Menü arka plan rengi" },
    { name: "dropdown-menu-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Menü kenarlık rengi" },
    { name: "dropdown-item-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Menü öğesi metin rengi" },
    { name: "dropdown-item-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Menü öğesi hover arka plan rengi" },
    { name: "dropdown-item-danger-text", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Tehlikeli öğe metin rengi" },
    { name: "dropdown-item-danger-hover-bg", cssVar: "--state-error-bg", resolvedValue: "var(--state-error-bg)", tier: "alias", category: "color", description: "Tehlikeli öğe hover arka plan rengi" },
    { name: "dropdown-icon-color", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Öğe ikon rengi" },
    { name: "dropdown-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Grup etiketi metin rengi" },
    { name: "dropdown-separator-color", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Ayırıcı çizgi rengi" },
    // Spacing
    { name: "dropdown-menu-padding-y", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Menü dikey iç boşluk (py-1)" },
    { name: "dropdown-item-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Öğe yatay iç boşluk (px-3)" },
    { name: "dropdown-item-padding-y", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Öğe dikey iç boşluk (py-2)" },
    { name: "dropdown-item-gap", cssVar: "--spacing-2.5", resolvedValue: "10px", tier: "global", category: "spacing", description: "İkon ve metin arası boşluk (gap-2.5)" },
    { name: "dropdown-trigger-offset", cssVar: "--spacing-1", resolvedValue: "4px", tier: "component", category: "spacing", description: "Tetikleyici ile menü arası mesafe (mt-1)" },
    // Typography
    { name: "dropdown-item-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Öğe font boyutu (text-sm)" },
    { name: "dropdown-item-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Öğe etiket font kalınlığı (font-medium)" },
    { name: "dropdown-description-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Öğe açıklama font boyutu (text-xs)" },
    { name: "dropdown-label-font-size", cssVar: "--font-size-3xs", resolvedValue: "10px", tier: "component", category: "typography", description: "Grup etiketi font boyutu (text-[10px])" },
    { name: "dropdown-label-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Grup etiketi font kalınlığı" },
    // Border
    { name: "dropdown-menu-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Menü kenar yarıçapı (rounded-xl)" },
    { name: "dropdown-menu-border-width", cssVar: "--border-width-default", resolvedValue: "1px", tier: "global", category: "border", description: "Menü kenarlık kalınlığı" },
    // Shadow
    { name: "dropdown-menu-shadow", cssVar: "--shadow-xl", resolvedValue: "0 20px 25px -5px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Menü gölge efekti (shadow-xl)" },
    // Sizing
    { name: "dropdown-min-width", cssVar: "--size-45", resolvedValue: "180px", tier: "component", category: "sizing", description: "Menü varsayılan minimum genişlik" },
    { name: "dropdown-icon-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Öğe ikon boyutu (h-4 w-4)" },
    // Motion
    { name: "dropdown-animation", cssVar: "--animate-fade-in", resolvedValue: "fade-in-0 zoom-in-95", tier: "component", category: "motion", description: "Menü giriş animasyonu" },
  ],
  IconButton: [
    // Colors
    { name: "iconbutton-bg-primary", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary varyant arka plan rengi" },
    { name: "iconbutton-bg-primary-hover", cssVar: "--action-primary-hover", resolvedValue: "var(--action-primary-hover)", tier: "alias", category: "color", description: "Primary varyant hover arka plan rengi" },
    { name: "iconbutton-bg-secondary", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Secondary varyant arka plan rengi" },
    { name: "iconbutton-bg-ghost", cssVar: "--color-transparent", resolvedValue: "transparent", tier: "component", category: "color", description: "Ghost varyant arka plan rengi" },
    { name: "iconbutton-bg-danger", cssVar: "--state-error-text", resolvedValue: "var(--state-error-text)", tier: "alias", category: "color", description: "Danger varyant arka plan rengi" },
    { name: "iconbutton-text-secondary", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Secondary varyant ikon rengi" },
    { name: "iconbutton-text-ghost", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Ghost varyant ikon rengi" },
    { name: "iconbutton-ghost-hover-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Ghost hover arka plan rengi" },
    { name: "iconbutton-outline-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Outline varyant kenarlık rengi" },
    { name: "iconbutton-focus-ring", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/30", tier: "alias", category: "color", description: "Odak halkası rengi (%30 opasite)" },
    // Spacing
    { name: "iconbutton-focus-ring-offset", cssVar: "--spacing-0.5", resolvedValue: "2px", tier: "global", category: "spacing", description: "Odak halkası uzaklığı (ring-offset-2)" },
    // Border
    { name: "iconbutton-radius-default", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Varsayılan kenar yarıçapı (rounded-lg)" },
    { name: "iconbutton-radius-rounded", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Yuvarlak kenar yarıçapı (rounded-full)" },
    { name: "iconbutton-focus-ring-width", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Odak halkası kalınlığı (ring-2)" },
    // Shadow
    { name: "iconbutton-shadow-primary", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Primary/danger varyant gölgesi (shadow-xs)" },
    // Sizing
    { name: "iconbutton-size-xs", cssVar: "--size-7", resolvedValue: "28px", tier: "component", category: "sizing", description: "XS buton boyutu (h-7 w-7)" },
    { name: "iconbutton-size-sm", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "SM buton boyutu (h-8 w-8)" },
    { name: "iconbutton-size-md", cssVar: "--size-9", resolvedValue: "36px", tier: "component", category: "sizing", description: "MD buton boyutu (h-9 w-9)" },
    { name: "iconbutton-size-lg", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "LG buton boyutu (h-10 w-10)" },
    { name: "iconbutton-icon-xs", cssVar: "--size-3.5", resolvedValue: "14px", tier: "component", category: "sizing", description: "XS ikon boyutu (h-3.5 w-3.5)" },
    { name: "iconbutton-icon-sm", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "SM ikon boyutu (h-4 w-4)" },
    { name: "iconbutton-icon-lg", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "LG ikon boyutu (h-5 w-5)" },
    // Motion
    { name: "iconbutton-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease", tier: "global", category: "motion", description: "Geçiş süresi (duration-150)" },
  ],
  Popover: [
    // Colors
    { name: "popover-panel-bg-start", cssVar: "--color-surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Panel gradient başlangıç rengi" },
    { name: "popover-panel-bg-end", cssVar: "--color-surface-subtle", resolvedValue: "rgba(245,246,255,0.94)", tier: "alias", category: "color", description: "Panel gradient bitiş rengi" },
    { name: "popover-panel-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/80", tier: "alias", category: "color", description: "Panel kenarlık rengi (%80 opasite)" },
    { name: "popover-panel-ring", cssVar: "--color-white-alpha-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Panel dış halka rengi (ring-white/75)" },
    { name: "popover-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "popover-content-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "İçerik metin rengi" },
    { name: "popover-arrow-bg", cssVar: "--color-surface-gradient", resolvedValue: "linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,246,255,0.94))", tier: "component", category: "color", description: "Ok göstergesi arka plan gradienti" },
    // Spacing
    { name: "popover-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-4)" },
    { name: "popover-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "component", category: "spacing", description: "Tetikleyici ile panel arası mesafe" },
    { name: "popover-title-margin", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Başlık alt boşluğu (mb-2)" },
    // Typography
    { name: "popover-title-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Başlık font boyutu (text-sm)" },
    { name: "popover-title-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "popover-title-tracking", cssVar: "--tracking-tight", resolvedValue: "-0.01em", tier: "component", category: "typography", description: "Başlık harf aralığı (tracking-[-0.01em])" },
    { name: "popover-content-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "İçerik font boyutu (text-sm)" },
    { name: "popover-content-line-height", cssVar: "--leading-6", resolvedValue: "24px", tier: "global", category: "typography", description: "İçerik satır yüksekliği (leading-6)" },
    // Border
    { name: "popover-panel-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[24px])" },
    { name: "popover-arrow-size", cssVar: "--size-3", resolvedValue: "12px", tier: "component", category: "border", description: "Ok göstergesi boyutu (h-3 w-3)" },
    // Shadow
    { name: "popover-panel-shadow", cssVar: "--elevation-overlay", resolvedValue: "var(--elevation-overlay)", tier: "component", category: "shadow", description: "Panel gölge efekti (elevation-overlay)" },
    { name: "popover-arrow-shadow", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Ok göstergesi gölge efekti" },
    // Sizing
    { name: "popover-max-width", cssVar: "--size-88", resolvedValue: "22rem", tier: "component", category: "sizing", description: "Panel maksimum genişlik (w-[min(22rem,...)])" },
  ],
  Skeleton: [
    // Colors
    { name: "skeleton-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Placeholder arka plan rengi" },
    // Spacing
    { name: "skeleton-lines-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Çoklu satır arası boşluk (gap-2)" },
    // Border
    { name: "skeleton-radius-default", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Varsayılan kenar yarıçapı (rounded-lg)" },
    { name: "skeleton-radius-circle", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Daire kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "skeleton-default-width", cssVar: "--size-full", resolvedValue: "100%", tier: "component", category: "sizing", description: "Varsayılan genişlik" },
    { name: "skeleton-default-height", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Varsayılan yükseklik" },
    { name: "skeleton-circle-default", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Varsayılan daire boyutu" },
    { name: "skeleton-last-line-width", cssVar: "--size-3/4", resolvedValue: "75%", tier: "component", category: "sizing", description: "Son satır genişliği (%75)" },
    // Motion
    { name: "skeleton-animation", cssVar: "--animate-pulse", resolvedValue: "pulse 2s ease-in-out infinite", tier: "global", category: "motion", description: "Nabız animasyonu (animate-pulse)" },
  ],
  Spinner: [
    // Colors
    { name: "spinner-track-color", cssVar: "--color-current", resolvedValue: "currentColor", tier: "alias", category: "color", description: "Spinner parça rengi (currentColor)" },
    { name: "spinner-track-opacity", cssVar: "--opacity-25", resolvedValue: "0.25", tier: "component", category: "color", description: "Arka halka opasite (opacity-25)" },
    { name: "spinner-fill-opacity", cssVar: "--opacity-75", resolvedValue: "0.75", tier: "component", category: "color", description: "Dönen parça opasite (opacity-75)" },
    { name: "spinner-block-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Block mod metin rengi" },
    // Spacing
    { name: "spinner-block-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Spinner ve etiket arası boşluk (gap-3)" },
    { name: "spinner-block-padding-y", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Block mod dikey boşluk (py-6)" },
    // Typography
    { name: "spinner-label-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Etiket font boyutu (text-sm)" },
    { name: "spinner-label-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Etiket font kalınlığı (font-medium)" },
    // Sizing
    { name: "spinner-size-xs", cssVar: "--size-3", resolvedValue: "12px", tier: "component", category: "sizing", description: "XS spinner boyutu (h-3 w-3)" },
    { name: "spinner-size-sm", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "SM spinner boyutu (h-4 w-4)" },
    { name: "spinner-size-md", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "MD spinner boyutu (h-5 w-5)" },
    { name: "spinner-size-lg", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "LG spinner boyutu (h-6 w-6)" },
    { name: "spinner-size-xl", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "XL spinner boyutu (h-8 w-8)" },
    // Motion
    { name: "spinner-animation", cssVar: "--animate-spin", resolvedValue: "spin 1s linear infinite", tier: "global", category: "motion", description: "Dönme animasyonu (animate-spin)" },
  ],
  Card: [
    // Colors
    { name: "card-bg-elevated", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Elevated varyant arka plan rengi" },
    { name: "card-bg-filled", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Filled varyant arka plan rengi" },
    { name: "card-border-elevated", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Elevated varyant kenarlık rengi" },
    { name: "card-border-outlined", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Outlined varyant kenarlık rengi" },
    { name: "card-hover-border", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/30", tier: "alias", category: "color", description: "Hover kenarlık rengi (%30 opasite)" },
    { name: "card-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "card-subtitle-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Alt başlık metin rengi" },
    { name: "card-footer-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Footer kenarlık rengi" },
    // Spacing
    { name: "card-padding-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Küçük iç boşluk (p-3)" },
    { name: "card-padding-md", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Orta iç boşluk (p-5)" },
    { name: "card-padding-lg", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Büyük iç boşluk (p-6)" },
    { name: "card-header-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Header öğeleri arası boşluk (gap-4)" },
    { name: "card-body-margin", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Body üst boşluk (mt-3)" },
    { name: "card-footer-margin", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Footer üst boşluk (mt-4)" },
    { name: "card-footer-padding-top", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Footer üst iç boşluk (pt-3)" },
    { name: "card-footer-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Footer öğeleri arası boşluk (gap-2)" },
    // Typography
    { name: "card-title-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Başlık font boyutu (text-sm)" },
    { name: "card-title-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "card-subtitle-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Alt başlık font boyutu (text-xs)" },
    // Border
    { name: "card-border-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Kart kenar yarıçapı (rounded-2xl)" },
    { name: "card-border-width", cssVar: "--border-width-default", resolvedValue: "1px", tier: "global", category: "border", description: "Kart kenarlık kalınlığı" },
    // Shadow
    { name: "card-shadow-elevated", cssVar: "--shadow-xs", resolvedValue: "0 1px 2px rgba(0,0,0,0.05)", tier: "global", category: "shadow", description: "Elevated varyant gölge efekti (shadow-xs)" },
    { name: "card-shadow-hover", cssVar: "--shadow-md", resolvedValue: "0 4px 6px -1px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Hover gölge efekti (shadow-md)" },
    // Motion
    { name: "card-transition", cssVar: "--transition-fast", resolvedValue: "150ms ease", tier: "global", category: "motion", description: "Geçiş süresi (duration-150)" },
  ],
  Breadcrumb: [
    // Colors
    { name: "breadcrumb-text-current", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Aktif sayfa metin rengi" },
    { name: "breadcrumb-text-link", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Bağlantı metin rengi" },
    { name: "breadcrumb-text-link-hover", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Bağlantı hover metin rengi" },
    { name: "breadcrumb-separator-color", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Ayırıcı ikon rengi" },
    { name: "breadcrumb-collapsed-text", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)", tier: "alias", category: "color", description: "Daraltılmış gösterge metin rengi" },
    { name: "breadcrumb-focus-ring", cssVar: "--action-primary", resolvedValue: "var(--action-primary)/30", tier: "alias", category: "color", description: "Odak halkası rengi (%30 opasite)" },
    // Spacing
    { name: "breadcrumb-item-gap", cssVar: "--spacing-1.5", resolvedValue: "6px", tier: "global", category: "spacing", description: "Öğeler arası boşluk (gap-1.5)" },
    { name: "breadcrumb-icon-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "İkon ve etiket arası boşluk (gap-1)" },
    // Typography
    { name: "breadcrumb-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Öğe font boyutu (text-xs)" },
    { name: "breadcrumb-font-weight-current", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Aktif sayfa font kalınlığı (font-medium)" },
    // Sizing
    { name: "breadcrumb-separator-size", cssVar: "--size-3.5", resolvedValue: "14px", tier: "component", category: "sizing", description: "Ayırıcı ikon boyutu (h-3.5 w-3.5)" },
    { name: "breadcrumb-icon-size", cssVar: "--size-3.5", resolvedValue: "14px", tier: "component", category: "sizing", description: "Öğe ikon boyutu (h-3.5 w-3.5)" },
    // Motion
    { name: "breadcrumb-transition", cssVar: "--transition-colors", resolvedValue: "color 150ms ease", tier: "global", category: "motion", description: "Bağlantı renk geçiş efekti" },
  ],
  Accordion: [
    // Colors
    { name: "accordion-surface-bg-start", cssVar: "--color-surface-default", resolvedValue: "rgba(255,255,255,0.96)", tier: "alias", category: "color", description: "Panel gradient başlangıç rengi" },
    { name: "accordion-surface-bg-end", cssVar: "--color-surface-subtle", resolvedValue: "rgba(244,246,255,0.92)", tier: "alias", category: "color", description: "Panel gradient bitiş rengi" },
    { name: "accordion-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/80", tier: "alias", category: "color", description: "Kenarlık rengi (%80 opasite)" },
    { name: "accordion-ring", cssVar: "--color-white-alpha-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Dış halka rengi (ring-white/75)" },
    { name: "accordion-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Başlık metin rengi" },
    { name: "accordion-description-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Açıklama ve içerik metin rengi" },
    { name: "accordion-icon-color", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Genişletme ikonu rengi" },
    { name: "accordion-panel-bg", cssVar: "--color-surface-gradient", resolvedValue: "linear-gradient(180deg,rgba(255,255,255,0.54),rgba(244,246,252,0.9))", tier: "component", category: "color", description: "Açık panel içerik arka plan gradienti" },
    { name: "accordion-header-hover-bg", cssVar: "--color-white-alpha-70", resolvedValue: "rgba(255,255,255,0.7)", tier: "component", category: "color", description: "Header hover arka plan rengi" },
    { name: "accordion-focus-ring", cssVar: "--accent-focus", resolvedValue: "var(--accent-focus)", tier: "alias", category: "color", description: "Odak halkası rengi" },
    // Spacing
    { name: "accordion-padding-sm", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "SM tetikleyici yatay iç boşluk (px-4)" },
    { name: "accordion-padding-y-sm", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "SM tetikleyici dikey iç boşluk (py-3)" },
    { name: "accordion-padding-md", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "MD tetikleyici yatay iç boşluk (px-5)" },
    { name: "accordion-padding-y-md", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "MD tetikleyici dikey iç boşluk (py-4)" },
    { name: "accordion-title-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Başlık ve ikon arası boşluk (gap-3)" },
    // Typography
    { name: "accordion-title-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Başlık font boyutu (text-sm)" },
    { name: "accordion-title-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Başlık font kalınlığı (font-semibold)" },
    { name: "accordion-desc-font-size-sm", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "SM açıklama font boyutu (text-xs)" },
    { name: "accordion-desc-font-size-md", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "MD açıklama font boyutu (text-sm)" },
    // Border
    { name: "accordion-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Kök kenar yarıçapı (rounded-[24px])" },
    { name: "accordion-header-radius", cssVar: "--radius-2.5xl", resolvedValue: "18px", tier: "component", category: "border", description: "Header buton kenar yarıçapı (rounded-[18px])" },
    { name: "accordion-icon-btn-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "component", category: "border", description: "İkon buton kenar yarıçapı (rounded-xl)" },
    { name: "accordion-divider-color", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "border", description: "Öğeler arası ayırıcı kenarlık rengi" },
    // Shadow
    { name: "accordion-root-shadow", cssVar: "--shadow-accordion", resolvedValue: "0 28px 60px -34px rgba(15,23,42,0.34)", tier: "component", category: "shadow", description: "Kök panel gölge efekti" },
    { name: "accordion-header-hover-shadow", cssVar: "--shadow-header-hover", resolvedValue: "0 18px 34px -28px rgba(15,23,42,0.24)", tier: "component", category: "shadow", description: "Header hover gölge efekti" },
    { name: "accordion-icon-btn-shadow", cssVar: "--shadow-icon-btn", resolvedValue: "0 14px 28px -22px rgba(15,23,42,0.32)", tier: "component", category: "shadow", description: "İkon buton gölge efekti" },
    // Sizing
    { name: "accordion-icon-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Genişletme ikonu boyutu (h-4 w-4)" },
    // Motion
    { name: "accordion-icon-transition", cssVar: "--transition-transform", resolvedValue: "transform 150ms ease", tier: "global", category: "motion", description: "İkon dönme geçiş efekti (rotate-180)" },
  ],
  DatePicker: [
    // Colors
    { name: "datepicker-bg", cssVar: "--surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Tarih seçici arka plan rengi" },
    { name: "datepicker-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Tarih seçici kenarlık rengi" },
    { name: "datepicker-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "datepicker-border-error", cssVar: "--feedback-error", resolvedValue: "var(--feedback-error)", tier: "alias", category: "color", description: "Hata durumu kenarlık rengi" },
    { name: "datepicker-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Giriş metin rengi" },
    { name: "datepicker-placeholder", cssVar: "--text-disabled", resolvedValue: "var(--text-disabled)/90", tier: "alias", category: "color", description: "Placeholder metin rengi (%90 opasite)" },
    { name: "datepicker-badge-bg", cssVar: "--surface-canvas", resolvedValue: "var(--surface-canvas)", tier: "alias", category: "color", description: "Değer rozet arka plan rengi" },
    { name: "datepicker-badge-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Değer rozet kenarlık rengi" },
    // Spacing
    { name: "datepicker-badge-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Rozet yatay iç boşluk (px-3)" },
    { name: "datepicker-badge-padding-y", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Rozet dikey iç boşluk (py-1)" },
    // Typography
    { name: "datepicker-badge-font-size", cssVar: "--font-size-xs", resolvedValue: "12px", tier: "global", category: "typography", description: "Rozet font boyutu (text-xs)" },
    { name: "datepicker-badge-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Rozet font kalınlığı (font-medium)" },
    // Border
    { name: "datepicker-border-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Rozet kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "datepicker-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Varsayılan giriş yüksekliği (md)" },
  ],
  Steps: [
    // Colors
    { name: "steps-indicator-active-bg", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif/tamamlanmış adım gösterge arka planı" },
    { name: "steps-indicator-active-text", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "global", category: "color", description: "Aktif adım gösterge metin rengi" },
    { name: "steps-indicator-wait-border", cssVar: "--border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Bekleyen adım kenarlık rengi" },
    { name: "steps-indicator-error-border", cssVar: "--feedback-error", resolvedValue: "var(--feedback-error)", tier: "alias", category: "color", description: "Hata adımı kenarlık rengi" },
    { name: "steps-connector-active", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Tamamlanmış bağlantı çizgisi rengi" },
    { name: "steps-description-text", cssVar: "--text-tertiary", resolvedValue: "var(--text-tertiary)", tier: "alias", category: "color", description: "Adım açıklama metin rengi" },
    // Spacing
    { name: "steps-vertical-gap", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Dikey adımlar arası boşluk (pb-6)" },
    { name: "steps-title-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Gösterge ve başlık arası boşluk (ml-3)" },
    // Typography
    { name: "steps-title-font-weight", cssVar: "--font-weight-medium", resolvedValue: "500", tier: "global", category: "typography", description: "Adım başlık font kalınlığı (font-medium)" },
    // Border
    { name: "steps-indicator-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Gösterge kenar yarıçapı (rounded-full)" },
    // Sizing
    { name: "steps-indicator-sm", cssVar: "--size-6", resolvedValue: "24px", tier: "component", category: "sizing", description: "Küçük gösterge boyutu (h-6 w-6)" },
    { name: "steps-indicator-md", cssVar: "--size-8", resolvedValue: "32px", tier: "component", category: "sizing", description: "Orta gösterge boyutu (h-8 w-8)" },
    { name: "steps-indicator-lg", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Büyük gösterge boyutu (h-10 w-10)" },
    { name: "steps-connector-height", cssVar: "--size-px", resolvedValue: "1px", tier: "component", category: "sizing", description: "Bağlantı çizgisi kalınlığı (h-px)" },
  ],
  List: [
    // Colors
    { name: "list-surface-bg-start", cssVar: "--color-surface-default", resolvedValue: "rgba(255,255,255,0.98)", tier: "alias", category: "color", description: "Panel gradient başlangıç rengi" },
    { name: "list-surface-bg-end", cssVar: "--color-surface-subtle", resolvedValue: "rgba(245,246,255,0.94)", tier: "alias", category: "color", description: "Panel gradient bitiş rengi" },
    { name: "list-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)/80", tier: "alias", category: "color", description: "Panel kenarlık rengi (%80 opasite)" },
    { name: "list-item-title-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Öğe başlık metin rengi" },
    { name: "list-selected-bg", cssVar: "--action-primary-soft", resolvedValue: "var(--action-primary-soft)/60", tier: "alias", category: "color", description: "Seçili öğe arka plan rengi (%60 opasite)" },
    // Spacing
    { name: "list-padding-comfortable", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Rahat yoğunluk iç boşluk (px-4 py-4)" },
    { name: "list-padding-compact", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Sıkı yoğunluk iç boşluk (px-4 py-3)" },
    { name: "list-items-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Öğeler arası boşluk (space-y-3)" },
    // Typography
    { name: "list-title-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Öğe başlık font boyutu (text-sm)" },
    { name: "list-title-font-weight", cssVar: "--font-weight-semibold", resolvedValue: "600", tier: "global", category: "typography", description: "Öğe başlık font kalınlığı (font-semibold)" },
    // Border
    { name: "list-surface-radius", cssVar: "--radius-3xl", resolvedValue: "28px", tier: "component", category: "border", description: "Panel kenar yarıçapı (rounded-[28px])" },
    { name: "list-item-radius", cssVar: "--radius-3xl", resolvedValue: "24px", tier: "component", category: "border", description: "Öğe kenar yarıçapı (rounded-[24px])" },
    // Shadow
    { name: "list-surface-shadow", cssVar: "--shadow-panel", resolvedValue: "0 22px 48px -34px rgba(15,23,42,0.28)", tier: "component", category: "shadow", description: "Panel gölge efekti" },
    { name: "list-selected-shadow", cssVar: "--shadow-selected", resolvedValue: "0 18px 34px -28px rgba(79,70,229,0.38)", tier: "component", category: "shadow", description: "Seçili öğe gölge efekti" },
  ],
  Combobox: [
    // Colors
    { name: "combobox-border-focus", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Odaklanmış kenarlık rengi" },
    { name: "combobox-popup-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Açılır panel arka plan rengi" },
    { name: "combobox-popup-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Açılır panel kenarlık rengi" },
    { name: "combobox-option-highlight-bg", cssVar: "--action-primary-soft", resolvedValue: "var(--action-primary-soft)", tier: "alias", category: "color", description: "Vurgulanan seçenek arka plan rengi" },
    { name: "combobox-tag-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Etiket arka plan rengi (çoklu seçim)" },
    { name: "combobox-group-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Grup etiket metin rengi" },
    // Spacing
    { name: "combobox-popup-padding", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Açılır panel iç boşluk (p-2)" },
    { name: "combobox-option-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Seçenek yatay iç boşluk (px-3)" },
    // Typography
    { name: "combobox-option-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Seçenek font boyutu (text-sm)" },
    { name: "combobox-group-font-size", cssVar: "--font-size-3xs", resolvedValue: "11px", tier: "component", category: "typography", description: "Grup etiketi font boyutu (text-[11px])" },
    { name: "combobox-group-tracking", cssVar: "--tracking-widest", resolvedValue: "0.18em", tier: "component", category: "typography", description: "Grup etiketi harf aralığı (tracking-[0.18em])" },
    // Border
    { name: "combobox-popup-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Açılır panel kenar yarıçapı (rounded-2xl)" },
    { name: "combobox-tag-radius", cssVar: "--radius-full", resolvedValue: "9999px", tier: "global", category: "border", description: "Etiket kenar yarıçapı (rounded-full)" },
    // Shadow
    { name: "combobox-popup-shadow", cssVar: "--shadow-xl", resolvedValue: "var(--shadow-xl)", tier: "global", category: "shadow", description: "Açılır panel gölge efekti (shadow-xl)" },
    // Sizing
    { name: "combobox-popup-max-height", cssVar: "--size-72", resolvedValue: "288px", tier: "component", category: "sizing", description: "Açılır panel maksimum yükseklik (max-h-72)" },
  ],
  CommandPalette: [
    // Colors
    { name: "cmdpalette-overlay-bg", cssVar: "--surface-overlay-bg", resolvedValue: "rgba(0,0,0,0.5)", tier: "alias", category: "color", description: "Arka plan örtü rengi (overlay)" },
    { name: "cmdpalette-dialog-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Diyalog panel arka plan rengi" },
    { name: "cmdpalette-dialog-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Diyalog panel kenarlık rengi" },
    { name: "cmdpalette-item-active-bg", cssVar: "--action-primary-soft", resolvedValue: "rgba(79,70,229,0.08)", tier: "alias", category: "color", description: "Aktif öğe arka plan rengi" },
    { name: "cmdpalette-item-active-border", cssVar: "--action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Aktif öğe kenarlık rengi" },
    { name: "cmdpalette-group-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Grup etiketi metin rengi" },
    // Spacing
    { name: "cmdpalette-header-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Header iç boşluk (px-6 py-5)" },
    { name: "cmdpalette-item-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Öğe iç boşluk (px-4 py-3)" },
    // Typography
    { name: "cmdpalette-title-font-size", cssVar: "--font-size-lg", resolvedValue: "18px", tier: "global", category: "typography", description: "Başlık font boyutu (text-lg)" },
    { name: "cmdpalette-group-font-size", cssVar: "--font-size-3xs", resolvedValue: "11px", tier: "component", category: "typography", description: "Grup etiketi font boyutu (text-[11px])" },
    { name: "cmdpalette-group-tracking", cssVar: "--tracking-widest", resolvedValue: "0.24em", tier: "component", category: "typography", description: "Grup etiketi harf aralığı (tracking-[0.24em])" },
    // Border
    { name: "cmdpalette-dialog-radius", cssVar: "--radius-4xl", resolvedValue: "32px", tier: "component", category: "border", description: "Diyalog kenar yarıçapı (rounded-[32px])" },
    { name: "cmdpalette-item-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Öğe kenar yarıçapı (rounded-2xl)" },
    // Shadow
    { name: "cmdpalette-dialog-shadow", cssVar: "--shadow-2xl", resolvedValue: "var(--shadow-2xl)", tier: "global", category: "shadow", description: "Diyalog gölge efekti (shadow-2xl)" },
    // Sizing
    { name: "cmdpalette-dialog-max-width", cssVar: "--size-3xl", resolvedValue: "768px", tier: "component", category: "sizing", description: "Diyalog maksimum genişlik (max-w-3xl)" },
  ],
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
    { name: "descriptions-tone-info", cssVar: "--state-info-border", resolvedValue: "var(--state-info-border,#3b82f6)", tier: "alias", category: "color", description: "Bilgi tonu sol kenarlık rengi" },
    { name: "descriptions-tone-success", cssVar: "--state-success-border", resolvedValue: "var(--state-success-border,#22c55e)", tier: "alias", category: "color", description: "Başarılı tonu sol kenarlık rengi" },
    { name: "descriptions-tone-warning", cssVar: "--state-warning-border", resolvedValue: "var(--state-warning-border,#eab308)", tier: "alias", category: "color", description: "Uyarı tonu sol kenarlık rengi" },
    { name: "descriptions-tone-danger", cssVar: "--state-danger-border", resolvedValue: "var(--state-danger-border,#ef4444)", tier: "alias", category: "color", description: "Tehlike tonu sol kenarlık rengi" },
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
    { name: "slider-content-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "İçerik dikey boşluk (space-y-3)" },
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
    { name: "summary-strip-card-bg", cssVar: "--surface-card", resolvedValue: "var(--surface-card,var(--surface-default))", tier: "alias", category: "color", description: "Metrik kartı arka plan rengi" },
    { name: "summary-strip-card-border", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Kart kenarlık rengi" },
    { name: "summary-strip-label-text", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Metrik etiket metin rengi" },
    { name: "summary-strip-value-text", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Metrik değer metin rengi" },
    { name: "summary-strip-icon-bg", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "İkon arka plan rengi" },
    { name: "summary-strip-tone-info", cssVar: "--state-info-border", resolvedValue: "#3b82f6", tier: "alias", category: "color", description: "Info ton sol kenarlık rengi" },
    { name: "summary-strip-tone-success", cssVar: "--state-success-border", resolvedValue: "#22c55e", tier: "alias", category: "color", description: "Success ton sol kenarlık rengi" },
    { name: "summary-strip-tone-warning", cssVar: "--state-warning-border", resolvedValue: "#f59e0b", tier: "alias", category: "color", description: "Warning ton sol kenarlık rengi" },
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
    { name: "detail-drawer-backdrop", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.4)", tier: "alias", category: "color", description: "Arka plan karartma rengi (bg-black/40)" },
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
    { name: "form-drawer-backdrop", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.4)", tier: "alias", category: "color", description: "Arka plan karartma rengi (bg-black/40)" },
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
    { name: "detail-summary-section-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bölümler arası dikey boşluk (space-y-4)" },
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
    { name: "tabs-pill-active-text", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Pill varyant aktif sekme metin rengi" },
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
    { name: "eel-content-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "İçerik elemanları arası boşluk (space-y-4)" },
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
    { name: "menubar-active-text", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Aktif sekme metin rengi" },
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
    { name: "navmenu-active-text", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Aktif rota metin rengi" },
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
    { name: "actionheader-selection-text", cssVar: "--color-white", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Seçim sayacı metin rengi" },
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
    { name: "tourcoachmarks-section-gap", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Bölümler arası boşluk (space-y-6)" },
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
    { name: "reportfilter-submit-text", cssVar: "--action-primary-text", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Filtrele butonu metin rengi" },
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
    { name: "ai-authoring-confidence-bg", cssVar: "--surface-default", resolvedValue: "#fff", tier: "alias", category: "color", description: "Güven skoru kutusu arka plan rengi" },
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
    { name: "audit-timeline-dot-default", cssVar: "--border-default", resolvedValue: "#cbd5e1", tier: "alias", category: "color", description: "Varsayılan zaman noktası rengi" },
    { name: "audit-timeline-line", cssVar: "--border-subtle", resolvedValue: "rgba(203,213,225,0.65)", tier: "component", category: "color", description: "Bağlantı çizgisi rengi" },
    { name: "audit-timeline-actor-ai", cssVar: "--color-state-info", resolvedValue: "var(--color-state-info)", tier: "alias", category: "color", description: "AI aktörü rozet rengi" },
    { name: "audit-timeline-actor-human", cssVar: "--color-state-success", resolvedValue: "var(--color-state-success)", tier: "alias", category: "color", description: "İnsan aktörü rozet rengi" },
    // Spacing
    { name: "audit-timeline-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "audit-timeline-item-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Zaman öğeleri arası boşluk (space-y-3)" },
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
    { name: "prompt-composer-scope-active", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Aktif kapsam butonu rengi" },
    { name: "prompt-composer-guardrail-badge", cssVar: "--color-state-warning", resolvedValue: "var(--color-state-warning)", tier: "alias", category: "color", description: "Koruma kuralı rozet rengi" },
    // Spacing
    { name: "prompt-composer-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel iç boşluk (p-5)" },
    { name: "prompt-composer-grid-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Grid öğeleri arası boşluk (gap-4)" },
    { name: "prompt-composer-field-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Form alanları arası boşluk (space-y-4)" },
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
    { name: "citation-panel-item-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Atıf öğeleri arası boşluk (space-y-3)" },
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
    { name: "command-header-search-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Arama alanı arka plan rengi" },
    { name: "command-header-search-text", cssVar: "--text-primary", resolvedValue: "#0f172a", tier: "alias", category: "color", description: "Arama metni rengi" },
    { name: "command-header-search-placeholder", cssVar: "--text-tertiary", resolvedValue: "#94a3b8", tier: "alias", category: "color", description: "Arama placeholder rengi" },
    { name: "command-header-favorite-active", cssVar: "--color-state-warning", resolvedValue: "#f59e0b", tier: "alias", category: "color", description: "Aktif favori yıldız rengi" },
    { name: "command-header-recent-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Son kullanılanlar bölümü arka planı" },
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
    { name: "command-workspace-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Komut çalışma alanı arka planı" },
    { name: "command-workspace-sidebar-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Bağlam paneli arka plan rengi" },
    { name: "command-workspace-search-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Arama çubuğu arka planı" },
    { name: "command-workspace-result-hover", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Sonuç satırı hover arka planı" },
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
    { name: "crud-template-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "CRUD şablon arka planı" },
    { name: "crud-template-header-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Başlık alanı arka planı" },
    { name: "crud-template-filter-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Filtre çubuğu arka planı" },
    { name: "crud-template-row-hover", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Tablo satırı hover rengi" },
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
    { name: "crud-template-table-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "border", description: "Tablo kenarlık rengi" },
    // Sizing
    { name: "crud-template-filter-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Filtre çubuğu yüksekliği" },
  ],
  DashboardTemplate: [
    // Color
    { name: "dashboard-template-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Dashboard arka planı" },
    { name: "dashboard-template-kpi-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "KPI kart arka planı" },
    { name: "dashboard-template-kpi-accent", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "KPI vurgu rengi" },
    { name: "dashboard-template-card-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Özet kart arka planı" },
    { name: "dashboard-template-card-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Özet kart kenarlık rengi" },
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
    { name: "detail-template-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Detay şablon arka planı" },
    { name: "detail-template-header-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Varlık başlık alanı arka planı" },
    { name: "detail-template-rail-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Inspector rail arka planı" },
    { name: "detail-template-section-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Bölüm ayırıcı kenarlık rengi" },
    { name: "detail-template-metadata-text", cssVar: "--text-secondary", resolvedValue: "#64748b", tier: "alias", category: "color", description: "Metadata etiket rengi" },
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
  SettingsTemplate: [
    // Color
    { name: "settings-template-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Ayarlar şablon arka planı" },
    { name: "settings-template-section-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Ayar bölümü arka planı" },
    { name: "settings-template-aside-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Kural paneli arka planı" },
    { name: "settings-template-tab-active", cssVar: "--color-action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Aktif sekme vurgu rengi" },
    { name: "settings-template-tab-inactive", cssVar: "--text-secondary", resolvedValue: "#64748b", tier: "alias", category: "color", description: "Pasif sekme metin rengi" },
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
    { name: "preset-compare-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Karşılaştırma paneli arka planı" },
    { name: "preset-compare-card-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Preset kart arka planı" },
    { name: "preset-compare-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Panel kenarlık rengi" },
    { name: "preset-compare-axis-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Eksen satır arka planı" },
    { name: "preset-compare-text-primary", cssVar: "--text-primary", resolvedValue: "#0f172a", tier: "alias", category: "color", description: "Birincil metin rengi" },
    { name: "preset-compare-text-secondary", cssVar: "--text-secondary", resolvedValue: "#64748b", tier: "alias", category: "color", description: "İkincil metin rengi" },
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
    { name: "preset-gallery-bg", cssVar: "--surface-muted", resolvedValue: "#f8fafc", tier: "alias", category: "color", description: "Galeri arka planı" },
    { name: "preset-gallery-card-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Preset kart arka planı" },
    { name: "preset-gallery-card-selected-bg", cssVar: "--action-primary-soft", resolvedValue: "rgba(238,242,255,0.98)", tier: "alias", category: "color", description: "Seçili preset kart arka planı" },
    { name: "preset-gallery-card-selected-border", cssVar: "--action-primary-border", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Seçili preset kenarlık rengi" },
    { name: "preset-gallery-card-hover", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "Kart hover arka planı" },
    { name: "preset-gallery-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Galeri kenarlık rengi" },
    { name: "preset-gallery-badge-success", cssVar: "--color-state-success", resolvedValue: "#16a34a", tier: "alias", category: "color", description: "Default rozet rengi" },
    { name: "preset-gallery-badge-warning", cssVar: "--color-state-warning", resolvedValue: "#f59e0b", tier: "alias", category: "color", description: "Yüksek kontrast rozet rengi" },
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
    { name: "preview-card-bg", cssVar: "--surface-default", resolvedValue: "#ffffff", tier: "alias", category: "color", description: "Önizleme kartı arka planı" },
    { name: "preview-card-selected-border", cssVar: "--action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Seçili kart kenarlık rengi" },
    { name: "preview-card-unselected-border", cssVar: "--border-subtle", resolvedValue: "#e2e8f0", tier: "alias", category: "color", description: "Seçili olmayan kart kenarlık rengi" },
    { name: "preview-card-hover-border", cssVar: "--text-secondary", resolvedValue: "#64748b", tier: "alias", category: "color", description: "Hover kenarlık rengi" },
    { name: "preview-card-check-bg", cssVar: "--action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Seçim onay daire arka planı" },
    { name: "preview-card-skeleton-bg", cssVar: "--surface-muted", resolvedValue: "#f1f5f9", tier: "alias", category: "color", description: "İskelet önizleme arka planı" },
    { name: "preview-card-button-bg", cssVar: "--action-primary", resolvedValue: "#2563eb", tier: "alias", category: "color", description: "Mini buton arka planı" },
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

/* ---- Public API ---- */

export function getTokensForComponent(componentName: string): TokenEntry[] {
  return _tokenMap[componentName] ?? [];
}

export function hasTokens(componentName: string): boolean {
  return componentName in _tokenMap && _tokenMap[componentName].length > 0;
}

export function getTokenCategories(tokens: TokenEntry[]): TokenCategory[] {
  const cats = new Set(tokens.map((t) => t.category));
  const order: TokenCategory[] = ["color", "spacing", "typography", "border", "shadow", "sizing", "motion"];
  return order.filter((c) => cats.has(c));
}

export function generateThemeOverride(componentName: string, overrides: Record<string, string>): string {
  const entries = Object.entries(overrides)
    .map(([varName, value]) => `  "${varName}": "${value}"`)
    .join(",\n");

  return `// Theme override for ${componentName}
const ${componentName.toLowerCase()}Overrides = {
${entries}
};

// Apply in theme config:
// <ThemeProvider overrides={{ ${componentName.toLowerCase()}: ${componentName.toLowerCase()}Overrides }}>`;
}
