import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Palette,
  Type,
  Ruler,
  Circle,
  Zap,
  Layers,
  Sun,
  Monitor,
  Eye,
  Square,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  DesignTokensListing — Token group grid with mini previews          */
/* ------------------------------------------------------------------ */

const MINI_PALETTE = ["var(--action-primary)", "var(--state-success-text)", "var(--state-warning-text)", "var(--state-danger-text)", "var(--text-secondary)", "var(--text-primary)"];
const MINI_SIZES = [12, 14, 16, 20, 24, 30];
const MINI_SPACINGS = [4, 8, 16, 24, 32, 48];
const MINI_RADII = ["0px", "4px", "8px", "16px", "9999px"];

const TOKEN_GROUPS = [
  {
    id: "colors",
    icon: <Palette className="h-5 w-5" />,
    gradient: "from-state-danger-text/10 to-state-danger-text/5",
    iconBg: "bg-state-danger-text/10 text-state-danger-text",
    count: "56",
    preview: (
      <div className="mt-3 flex gap-1">
        {MINI_PALETTE.map((c) => (
          <div key={c} className="h-5 w-5 rounded-md shadow-xs" style={{ backgroundColor: c }} />
        ))}
      </div>
    ),
  },
  {
    id: "typography",
    icon: <Type className="h-5 w-5" />,
    gradient: "from-action-primary/10 to-state-info-text/5",
    iconBg: "bg-action-primary/10 text-action-primary",
    count: "28",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {MINI_SIZES.map((s) => (
          <span key={s} className="font-semibold leading-none text-action-primary/40" style={{ fontSize: `${s}px` }}>A</span>
        ))}
      </div>
    ),
  },
  {
    id: "spacing",
    icon: <Ruler className="h-5 w-5" />,
    gradient: "from-state-success-text/10 to-state-success-text/5",
    iconBg: "bg-state-success-text/10 text-state-success-text",
    count: "23",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {MINI_SPACINGS.map((s) => (
          <div key={s} className="w-2 rounded-xs bg-state-success-text/25" style={{ height: `${Math.min(s, 32)}px` }} />
        ))}
      </div>
    ),
  },
  {
    id: "radius",
    icon: <Circle className="h-5 w-5" />,
    gradient: "from-action-primary/10 to-action-primary/5",
    iconBg: "bg-action-primary/10 text-action-primary",
    count: "8",
    preview: (
      <div className="mt-3 flex items-center gap-1.5">
        {MINI_RADII.map((r) => (
          <div key={r} className="h-5 w-5 border-2 border-action-primary/30 bg-action-primary/10" style={{ borderRadius: r }} />
        ))}
      </div>
    ),
  },
  {
    id: "motion",
    icon: <Zap className="h-5 w-5" />,
    gradient: "from-state-warning-text/10 to-state-warning-text/5",
    iconBg: "bg-state-warning-text/10 text-state-warning-text",
    count: "10",
    preview: (
      <div className="mt-3 flex items-center gap-1">
        {[100, 200, 300, 500].map((ms) => (
          <div key={ms} className="flex flex-col items-center gap-0.5">
            <div className="h-3 w-3 rounded-full bg-state-warning-text/30" />
            <span className="text-[8px] tabular-nums text-state-warning-text/50">{ms}ms</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "zindex",
    icon: <Layers className="h-5 w-5" />,
    gradient: "from-action-primary/10 to-action-primary/5",
    iconBg: "bg-action-primary/10 text-action-primary",
    count: "10",
    preview: (
      <div className="mt-3 flex items-end gap-0.5">
        {[0, 1000, 1200, 1400, 1600, 1800].map((z, i) => (
          <div key={z} className="w-4 rounded-xs bg-action-primary/20" style={{ height: `${8 + i * 4}px` }} />
        ))}
      </div>
    ),
  },
  {
    id: "shadows",
    icon: <Sun className="h-5 w-5" />,
    gradient: "from-[color-mix(in_oklab,var(--text-subtle)_10%,transparent)] to-[color-mix(in_oklab,var(--text-subtle)_5%,transparent)]",
    iconBg: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    count: "12",
    preview: (
      <div className="mt-3 flex items-center gap-2">
        {["none", "0 1px 2px rgba(0,0,0,.05)", "0 4px 6px rgba(0,0,0,.1)", "0 10px 15px rgba(0,0,0,.1)", "0 20px 25px rgba(0,0,0,.15)"].map((s, i) => (
          <div key={i} className="h-5 w-5 rounded-md bg-[var(--surface-default))]" style={{ boxShadow: s }} />
        ))}
      </div>
    ),
  },
  {
    id: "breakpoints",
    icon: <Monitor className="h-5 w-5" />,
    gradient: "from-state-info-text/10 to-state-info-text/5",
    iconBg: "bg-state-info-text/10 text-state-info-text",
    count: "8",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {[8, 12, 16, 22, 28, 32].map((w, i) => (
          <div key={i} className="rounded-xs bg-state-info-text/25" style={{ width: `${w}px`, height: "18px" }} />
        ))}
      </div>
    ),
  },
  {
    id: "opacity",
    icon: <Eye className="h-5 w-5" />,
    gradient: "from-action-primary/10 to-state-danger-text/5",
    iconBg: "bg-action-primary/10 text-action-primary",
    count: "8",
    preview: (
      <div className="mt-3 flex items-center gap-1">
        {[0, 0.1, 0.2, 0.38, 0.5, 0.7, 1].map((o) => (
          <div key={o} className="h-5 w-5 rounded-md bg-action-primary" style={{ opacity: o }} />
        ))}
      </div>
    ),
  },
  {
    id: "border",
    icon: <Square className="h-5 w-5" />,
    gradient: "from-state-success-text/10 to-state-success-text/5",
    iconBg: "bg-state-success-text/10 text-state-success-text",
    count: "10",
    preview: (
      <div className="mt-3 flex items-center gap-1.5">
        {[1, 2, 4].map((w) => (
          <div key={w} className="h-5 w-5 rounded-xs bg-transparent" style={{ border: `${w}px solid rgba(20,184,166,0.4)` }} />
        ))}
        <div className="h-5 w-5 rounded-xs bg-transparent" style={{ border: "2px dashed rgba(20,184,166,0.4)" }} />
        <div className="h-5 w-5 rounded-xs bg-transparent" style={{ outline: "2px solid rgba(20,184,166,0.4)", outlineOffset: "2px" }} />
      </div>
    ),
  },
] as const;

export default function DesignTokensListing() {
  const navigate = useNavigate();
  const { t } = useDesignLab();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-xs">
            <Palette className="h-3 w-3" />
            10 token groups
          </div>
          <Text
            as="div"
            className="text-2xl font-extrabold tracking-tight text-text-primary"
          >
            {t("designlab.sidebar.title.design")}
          </Text>
          <Text
            variant="secondary"
            className="mt-2 max-w-xl text-sm leading-relaxed"
          >
            {t("designlab.landing.layer.design.description")}
          </Text>
        </div>
      </div>

      {/* Token group cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOKEN_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => navigate(`/admin/design-lab/design/${group.id}`)}
            className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${group.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="relative">
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${group.iconBg} transition-[scale] duration-300 group-hover:scale-110`}
              >
                {group.icon}
              </div>
              <Text
                as="div"
                className="text-base font-semibold text-text-primary"
              >
                {t(`designlab.tokenGroup.${group.id}.title`)}
              </Text>
              <Text
                variant="secondary"
                className="mt-1 line-clamp-2 text-xs leading-5"
              >
                {t(`designlab.tokenGroup.${group.id}.description`)}
              </Text>
              {/* Mini preview */}
              {group.preview}
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
                  {group.count} tokens
                </span>
                <ArrowRight className="h-4 w-4 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
