#!/usr/bin/env python3
"""
Automated fixer for hardcoded theme style violations.
Replaces Tailwind palette classes, hex colors, and var() fallbacks
with semantic design tokens.

Usage:
  python3 scripts/fix_hardcoded_theme_styles.py          # dry-run
  python3 scripts/fix_hardcoded_theme_styles.py --apply   # apply changes
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

DRY_RUN = "--apply" not in sys.argv

# ── Tailwind palette → semantic token mapping ──
TAILWIND_MAP: dict[str, str] = {
    # White / Black
    "text-white": "text-text-inverse",
    "bg-white": "bg-surface-default",
    "border-white": "border-surface-default",
    "bg-black": "bg-surface-inverse",
    "text-black": "text-text-primary",
    # Gray
    "text-gray-200": "text-border-subtle",
    "text-gray-300": "text-border-default",
    "text-gray-400": "text-text-disabled",
    "text-gray-500": "text-text-subtle",
    "text-gray-600": "text-text-secondary",
    "text-gray-700": "text-text-primary",
    "text-gray-800": "text-text-primary",
    "text-gray-900": "text-text-primary",
    "bg-gray-50": "bg-surface-muted",
    "bg-gray-100": "bg-surface-muted",
    "bg-gray-200": "bg-surface-raised",
    "bg-gray-300": "bg-border-default",
    "bg-gray-400": "bg-border-strong",
    "bg-gray-500": "bg-text-subtle",
    "bg-gray-700": "bg-surface-inverse",
    "bg-gray-800": "bg-surface-inverse",
    "bg-gray-900": "bg-surface-inverse",
    "border-gray-100": "border-border-subtle",
    "border-gray-200": "border-border-subtle",
    "border-gray-300": "border-border-default",
    "border-gray-400": "border-border-strong",
    # Zinc (similar to gray)
    "text-zinc-400": "text-text-disabled",
    "text-zinc-500": "text-text-subtle",
    "text-zinc-600": "text-text-secondary",
    "bg-zinc-400": "bg-border-strong",
    "bg-zinc-100": "bg-surface-muted",
    "bg-zinc-800": "bg-surface-inverse",
    "bg-zinc-900": "bg-surface-inverse",
    "border-zinc-200": "border-border-subtle",
    "border-zinc-300": "border-border-default",
    # Slate
    "text-slate-400": "text-text-disabled",
    "text-slate-500": "text-text-subtle",
    "text-slate-600": "text-text-secondary",
    "text-slate-700": "text-text-primary",
    "bg-slate-50": "bg-surface-muted",
    "bg-slate-100": "bg-surface-muted",
    "bg-slate-200": "bg-surface-raised",
    "bg-slate-800": "bg-surface-inverse",
    "bg-slate-900": "bg-surface-inverse",
    "border-slate-200": "border-border-subtle",
    "border-slate-300": "border-border-default",
    # Blue → action-primary / state-info
    "text-blue-500": "text-action-primary",
    "text-blue-600": "text-action-primary",
    "text-blue-700": "text-state-info-text",
    "bg-blue-50": "bg-state-info-bg",
    "bg-blue-100": "bg-state-info-bg",
    "bg-blue-500": "bg-action-primary",
    "bg-blue-600": "bg-action-primary",
    "bg-blue-700": "bg-action-primary",
    "border-blue-200": "border-state-info-text/20",
    "border-blue-300": "border-state-info-text/30",
    "border-blue-500": "border-action-primary",
    "ring-blue-500": "ring-action-primary",
    # Green / Emerald → state-success
    "text-green-500": "text-state-success-text",
    "text-green-600": "text-state-success-text",
    "text-green-700": "text-state-success-text",
    "text-emerald-400": "text-state-success-text",
    "text-emerald-500": "text-state-success-text",
    "text-emerald-600": "text-state-success-text",
    "text-emerald-700": "text-state-success-text",
    "bg-green-50": "bg-state-success-bg",
    "bg-green-100": "bg-state-success-bg",
    "bg-green-500": "bg-state-success-text",
    "bg-green-600": "bg-state-success-text",
    "bg-emerald-50": "bg-state-success-bg",
    "bg-emerald-100": "bg-state-success-bg",
    "bg-emerald-400": "bg-state-success-text",
    "bg-emerald-500": "bg-state-success-text",
    "bg-emerald-600": "bg-state-success-text",
    "bg-emerald-900": "bg-state-success-text",
    "border-green-200": "border-state-success-text/20",
    "border-green-300": "border-state-success-text/30",
    "border-emerald-200": "border-state-success-text/20",
    "border-emerald-300": "border-state-success-text/30",
    # Red → state-danger
    "text-red-400": "text-state-danger-text",
    "text-red-500": "text-state-danger-text",
    "text-red-600": "text-state-danger-text",
    "text-red-700": "text-state-danger-text",
    "bg-red-50": "bg-state-danger-bg",
    "bg-red-100": "bg-state-danger-bg",
    "bg-red-500": "bg-state-danger-text",
    "bg-red-600": "bg-state-danger-text",
    "border-red-200": "border-state-danger-text/20",
    "border-red-300": "border-state-danger-text/30",
    # Rose → state-danger
    "text-rose-500": "text-state-danger-text",
    "text-rose-600": "text-state-danger-text",
    "text-rose-700": "text-state-danger-text",
    "bg-rose-50": "bg-state-danger-bg",
    "bg-rose-100": "bg-state-danger-bg",
    "bg-rose-500": "bg-state-danger-text",
    "border-rose-200": "border-state-danger-text/20",
    # Amber / Yellow / Orange → state-warning
    "text-amber-500": "text-state-warning-text",
    "text-amber-600": "text-state-warning-text",
    "text-amber-700": "text-state-warning-text",
    "text-orange-500": "text-state-warning-text",
    "text-orange-600": "text-state-warning-text",
    "text-yellow-500": "text-state-warning-text",
    "text-yellow-600": "text-state-warning-text",
    "bg-amber-50": "bg-state-warning-bg",
    "bg-amber-100": "bg-state-warning-bg",
    "bg-amber-400": "bg-state-warning-text",
    "bg-amber-500": "bg-state-warning-text",
    "bg-orange-50": "bg-state-warning-bg",
    "bg-orange-100": "bg-state-warning-bg",
    "bg-yellow-50": "bg-state-warning-bg",
    "bg-yellow-100": "bg-state-warning-bg",
    "border-amber-200": "border-state-warning-text/20",
    "border-amber-300": "border-state-warning-text/30",
    # Violet / Indigo / Purple → action-primary (no dedicated token)
    "text-violet-500": "text-action-primary",
    "text-violet-600": "text-action-primary",
    "text-violet-700": "text-action-primary",
    "text-indigo-500": "text-action-primary",
    "text-indigo-600": "text-action-primary",
    "text-indigo-700": "text-action-primary",
    "text-purple-500": "text-action-primary",
    "text-purple-600": "text-action-primary",
    "text-purple-700": "text-action-primary",
    "bg-violet-50": "bg-action-primary/10",
    "bg-violet-100": "bg-action-primary/10",
    "bg-violet-500": "bg-action-primary",
    "bg-violet-600": "bg-action-primary",
    "bg-indigo-50": "bg-action-primary/10",
    "bg-indigo-100": "bg-action-primary/10",
    "bg-indigo-500": "bg-action-primary",
    "bg-purple-50": "bg-action-primary/10",
    "bg-purple-100": "bg-action-primary/10",
    "bg-purple-500": "bg-action-primary",
    "border-violet-200": "border-action-primary/20",
    "border-indigo-200": "border-action-primary/20",
    "border-purple-200": "border-action-primary/20",
    # Cyan / Sky / Teal → state-info
    "text-cyan-600": "text-state-info-text",
    "text-cyan-700": "text-state-info-text",
    "text-sky-600": "text-state-info-text",
    "text-teal-600": "text-state-success-text",
    "bg-cyan-50": "bg-state-info-bg",
    "bg-cyan-100": "bg-state-info-bg",
    "bg-cyan-500": "bg-state-info-text",
    "bg-sky-50": "bg-state-info-bg",
    "bg-teal-50": "bg-state-success-bg",
    "bg-teal-500": "bg-state-success-text",
    # Missing shades
    "text-amber-400": "text-state-warning-text",
    "text-amber-800": "text-state-warning-text",
    "text-orange-700": "text-state-warning-text",
    "text-blue-300": "text-action-primary/60",
    "text-blue-400": "text-action-primary",
    "text-violet-300": "text-action-primary/60",
    "text-green-400": "text-state-success-text",
    "text-gray": "text-text-secondary",
    "bg-orange-500": "bg-state-warning-text",
    "bg-amber-900": "bg-state-warning-text",
    "bg-red-400": "bg-state-danger-text",
    "bg-red-900": "bg-state-danger-text",
    "bg-blue-200": "bg-state-info-bg",
    "bg-blue-400": "bg-action-primary",
    "bg-blue-900": "bg-action-primary",
    "bg-violet-400": "bg-action-primary",
    "bg-violet-900": "bg-action-primary",
    "bg-emerald-200": "bg-state-success-bg",
    "bg-gray": "bg-surface-muted",
    "bg-zinc-300": "bg-border-default",
    "bg-zinc-600": "bg-text-secondary",
    "border-emerald-500": "border-state-success-text",
    "ring-white": "ring-surface-default",
    # Gradient utilities
    "from-violet-500": "from-action-primary",
    "from-emerald-500": "from-state-success-text",
    "from-blue-500": "from-action-primary",
    "from-indigo-500": "from-action-primary",
    "from-orange-500": "from-state-warning-text",
    "from-amber-500": "from-state-warning-text",
    "from-teal-500": "from-state-success-text",
    "to-cyan-500": "to-state-info-text",
    "to-blue-500": "to-action-primary",
    "to-red-500": "to-state-danger-text",
    "to-violet-500": "to-action-primary",
    "to-pink-500": "to-state-danger-text",
    "to-teal-500": "to-state-success-text",
    # Remaining shades round 3
    "text-slate": "text-text-secondary",
    "bg-emerald-700": "bg-state-success-text",
    "bg-rose-600": "bg-state-danger-text",
    "bg-rose-700": "bg-state-danger-text",
    "bg-teal-100": "bg-state-success-bg",
    "text-teal-700": "text-state-success-text",
    "bg-pink-100": "bg-state-danger-bg",
    "bg-pink-500": "bg-state-danger-text",
    "text-pink-500": "text-state-danger-text",
    "text-pink-700": "text-state-danger-text",
    "border-blue-400": "border-action-primary",
    "border-blue-800": "border-action-primary",
    "bg-amber-200": "bg-state-warning-bg",
    "text-emerald-800": "text-state-success-text",
    "text-emerald-300": "text-state-success-text",
    "border-violet-300": "border-action-primary/30",
    "border-violet-500": "border-action-primary",
    "border-emerald-800": "border-state-success-text",
    "border-amber-800": "border-state-warning-text",
    "bg-zinc-500": "bg-text-subtle",
    "bg-sky-500": "bg-state-info-text",
    "border-orange-200": "border-state-warning-text/20",
    "text-blue-800": "text-action-primary",
    "from-rose-500": "from-state-danger-text",
    "to-purple-500": "to-action-primary",
    "to-orange-500": "to-state-warning-text",
    "from-cyan-500": "from-state-info-text",
    "bg-fuchsia-500": "bg-action-primary",
    "to-fuchsia-500": "to-action-primary",
    "bg-orange-400": "bg-state-warning-text",
    "ring-amber-300": "ring-state-warning-text/30",
    "border-red-500": "border-state-danger-text",
    "bg-blue": "bg-action-primary",
    "bg-red": "bg-state-danger-text",
    "bg-green": "bg-state-success-text",
    "bg-yellow": "bg-state-warning-text",
    "border-gray": "border-border-default",
    "ring-emerald-400": "ring-state-success-text",
    "ring-rose-400": "ring-state-danger-text",
    "ring-gray-400": "ring-border-strong",
    "bg-cyan-900": "bg-state-info-text",
    "text-cyan-300": "text-state-info-text",
    # Round 4 — all remaining 1-off classes
    "border-purple-400": "border-action-primary/40",
    "border-emerald-400": "border-state-success-text/40",
    "border-indigo-300": "border-action-primary/30",
    "border-indigo-500": "border-action-primary",
    "via-blue-500": "via-action-primary",
    "ring-emerald-200": "ring-state-success-text/20",
    "ring-emerald-800": "ring-state-success-text",
    "ring-amber-200": "ring-state-warning-text/20",
    "ring-amber-800": "ring-state-warning-text",
    "ring-red-200": "ring-state-danger-text/20",
    "ring-red-800": "ring-state-danger-text",
    "ring-blue-200": "ring-action-primary/20",
    "ring-blue-800": "ring-action-primary",
    "bg-emerald-950": "bg-state-success-text",
    "bg-emerald-800": "bg-state-success-text",
    "bg-amber-950": "bg-state-warning-text",
    "bg-amber-800": "bg-state-warning-text",
    "bg-rose-400": "bg-state-danger-text",
    "bg-sky-900": "bg-state-info-text",
    "bg-cyan-400": "bg-state-info-text",
    "bg-indigo-900": "bg-action-primary",
    "bg-zinc-50": "bg-surface-muted",
    "bg-zinc-200": "bg-surface-raised",
    "bg-zinc-700": "bg-surface-inverse",
    "border-red-800": "border-state-danger-text",
    "border-blue-700": "border-action-primary",
    "border-violet-800": "border-action-primary",
    "border-sky-200": "border-state-info-text/20",
    "border-sky-800": "border-state-info-text",
    "border-zinc-800": "border-surface-inverse",
    "border-zinc-500": "border-text-subtle",
    "border-cyan-200": "border-state-info-text/20",
    "border-fuchsia-200": "border-action-primary/20",
    "border-amber-500": "border-state-warning-text",
    "border-rose-500": "border-state-danger-text",
    "text-violet-400": "text-action-primary",
    "text-amber-300": "text-state-warning-text",
    "text-sky-300": "text-state-info-text",
    "text-zinc-300": "text-text-disabled",
    "text-yellow-700": "text-state-warning-text",
    "text-indigo-400": "text-action-primary",
    "text-red-800": "text-state-danger-text",
    "text-red-300": "text-state-danger-text",
    "text-fuchsia-600": "text-action-primary",
    "text-pink-600": "text-state-danger-text",
    "text-orange-400": "text-state-warning-text",
    "to-sky-500": "to-state-info-text",
    "to-green-500": "to-state-success-text",
    "to-indigo-500": "to-action-primary",
    "from-fuchsia-500": "from-action-primary",
}

# Build regex: match longest first to avoid partial matches
_tw_sorted = sorted(TAILWIND_MAP.keys(), key=len, reverse=True)
_tw_pattern = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in _tw_sorted) + r")\b"
)

# ── HEX color → CSS var mapping ──
HEX_MAP: dict[str, str] = {
    "#3b82f6": "var(--action-primary)",
    "#2563eb": "var(--action-primary)",
    "#1d4ed8": "var(--action-primary)",
    "#60a5fa": "var(--action-primary)",
    "#fff": "var(--surface-default)",
    "#ffffff": "var(--surface-default)",
    "#f8fafc": "var(--surface-default)",
    "#e2e8f0": "var(--border-subtle)",
    "#e5e7eb": "var(--border-subtle)",
    "#d1d5db": "var(--border-default)",
    "#cbd5e1": "var(--border-default)",
    "#16a34a": "var(--state-success-text)",
    "#22c55e": "var(--state-success-text)",
    "#15803d": "var(--state-success-text)",
    "#dcfce7": "var(--state-success-bg)",
    "#ef4444": "var(--state-danger-text)",
    "#dc2626": "var(--state-danger-text)",
    "#b91c1c": "var(--state-danger-text)",
    "#ff0000": "var(--state-danger-text)",
    "#f59e0b": "var(--state-warning-text)",
    "#d97706": "var(--state-warning-text)",
    "#b45309": "var(--state-warning-text)",
    "#64748b": "var(--text-secondary)",
    "#94a3b8": "var(--text-subtle)",
    "#9ca3af": "var(--text-subtle)",
    "#6b7280": "var(--text-secondary)",
    "#4b5563": "var(--text-secondary)",
    "#374151": "var(--text-primary)",
    "#1f2937": "var(--text-primary)",
    "#0f172a": "var(--text-primary)",
    "#1e293b": "var(--text-primary)",
    "#111827": "var(--text-primary)",
    "#000": "var(--text-primary)",
    "#f1f5f9": "var(--surface-muted)",
    "#f3f4f6": "var(--surface-muted)",
    "#f9fafb": "var(--surface-muted)",
    "#8b5cf6": "var(--action-primary)",
    "#7c3aed": "var(--action-primary)",
    "#6366f1": "var(--action-primary)",
    "#00ff00": "var(--state-success-text)",
    "#10b981": "var(--state-success-text)",
    "#eff6ff": "var(--state-info-bg)",
    "#dbeafe": "var(--state-info-bg)",
    "#bfdbfe": "var(--state-info-bg)",
    "#93c5fd": "var(--action-primary)",
    "#ec4899": "var(--state-danger-text)",
    "#06b6d4": "var(--state-info-text)",
    "#f97316": "var(--state-warning-text)",
    "#84cc16": "var(--state-success-text)",
    "#a855f7": "var(--action-primary)",
    "#ccc": "var(--border-default)",
    "#cccccc": "var(--border-default)",
    "#333": "var(--text-primary)",
    "#000000": "var(--text-primary)",
    "#111111": "var(--text-primary)",
    "#111": "var(--text-primary)",
    "#222": "var(--text-primary)",
    "#0891b2": "var(--state-info-text)",
    "#1e40af": "var(--action-primary)",
    "#f44336": "var(--state-danger-text)",
    "#eab308": "var(--state-warning-text)",
    "#f0fdf4": "var(--state-success-bg)",
    "#fef2f2": "var(--state-danger-bg)",
    "#fef3c7": "var(--state-warning-bg)",
    "#fffbeb": "var(--state-warning-bg)",
    "#f8f9fa": "var(--surface-muted)",
    "#dcfce7": "var(--state-success-bg)",
    "#0000ff": "var(--action-primary)",
    "#4f46e5": "var(--action-primary)",
    "#7e22ce": "var(--action-primary)",
    "#c084fc": "var(--action-primary)",
    "#f3e8ff": "var(--action-primary-bg, var(--state-info-bg))",
    "#3366cc": "var(--action-primary)",
    "#dc3912": "var(--state-danger-text)",
    "#4caf50": "var(--state-success-text)",
    "#ff9800": "var(--state-warning-text)",
    "#9c27b0": "var(--action-primary)",
    "#f87171": "var(--state-danger-text)",
    "#4ade80": "var(--state-success-text)",
    "#fbbf24": "var(--state-warning-text)",
    "#bbf7d0": "var(--state-success-bg)",
    "#fecaca": "var(--state-danger-bg)",
    "#f0f9ff": "var(--state-info-bg)",
    "#333333": "var(--text-primary)",
    "#666666": "var(--text-secondary)",
    "#eee": "var(--border-subtle)",
    "#ddd": "var(--border-default)",
    "#f5f5f5": "var(--surface-muted)",
    "#334155": "var(--text-primary)",
    "#475569": "var(--text-secondary)",
    "#71717a": "var(--text-secondary)",
    "#1e3a8a": "var(--action-primary)",
    "#172554": "var(--action-primary)",
    "#1e1e2e": "var(--surface-inverse)",
    "#1a1a2e": "var(--surface-inverse)",
    "#1e3a5f": "var(--surface-inverse)",
    "#052e16": "var(--state-success-text)",
    "#451a03": "var(--state-warning-text)",
    "#450a0a": "var(--state-danger-text)",
    "#cd7f32": "var(--state-warning-text)",
    "#b8860b": "var(--state-warning-text)",
    "#ffff00": "var(--state-warning-text)",
    "#00ffff": "var(--state-info-text)",
    "#ff00ff": "var(--action-primary)",
    "#ef444440": "var(--state-danger-bg)",
    "#eab30840": "var(--state-warning-bg)",
    "#22c55e40": "var(--state-success-bg)",
    "#f00": "var(--state-danger-text)",
    "#abc": "var(--border-default)",
}

_hex_sorted = sorted(HEX_MAP.keys(), key=len, reverse=True)
_hex_pattern = re.compile(
    r"(" + "|".join(re.escape(k) for k in _hex_sorted) + r")\b",
    re.IGNORECASE,
)

# ── VAR fallback remover ──
# var(--token, #fallback) → var(--token)
VAR_FALLBACK_RE = re.compile(r"var\((--[a-z0-9-]+)\s*,\s*[^)]+\)", re.IGNORECASE)


def fix_line(line: str) -> str:
    # 1. Tailwind palette replacements
    line = _tw_pattern.sub(lambda m: TAILWIND_MAP.get(m.group(0), m.group(0)), line)
    # 2. HEX color replacements (in style objects, CSS, etc.)
    line = _hex_pattern.sub(lambda m: HEX_MAP.get(m.group(0).lower(), m.group(0)), line)
    # 3. Remove var() fallbacks: var(--token, #abc) → var(--token)
    line = VAR_FALLBACK_RE.sub(r"var(\1)", line)
    return line


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    web_root = root  # standalone web repo

    from check_no_hardcoded_theme_styles import (
        ALLOWED_EXT, SKIP_DIRS, SCOPE_PREFIXES, SKIP_PATH_PREFIXES,
        should_scan
    )
    import os

    # Detect ROOT for path resolution
    if (root / "apps").exists():
        path_root = root.parent  # standalone web repo
    else:
        path_root = root  # platform-ssot layout

    changed_files = 0
    changed_lines = 0

    for dirpath, dirnames, filenames in os.walk(web_root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix not in ALLOWED_EXT:
                continue
            rel = p.relative_to(path_root).as_posix()
            if not should_scan(rel):
                continue

            try:
                text = p.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue

            lines = text.splitlines(keepends=True)
            new_lines = []
            file_changed = False
            for line in lines:
                new_line = fix_line(line)
                if new_line != line:
                    file_changed = True
                    changed_lines += 1
                new_lines.append(new_line)

            if file_changed:
                changed_files += 1
                if DRY_RUN:
                    print(f"[DRY-RUN] would fix: {rel}")
                else:
                    p.write_text("".join(new_lines), encoding="utf-8")
                    print(f"[FIXED] {rel}")

    mode = "DRY-RUN" if DRY_RUN else "APPLIED"
    print(f"\n[{mode}] {changed_files} dosya, {changed_lines} satır değiştirildi")
    if DRY_RUN:
        print("Uygulamak için: python3 scripts/fix_hardcoded_theme_styles.py --apply")


if __name__ == "__main__":
    main()
