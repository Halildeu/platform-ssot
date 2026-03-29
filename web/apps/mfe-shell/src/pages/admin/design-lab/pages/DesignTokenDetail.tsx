import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Type, Ruler, Circle, Zap, Layers, Copy, Check } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  DesignTokenDetail — Interactive token visualization per group      */
/* ------------------------------------------------------------------ */

/* ---- Token data (imported at build time from design-system) ---- */

const PALETTE = {
  white: "var(--surface-default)", black: "var(--text-primary)",
  gray50: "var(--surface-muted)", gray100: "var(--surface-muted)", gray200: "var(--border-subtle)", gray300: "var(--border-default)",
  gray400: "var(--text-subtle)", gray500: "var(--text-secondary)", gray600: "var(--text-secondary)", gray700: "var(--text-primary)",
  gray800: "var(--text-primary)", gray900: "var(--text-primary)",
  primary50: "var(--state-info-bg)", primary100: "var(--state-info-bg)", primary200: "var(--state-info-bg)", primary300: "var(--action-primary)",
  primary400: "var(--action-primary)", primary500: "var(--action-primary)", primary600: "var(--action-primary)", primary700: "var(--action-primary)",
  primary800: "var(--action-primary)", primary900: "var(--action-primary)",
  green50: "var(--state-success-bg)", green500: "var(--state-success-text)", green700: "var(--state-success-text)",
  amber50: "var(--state-warning-bg)", amber500: "var(--state-warning-text)", amber700: "var(--state-warning-text)",
  red50: "var(--state-danger-bg)", red500: "var(--state-danger-text)", red700: "var(--state-danger-text)",
  blue50: "var(--state-info-bg)", blue500: "var(--action-primary)", blue700: "var(--action-primary)",
} as const;

const SEMANTIC_TOKENS: Record<string, { token: string; cssVar: string; category: string }> = {
  "surface-default": { token: "surface-default", cssVar: "--surface-default", category: "Surfaces" },
  "surface-canvas": { token: "surface-canvas", cssVar: "--surface-canvas", category: "Surfaces" },
  "surface-muted": { token: "surface-muted", cssVar: "--surface-muted", category: "Surfaces" },
  "surface-raised": { token: "surface-raised", cssVar: "--surface-raised", category: "Surfaces" },
  "text-primary": { token: "text-primary", cssVar: "--text-primary", category: "Text" },
  "text-secondary": { token: "text-secondary", cssVar: "--text-secondary", category: "Text" },
  "text-disabled": { token: "text-disabled", cssVar: "--text-disabled", category: "Text" },
  "text-inverse": { token: "text-inverse", cssVar: "--text-inverse", category: "Text" },
  "border-default": { token: "border-default", cssVar: "--border-default", category: "Borders" },
  "border-subtle": { token: "border-subtle", cssVar: "--border-subtle", category: "Borders" },
  "border-strong": { token: "border-strong", cssVar: "--border-strong", category: "Borders" },
  "action-primary": { token: "action-primary", cssVar: "--action-primary", category: "Actions" },
  "action-primary-hover": { token: "action-primary-hover", cssVar: "--action-primary-hover", category: "Actions" },
  "action-primary-active": { token: "action-primary-active", cssVar: "--action-primary-active", category: "Actions" },
  "action-secondary": { token: "action-secondary", cssVar: "--action-secondary", category: "Actions" },
  "state-success-bg": { token: "state-success-bg", cssVar: "--state-success-bg", category: "State" },
  "state-success-text": { token: "state-success-text", cssVar: "--state-success-text", category: "State" },
  "state-warning-bg": { token: "state-warning-bg", cssVar: "--state-warning-bg", category: "State" },
  "state-warning-text": { token: "state-warning-text", cssVar: "--state-warning-text", category: "State" },
  "state-error-bg": { token: "state-error-bg", cssVar: "--state-error-bg", category: "State" },
  "state-error-text": { token: "state-error-text", cssVar: "--state-error-text", category: "State" },
  "state-info-bg": { token: "state-info-bg", cssVar: "--state-info-bg", category: "State" },
  "state-info-text": { token: "state-info-text", cssVar: "--state-info-text", category: "State" },
};

