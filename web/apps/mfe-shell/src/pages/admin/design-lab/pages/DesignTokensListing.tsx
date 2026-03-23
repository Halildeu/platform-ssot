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

const MINI_PALETTE = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#6b7280", "#1f2937"];
const MINI_SIZES = [12, 14, 16, 20, 24, 30];
const MINI_SPACINGS = [4, 8, 16, 24, 32, 48];
const MINI_RADII = ["0px", "4px", "8px", "16px", "9999px"];

const TOKEN_GROUPS = [
  {
    id: "colors",
    icon: <Palette className="h-5 w-5" />,
    gradient: "from-rose-500/10 to-pink-500/5",
    iconBg: "bg-rose-500/10 text-rose-600",
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
    gradient: "from-blue-500/10 to-cyan-500/5",
    iconBg: "bg-blue-500/10 text-blue-600",
    count: "28",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {MINI_SIZES.map((s) => (
          <span key={s} className="font-semibold leading-none text-blue-600/40" style={{ fontSize: `${s}px` }}>A</span>
        ))}
      </div>
    ),
  },
  {
    id: "spacing",
    icon: <Ruler className="h-5 w-5" />,
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    count: "23",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {MINI_SPACINGS.map((s) => (
          <div key={s} className="w-2 rounded-xs bg-emerald-500/25" style={{ height: `${Math.min(s, 32)}px` }} />
        ))}
      </div>
    ),
  },
  {
    id: "radius",
    icon: <Circle className="h-5 w-5" />,
    gradient: "from-violet-500/10 to-purple-500/5",
    iconBg: "bg-violet-500/10 text-violet-600",
    count: "8",
    preview: (
      <div className="mt-3 flex items-center gap-1.5">
        {MINI_RADII.map((r) => (
          <div key={r} className="h-5 w-5 border-2 border-violet-500/30 bg-violet-500/10" style={{ borderRadius: r }} />
        ))}
      </div>
    ),
  },
  {
    id: "motion",
    icon: <Zap className="h-5 w-5" />,
    gradient: "from-amber-500/10 to-orange-500/5",
    iconBg: "bg-amber-500/10 text-amber-600",
    count: "10",
    preview: (
      <div className="mt-3 flex items-center gap-1">
        {[100, 200, 300, 500].map((ms) => (
          <div key={ms} className="flex flex-col items-center gap-0.5">
            <div className="h-3 w-3 rounded-full bg-amber-500/30" />
            <span className="text-[8px] tabular-nums text-amber-600/50">{ms}ms</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "zindex",
    icon: <Layers className="h-5 w-5" />,
    gradient: "from-indigo-500/10 to-blue-500/5",
    iconBg: "bg-indigo-500/10 text-indigo-600",
    count: "10",
    preview: (
      <div className="mt-3 flex items-end gap-0.5">
        {[0, 1000, 1200, 1400, 1600, 1800].map((z, i) => (
          <div key={z} className="w-4 rounded-xs bg-indigo-500/20" style={{ height: `${8 + i * 4}px` }} />
        ))}
      </div>
    ),
  },
  {
    id: "shadows",
    icon: <Sun className="h-5 w-5" />,
    gradient: "from-[var(--text-subtle)]/10 to-[var(--text-subtle)]/5",
    iconBg: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    count: "12",
    preview: (
      <div className="mt-3 flex items-center gap-2">
        {["none", "0 1px 2px rgba(0,0,0,.05)", "0 4px 6px rgba(0,0,0,.1)", "0 10px 15px rgba(0,0,0,.1)", "0 20px 25px rgba(0,0,0,.15)"].map((s, i) => (
          <div key={i} className="h-5 w-5 rounded-md bg-[var(--surface-default,#fff)]" style={{ boxShadow: s }} />
        ))}
      </div>
    ),
  },
  {
    id: "breakpoints",
    icon: <Monitor className="h-5 w-5" />,
    gradient: "from-cyan-500/10 to-sky-500/5",
    iconBg: "bg-cyan-500/10 text-cyan-600",
    count: "8",
    preview: (
      <div className="mt-3 flex items-end gap-1">
        {[8, 12, 16, 22, 28, 32].map((w, i) => (
          <div key={i} className="rounded-xs bg-cyan-500/25" style={{ width: `${w}px`, height: "18px" }} />
        ))}
      </div>
    ),
  },
  {
    id: "opacity",
    icon: <Eye className="h-5 w-5" />,
    gradient: "from-fuchsia-500/10 to-pink-500/5",
    iconBg: "bg-fuchsia-500/10 text-fuchsia-600",
    count: "8",
    preview: (
      <div className="mt-3 flex items-center gap-1">
        {[0, 0.1, 0.2, 0.38, 0.5, 0.7, 1].map((o) => (
          <div key={o} className="h-5 w-5 rounded-md bg-fuchsia-500" style={{ opacity: o }} />
        ))}
      </div>
    ),
  },
  {
    id: "border",
    icon: <Square className="h-5 w-5" />,
    gradient: "from-teal-500/10 to-green-500/5",
    iconBg: "bg-teal-500/10 text-teal-600",
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
