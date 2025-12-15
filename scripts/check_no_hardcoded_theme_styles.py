#!/usr/bin/env python3
"""
No-hardcoded-theme-styles guardrail.

Amaç:
- Ürün kodunda theme zincirini bypass eden hardcoded stilleri yakalamak:
  * Tailwind palette sınıfları (text-red-500 vb.)
  * Inline hex renkler (#fff, #ffffff vb.)
  * CSS `var(--x, fallback)` (tema zinciri bypass sayılır)
  * rgba()/rgb()/hsl()/hsla() kullanım (tema editor bileşenleri hariç)

Not:
- Theme editor (color picker) bileşenlerinde hex/rgb kaçınılmaz; bu dosyalar allowlist'tedir.

Kullanım:
  python3 scripts/check_no_hardcoded_theme_styles.py
"""

from __future__ import annotations

from pathlib import Path
import os
import re
from typing import Iterable, List, Set, Tuple


ROOT = Path(__file__).resolve().parents[1]

ALLOWED_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".scss"}
SKIP_DIRS = {"node_modules", "dist", "build", "coverage", "test-results", ".git", ".next"}

# Guardrail scope: product code. Storybook/docs/assets intentionally excluded.
SCOPE_PREFIXES = ("web/apps/", "web/packages/")
SKIP_PATH_PREFIXES = (
    "web/apps/mfe-shell/src/app/theme/components/",
    "web/apps/mfe-shell/src/app/theme/color-utils.ts",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx",
    "web/apps/mfe-shell/src/styles/theme.css",
)

ALLOWED_FALLBACK_VAR_PREFIXES: tuple[str, ...] = ()


HEX_COLOR_RE = re.compile(r"#[0-9a-f]{3,8}\b", re.IGNORECASE)
COLOR_FN_RE = re.compile(r"\b(?:rgba?|hsla?)\(", re.IGNORECASE)
VAR_FALLBACK_IN_VAR_FN_RE = re.compile(r"var\((--[a-z0-9-]+)\s*,", re.IGNORECASE)

TAILWIND_PALETTE_RE = re.compile(
    r"\b(?:text|bg|border|ring|from|to|via)-"
    r"(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)"
    r"(?:-\d{2,3})?\b",
    re.IGNORECASE,
)


def should_scan(rel_path: str) -> bool:
    if not rel_path.startswith(SCOPE_PREFIXES):
        return False
    return not rel_path.startswith(SKIP_PATH_PREFIXES)


def iter_source_files() -> Iterable[Path]:
    web_root = ROOT / "web"
    if not web_root.exists():
        return []

    for dirpath, dirnames, filenames in os.walk(web_root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix not in ALLOWED_EXT:
                continue
            rel = p.relative_to(ROOT).as_posix()
            if not should_scan(rel):
                continue
            yield p


def main() -> int:
    hits: List[str] = []

    for path in iter_source_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        rel = path.relative_to(ROOT).as_posix()
        is_style_file = path.suffix in {".css", ".scss"}

        for idx, line in enumerate(text.splitlines(), start=1):
            if TAILWIND_PALETTE_RE.search(line):
                hits.append(f"TAILWIND_PALETTE: {rel}:{idx}")
            if HEX_COLOR_RE.search(line):
                hits.append(f"HEX_COLOR: {rel}:{idx}")
            if is_style_file and COLOR_FN_RE.search(line):
                hits.append(f"COLOR_FN: {rel}:{idx}")
            m = VAR_FALLBACK_IN_VAR_FN_RE.search(line)
            if m:
                var_name = m.group(1)
                if not var_name.startswith(ALLOWED_FALLBACK_VAR_PREFIXES):
                    hits.append(f"VAR_FALLBACK: {rel}:{idx} ({var_name})")
            if len(hits) >= 80:
                break
        if len(hits) >= 80:
            break

    if hits:
        print("[check_no_hardcoded_theme_styles] FAIL: hardcoded theme bypass bulundu (ilk 30):")
        for h in hits[:30]:
            print(f"- {h}")
        if len(hits) > 30:
            print(f"- ... (+{len(hits) - 30})")
        return 1

    print("[check_no_hardcoded_theme_styles] OK ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