const FONT_FAMILY = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

const FONT_SIZE: Record<string, { value: string; px: string }> = {
  xs: { value: "0.75rem", px: "12px" },
  sm: { value: "0.875rem", px: "14px" },
  base: { value: "1rem", px: "16px" },
  lg: { value: "1.125rem", px: "18px" },
  xl: { value: "1.25rem", px: "20px" },
  "2xl": { value: "1.5rem", px: "24px" },
  "3xl": { value: "1.875rem", px: "30px" },
  "4xl": { value: "2.25rem", px: "36px" },
};

const FONT_WEIGHT: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };
const LINE_HEIGHT: Record<string, number> = { tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 };
const LETTER_SPACING: Record<string, string> = { tighter: "-0.05em", tight: "-0.025em", normal: "0em", wide: "0.025em", wider: "0.05em", widest: "0.1em" };

const SPACING: Record<string, string> = {
  "0": "0px", "0.5": "2px", "1": "4px", "1.5": "6px", "2": "8px", "2.5": "10px",
  "3": "12px", "3.5": "14px", "4": "16px", "5": "20px", "6": "24px", "7": "28px",
  "8": "32px", "9": "36px", "10": "40px", "11": "44px", "12": "48px", "14": "56px",
  "16": "64px", "20": "80px", "24": "96px", "28": "112px", "32": "128px",
};

const RADIUS: Record<string, string> = {
  none: "0px", sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "20px", "3xl": "24px", full: "9999px",
};

const DURATION: Record<string, string> = { instant: "0ms", fast: "100ms", normal: "200ms", slow: "300ms", slower: "500ms" };
const EASING: Record<string, string> = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

const ZINDEX: Record<string, number> = {
  base: 0, dropdown: 1000, sticky: 1100, fixed: 1200, backdrop: 1300,
  modal: 1400, popover: 1500, tooltip: 1600, toast: 1700, commandPalette: 1800,
};

/* ---- Helpers ---- */

const TOKEN_GROUP_ICONS: Record<string, React.ReactNode> = {
  colors: <Palette className="h-5 w-5" />,
  typography: <Type className="h-5 w-5" />,
  spacing: <Ruler className="h-5 w-5" />,
  radius: <Circle className="h-5 w-5" />,
  motion: <Zap className="h-5 w-5" />,
  zindex: <Layers className="h-5 w-5" />,
};

