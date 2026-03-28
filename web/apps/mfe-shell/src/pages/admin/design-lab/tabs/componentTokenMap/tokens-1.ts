import type { TokenEntry } from "./types";

export const tokenMap1: Record<string, TokenEntry[]> = {
  Button: [
    // Colors
    { name: "button-bg-primary", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary button background" },
    { name: "button-bg-primary-hover", cssVar: "--color-action-primary-hover", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Primary button hover background" },
    { name: "button-bg-secondary", cssVar: "--color-surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Secondary button background" },
    { name: "button-bg-ghost", cssVar: "--color-transparent", resolvedValue: "transparent", tier: "component", category: "color", description: "Ghost button background" },
    { name: "button-text-primary", cssVar: "--color-text-inverse", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Primary button text" },
    { name: "button-text-secondary", cssVar: "--color-text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Secondary button text" },
    { name: "button-border", cssVar: "--color-border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Button border color" },
    { name: "button-focus-ring", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Focus ring color" },
    { name: "button-disabled-bg", cssVar: "--color-surface-disabled", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Disabled button background" },
    { name: "button-disabled-text", cssVar: "--color-text-disabled", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Disabled button text" },
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
    { name: "input-bg", cssVar: "--color-surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Input background" },
    { name: "input-bg-disabled", cssVar: "--color-surface-disabled", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Disabled input background" },
    { name: "input-border", cssVar: "--color-border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Input border" },
    { name: "input-border-focus", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Focused input border" },
    { name: "input-border-error", cssVar: "--color-feedback-error", resolvedValue: "var(--state-danger-text)", tier: "alias", category: "color", description: "Error state border" },
    { name: "input-text", cssVar: "--color-text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Input text" },
    { name: "input-placeholder", cssVar: "--color-text-tertiary", resolvedValue: "var(--text-subtle)", tier: "alias", category: "color", description: "Placeholder text" },
    { name: "input-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Input height" },
    { name: "input-padding-x", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Input horizontal padding" },
    { name: "input-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Input border radius" },
    { name: "input-font-size", cssVar: "--font-size-sm", resolvedValue: "14px", tier: "global", category: "typography", description: "Input font size" },
    { name: "input-focus-ring-width", cssVar: "--ring-width-2", resolvedValue: "2px", tier: "component", category: "border", description: "Focus ring width" },
  ],
  Select: [
    { name: "select-bg", cssVar: "--color-surface-default", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Select trigger background" },
    { name: "select-border", cssVar: "--color-border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Select border" },
    { name: "select-dropdown-bg", cssVar: "--color-surface-elevated", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Dropdown background" },
    { name: "select-option-hover", cssVar: "--color-surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Option hover background" },
    { name: "select-height", cssVar: "--size-10", resolvedValue: "40px", tier: "component", category: "sizing", description: "Select trigger height" },
    { name: "select-dropdown-shadow", cssVar: "--shadow-lg", resolvedValue: "0 10px 15px -3px rgba(0,0,0,0.1)", tier: "global", category: "shadow", description: "Dropdown shadow" },
    { name: "select-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Select border radius" },
  ],
  Alert: [
    { name: "alert-bg-info", cssVar: "--color-feedback-info-light", resolvedValue: "var(--state-info-bg)", tier: "alias", category: "color", description: "Info alert background" },
    { name: "alert-bg-success", cssVar: "--color-feedback-success-light", resolvedValue: "var(--state-success-bg)", tier: "alias", category: "color", description: "Success alert background" },
    { name: "alert-bg-warning", cssVar: "--color-feedback-warning-light", resolvedValue: "var(--state-warning-bg)", tier: "alias", category: "color", description: "Warning alert background" },
    { name: "alert-bg-error", cssVar: "--color-feedback-error-light", resolvedValue: "var(--state-danger-bg)", tier: "alias", category: "color", description: "Error alert background" },
    { name: "alert-border-radius", cssVar: "--radius-xl", resolvedValue: "12px", tier: "global", category: "border", description: "Alert border radius" },
    { name: "alert-padding", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Alert padding" },
    { name: "alert-icon-size", cssVar: "--size-5", resolvedValue: "20px", tier: "component", category: "sizing", description: "Alert icon size" },
  ],
  Checkbox: [
    { name: "checkbox-size", cssVar: "--size-4", resolvedValue: "16px", tier: "component", category: "sizing", description: "Checkbox size" },
    { name: "checkbox-border", cssVar: "--color-border-default", resolvedValue: "var(--border-default)", tier: "alias", category: "color", description: "Checkbox border" },
    { name: "checkbox-checked-bg", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Checked background" },
    { name: "checkbox-border-radius", cssVar: "--radius-sm", resolvedValue: "4px", tier: "global", category: "border", description: "Checkbox border radius" },
    { name: "checkbox-label-gap", cssVar: "--spacing-2", resolvedValue: "8px", tier: "global", category: "spacing", description: "Gap between checkbox and label" },
  ],
  Modal: [
    { name: "modal-overlay-bg", cssVar: "--color-overlay", resolvedValue: "rgba(0,0,0,0.5)", tier: "alias", category: "color", description: "Backdrop overlay" },
    { name: "modal-surface-bg", cssVar: "--color-surface-elevated", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Modal surface" },
    { name: "modal-border-radius", cssVar: "--radius-2xl", resolvedValue: "16px", tier: "global", category: "border", description: "Modal border radius" },
    { name: "modal-shadow", cssVar: "--shadow-2xl", resolvedValue: "0 25px 50px -12px rgba(0,0,0,0.25)", tier: "global", category: "shadow", description: "Modal shadow" },
    { name: "modal-padding", cssVar: "--spacing-6", resolvedValue: "24px", tier: "global", category: "spacing", description: "Modal content padding" },
    { name: "modal-max-width", cssVar: "--size-lg", resolvedValue: "512px", tier: "component", category: "sizing", description: "Default max width" },
  ],
  Pagination: [
    { name: "pagination-item-size", cssVar: "--size-9", resolvedValue: "36px", tier: "component", category: "sizing", description: "Page button size" },
    { name: "pagination-active-bg", cssVar: "--color-action-primary", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Active page background" },
    { name: "pagination-active-text", cssVar: "--color-text-inverse", resolvedValue: "var(--surface-default)", tier: "alias", category: "color", description: "Active page text" },
    { name: "pagination-gap", cssVar: "--spacing-1", resolvedValue: "4px", tier: "global", category: "spacing", description: "Gap between page buttons" },
    { name: "pagination-border-radius", cssVar: "--radius-lg", resolvedValue: "8px", tier: "global", category: "border", description: "Page button radius" },
  ],
  SearchFilterListing: [
    // Color
    { name: "sfl-surface-card", cssVar: "--surface-card", resolvedValue: "var(--surface-default-bg))", tier: "alias", category: "color", description: "Panel arka plan rengi (koyu modda otomatik uyum saglar)" },
    { name: "sfl-surface-muted", cssVar: "--surface-muted", resolvedValue: "var(--surface-muted)", tier: "alias", category: "color", description: "Chip, skeleton, totalCount badge ve bos durum ikon arka plani" },
    { name: "sfl-surface-hover", cssVar: "--surface-hover", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Filtre chip hover arka plan rengi" },
    { name: "sfl-text-primary", cssVar: "--text-primary", resolvedValue: "var(--text-primary)", tier: "alias", category: "color", description: "Baslik, liste basligi ve chip metin rengi" },
    { name: "sfl-text-secondary", cssVar: "--text-secondary", resolvedValue: "var(--text-secondary)", tier: "alias", category: "color", description: "Aciklama, eyebrow, siralama ve totalCount metin rengi" },
    { name: "sfl-action-primary-bg", cssVar: "--action-primary-bg", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Chip kaldir hover, secim sayaci badge ve tumunu temizle link rengi" },
    { name: "sfl-selection-outline", cssVar: "--selection-outline", resolvedValue: "var(--action-primary)", tier: "alias", category: "color", description: "Secim cubugu kenarligi ve siralama dropdown focus rengi" },
    { name: "sfl-selection-bg", cssVar: "--selection-bg", resolvedValue: "var(--state-info-bg)", tier: "alias", category: "color", description: "Secim cubugu arka plan rengi" },
    { name: "sfl-border-subtle", cssVar: "--border-subtle", resolvedValue: "var(--border-subtle)", tier: "alias", category: "color", description: "Panel, chip ve siralama dropdown kenarlik rengi" },
    // Spacing
    { name: "sfl-panel-padding", cssVar: "--spacing-5", resolvedValue: "20px", tier: "global", category: "spacing", description: "Panel ic boslugu (default mod, p-5)" },
    { name: "sfl-panel-padding-compact", cssVar: "--spacing-3", resolvedValue: "12px", tier: "component", category: "spacing", description: "Panel ic boslugu (compact mod, p-3)" },
    { name: "sfl-section-gap", cssVar: "--spacing-4", resolvedValue: "16px", tier: "global", category: "spacing", description: "Bolumler arasi dikey bosluk (gap-4 / gap-2 compact)" },
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
    { name: "switch-thumb-bg", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "global", category: "color", description: "Thumb (düğme) arka plan rengi" },
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
    { name: "popover-panel-ring", cssVar: "--color-white-alpha-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Panel dış halka rengi (ring-surface-default/75)" },
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
    { name: "accordion-ring", cssVar: "--color-white-alpha-75", resolvedValue: "rgba(255,255,255,0.75)", tier: "component", category: "color", description: "Dış halka rengi (ring-surface-default/75)" },
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
    { name: "steps-indicator-active-text", cssVar: "--color-white", resolvedValue: "var(--surface-default)", tier: "global", category: "color", description: "Aktif adım gösterge metin rengi" },
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
    { name: "list-items-gap", cssVar: "--spacing-3", resolvedValue: "12px", tier: "global", category: "spacing", description: "Öğeler arası boşluk (gap-3)" },
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
};