const TOKEN_GROUP_ACCENT: Record<string, string> = {
  colors: "bg-state-danger-text/10 text-state-danger-text",
  typography: "bg-action-primary/10 text-action-primary",
  spacing: "bg-state-success-text/10 text-state-success-text",
  radius: "bg-action-primary/10 text-action-primary",
  motion: "bg-state-warning-text/10 text-state-warning-text",
  zindex: "bg-action-primary/10 text-action-primary",
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
      title={`Copy: ${value}`}
    >
      {copied ? <Check className="h-3 w-3 text-state-success-text" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function DesignTokenDetail() {
  const { tokenGroup } = useParams<{ tokenGroup: string }>();
  const navigate = useNavigate();
  const { t } = useDesignLab();

  const icon = TOKEN_GROUP_ICONS[tokenGroup ?? ""] ?? <Palette className="h-5 w-5" />;
  const accent = TOKEN_GROUP_ACCENT[tokenGroup ?? ""] ?? "bg-surface-muted text-text-secondary";
  const title = t(`designlab.tokenGroup.${tokenGroup}.title`);
  const description = t(`designlab.tokenGroup.${tokenGroup}.description`);

  return (
    <div className="flex flex-col gap-8">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => navigate("/admin/design-lab/design")}
        className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Design Tokens
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative flex items-start gap-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
            {icon}
          </div>
          <div>
            <Text as="div" className="text-2xl font-extrabold tracking-tight text-text-primary">{title}</Text>
            <Text variant="secondary" className="mt-1 text-sm leading-relaxed">{description}</Text>
          </div>
        </div>
      </div>

      {/* Token content — switches by group */}
      {tokenGroup === "colors" && <ColorsContent />}
      {tokenGroup === "typography" && <TypographyContent />}
      {tokenGroup === "spacing" && <SpacingContent />}
      {tokenGroup === "radius" && <RadiusContent />}
      {tokenGroup === "motion" && <MotionContent />}
      {tokenGroup === "zindex" && <ZIndexContent />}
    </div>
  );
}

/* ================================================================== */
/*  Colors                                                             */
/* ================================================================== */

function ColorsContent() {
  const paletteGroups = useMemo(() => {
    const groups: Record<string, Array<{ name: string; value: string }>> = {};
    for (const [name, value] of Object.entries(PALETTE)) {
      const group = name.replace(/\d+$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
      if (!groups[group]) groups[group] = [];
      groups[group].push({ name, value });
    }
    return groups;
  }, []);

  const semanticGroups = useMemo(() => {
    const groups: Record<string, Array<{ token: string; cssVar: string }>> = {};
    for (const entry of Object.values(SEMANTIC_TOKENS)) {
      if (!groups[entry.category]) groups[entry.category] = [];
      groups[entry.category].push(entry);
    }
    return groups;
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Palette */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Raw palette</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Color Palette</Text>
        <div className="flex flex-col gap-6">
          {Object.entries(paletteGroups).map(([group, colors]) => (
            <div key={group}>
              <Text variant="secondary" className="mb-2 text-xs font-semibold uppercase tracking-wider">{group}</Text>
              <div className="flex flex-wrap gap-2">
                {colors.map(({ name, value }) => (
                  <div key={name} className="group relative">
                    <div
                      className="h-14 w-14 rounded-xl border border-border-subtle shadow-xs transition-[scale] duration-200 group-hover:scale-110"
                      style={{ backgroundColor: value }}
                    />
                    <div className="mt-1.5 text-center">
                      <Text className="block text-[10px] font-medium text-text-primary">{name}</Text>
                      <div className="flex items-center justify-center gap-0.5">
                        <Text variant="secondary" className="text-[9px] font-mono">{value}</Text>
                        <CopyButton value={value} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic tokens */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Design intent</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Semantic Color Tokens</Text>
        <div className="flex flex-col gap-6">
          {Object.entries(semanticGroups).map(([category, tokens]) => (
            <div key={category}>
              <Text variant="secondary" className="mb-3 text-xs font-semibold uppercase tracking-wider">{category}</Text>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {tokens.map(({ token, cssVar }) => (
                  <div
                    key={token}
                    className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-default px-3 py-2.5 transition hover:border-border-default hover:shadow-xs"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-lg border border-border-subtle" style={{ backgroundColor: `var(${cssVar})` }} />
                    <div className="min-w-0 flex-1">
                      <Text className="truncate text-xs font-semibold text-text-primary">{token}</Text>
                      <Text variant="secondary" className="truncate font-mono text-[10px]">{cssVar}</Text>
                    </div>
                    <CopyButton value={`var(${cssVar})`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/*  Typography                                                         */
/* ================================================================== */

function TypographyContent() {
  return (
    <div className="flex flex-col gap-10">
      {/* Font Families */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Typefaces</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Font Families</Text>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(FONT_FAMILY).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border-subtle bg-surface-default p-5">
              <div className="flex items-center justify-between">
                <Text className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{name}</Text>
                <CopyButton value={value} />
              </div>
              <Text as="div" className="mt-3 text-2xl text-text-primary" style={{ fontFamily: value }}>
                The quick brown fox jumps over the lazy dog
              </Text>
              <Text variant="secondary" className="mt-2 font-mono text-[10px] leading-5">{value}</Text>
            </div>
          ))}
        </div>
      </section>

      {/* Font Sizes */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Scale</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Font Sizes</Text>
        <div className="flex flex-col gap-3">
          {Object.entries(FONT_SIZE).map(([name, { value, px }]) => (
            <div key={name} className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-default px-4 py-3 transition hover:border-border-default">
              <div className="w-12 shrink-0">
                <Text className="text-xs font-semibold text-text-secondary">{name}</Text>
              </div>
              <Text as="div" className="flex-1 truncate text-text-primary" style={{ fontSize: value }}>
                Design System
              </Text>
              <div className="flex items-center gap-2">
                <Text variant="secondary" className="font-mono text-[10px]">{value}</Text>
                <Text variant="secondary" className="font-mono text-[10px] text-text-disabled">({px})</Text>
                <CopyButton value={value} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Weight</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Font Weights</Text>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(FONT_WEIGHT).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border-subtle bg-surface-default p-4">
              <Text as="div" className="text-xl text-text-primary" style={{ fontWeight: value }}>Aa</Text>
              <div className="mt-2 flex items-center justify-between">
                <Text className="text-xs font-medium text-text-secondary">{name}</Text>
                <div className="flex items-center gap-1">
                  <Text variant="secondary" className="font-mono text-[10px]">{value}</Text>
                  <CopyButton value={String(value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Line Heights */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Leading</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Line Heights</Text>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(LINE_HEIGHT).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border-subtle bg-surface-default p-4">
              <div className="h-20 overflow-hidden rounded-lg bg-surface-canvas px-3 py-2">
                <Text as="div" className="text-xs text-text-primary" style={{ lineHeight: value }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </Text>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Text className="text-xs font-medium text-text-secondary">{name}</Text>
                <div className="flex items-center gap-1">
                  <Text variant="secondary" className="font-mono text-[10px]">{value}</Text>
                  <CopyButton value={String(value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Letter Spacing */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Tracking</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Letter Spacing</Text>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(LETTER_SPACING).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border-subtle bg-surface-default p-4">
              <Text as="div" className="text-lg uppercase text-text-primary" style={{ letterSpacing: value }}>
                Tracking
              </Text>
              <div className="mt-2 flex items-center justify-between">
                <Text className="text-xs font-medium text-text-secondary">{name}</Text>
                <div className="flex items-center gap-1">
                  <Text variant="secondary" className="font-mono text-[10px]">{value}</Text>
                  <CopyButton value={value} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/*  Spacing                                                            */
/* ================================================================== */

function SpacingContent() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">4px grid</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Spacing Scale</Text>
        <div className="flex flex-col gap-2">
          {Object.entries(SPACING).map(([key, value]) => {
            const px = parseInt(value);
            return (
              <div key={key} className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-default px-4 py-2.5 transition hover:border-border-default">
                <div className="w-10 shrink-0">
                  <Text className="text-xs font-semibold tabular-nums text-text-secondary">{key}</Text>
                </div>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-md bg-action-primary/20 transition-all duration-300"
                    style={{ width: `${Math.min(px, 200)}px` }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Text variant="secondary" className="font-mono text-[10px] tabular-nums">{value}</Text>
                  <CopyButton value={value} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/*  Radius                                                             */
/* ================================================================== */

function RadiusContent() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Corners</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Border Radius Scale</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(RADIUS).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border-subtle bg-surface-default p-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center">
                <div
                  className="h-16 w-16 border-2 border-action-primary bg-action-primary/10 transition-all duration-300"
                  style={{ borderRadius: value }}
                />
              </div>
              <div className="mt-3">
                <Text className="text-sm font-semibold text-text-primary">{name}</Text>
                <div className="flex items-center justify-center gap-1">
                  <Text variant="secondary" className="font-mono text-[10px]">{value}</Text>
                  <CopyButton value={value} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/*  Motion                                                             */
/* ================================================================== */

function MotionContent() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-10">
      {/* Durations */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Timing</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Duration Scale</Text>
        <div className="flex flex-col gap-3">
          {Object.entries(DURATION).map(([name, value]) => {
            const ms = parseInt(value);
            return (
              <div key={name} className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-default px-4 py-3 transition hover:border-border-default">
                <div className="w-16 shrink-0">
                  <Text className="text-xs font-semibold text-text-secondary">{name}</Text>
                </div>
                <div className="relative flex-1 overflow-hidden rounded-lg bg-surface-canvas">
                  <div className="h-3 w-full" />
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg bg-state-warning-text/30"
                    style={{ width: `${Math.min((ms / 500) * 100, 100)}%`, transition: `width ${value}` }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Text variant="secondary" className="font-mono text-[10px] tabular-nums">{value}</Text>
                  <CopyButton value={value} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Easings */}
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Curves</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Easing Functions</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(EASING).map(([name, value]) => (
            <button
              key={name}
              type="button"
              onClick={() => setPlaying(playing === name ? null : name)}
              className="group rounded-xl border border-border-subtle bg-surface-default p-4 text-left transition hover:border-border-default hover:shadow-xs"
            >
              <div className="relative h-16 overflow-hidden rounded-lg bg-surface-canvas">
                <div
                  className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-state-warning-text shadow-md"
                  style={{
                    transform: playing === name ? "translateX(calc(100% + 60px)) translateY(-50%)" : "translateY(-50%)",
                    transition: `transform 600ms ${value}`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Text className="text-xs font-semibold text-text-primary">{name}</Text>
                <Text variant="secondary" className="text-[9px]">Click to play</Text>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Text variant="secondary" className="truncate font-mono text-[9px]">{value}</Text>
                <CopyButton value={value} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/*  Z-Index                                                            */
/* ================================================================== */

function ZIndexContent() {
  const entries = Object.entries(ZINDEX).sort(([, a], [, b]) => a - b);
  const maxZ = Math.max(...Object.values(ZINDEX));

  return (
    <div className="flex flex-col gap-10">
      <section>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Layering</Text>
        <Text as="div" className="mb-6 text-lg font-bold text-text-primary">Z-Index Stack</Text>

        {/* Visual stack */}
        <div className="flex flex-col relative mx-auto max-w-lg gap-2">
          {[...entries].reverse().map(([name, value], _i) => {
            const width = 40 + ((value / maxZ) * 55);
            return (
              <div key={name} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-right">
                  <Text className="text-xs font-medium text-text-secondary">{name}</Text>
                </div>
                <div
                  className="flex h-8 items-center justify-end rounded-lg border border-action-primary/20 bg-action-primary/10 px-3 transition-all duration-300 hover:bg-action-primary/20"
                  style={{ width: `${width}%` }}
                >
                  <div className="flex items-center gap-1">
                    <Text className="font-mono text-[10px] font-semibold tabular-nums text-action-primary">{value}</Text>
                    <CopyButton value={String(value)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-canvas">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Token</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Value</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {entries.map(([name, value]) => (
                <tr key={name} className="transition hover:bg-surface-muted/50">
                  <td className="px-4 py-2.5 font-mono text-xs font-medium text-text-primary">{name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs tabular-nums text-text-secondary">{value}</td>
                  <td className="px-4 py-2.5 text-xs text-text-secondary">{getZIndexUsage(name)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function getZIndexUsage(name: string): string {
  const map: Record<string, string> = {
    base: "Default stacking context",
    dropdown: "Dropdown menus, select panels",
    sticky: "Sticky headers, table headers",
    fixed: "Fixed navbars, FABs",
    backdrop: "Modal/drawer backdrop overlays",
    modal: "Dialog and modal containers",
    popover: "Popovers and floating panels",
    tooltip: "Tooltip overlays",
    toast: "Toast notifications",
    commandPalette: "Command palette (Cmd+K)",
  };
  return map[name] ?? "";
}
