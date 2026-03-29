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
- Token tanım dosyaları (color.ts) hex değer içermek zorundadır.

Kullanım:
  python3 scripts/check_no_hardcoded_theme_styles.py
"""

from __future__ import annotations

from pathlib import Path
import os
import re
from typing import Iterable, List, Set, Tuple


_SCRIPT_DIR = Path(__file__).resolve().parent
_REPO_ROOT = _SCRIPT_DIR.parent
# Support both platform-ssot/web/ layout and standalone web repo
ROOT = _REPO_ROOT.parent if (_REPO_ROOT / "apps").exists() else _REPO_ROOT

ALLOWED_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".scss"}
SKIP_DIRS = {
    "node_modules",
    "node_modules_old",
    "node_modules_failed_pnpm",
    "node_modules_failed_pnpm_hoisted",
    "dist",
    "dist-quality",
    "build",
    "coverage",
    "test-results",
    "storybook-static",
    ".git",
    ".next",
}

# Guardrail scope: product code.
SCOPE_PREFIXES = ("web/apps/", "web/packages/")

# Allowlist: yalnızca hex/rgb kullanması zorunlu olan dosyalar
SKIP_PATH_PREFIXES = (
    # Theme editor — renk seçici, hex/rgb kaçınılmaz
    "web/apps/mfe-shell/src/app/theme/components/",
    "web/apps/mfe-shell/src/app/theme/color-utils.ts",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx",
    "web/apps/mfe-shell/src/styles/theme.css",
    # Token tanımları — hex değer içermek zorunda
    "web/packages/design-system/src/tokens/color.ts",
    "web/packages/design-system/src/tokens/color.d.ts",
    "web/packages/design-system/src/tokens/focusRing.ts",
    "web/packages/design-system/src/tokens/focusRing.d.ts",
    # Theme core — tema katmanı tanımları
    "web/packages/design-system/src/theme/core/",
    "web/packages/design-system/src/theme/adapters/",
    # Intelligence test fixtures — hex values are test data
    "web/packages/design-system/src/intelligence/__tests__/",
    # ColorPicker tests — hex values are inherent to color picker testing
    "web/packages/design-system/src/components/color-picker/__tests__/",
    # Schema explorer — third-party graph visualization, uses own theme
    "web/apps/mfe-schema-explorer/",
)

ALLOWED_FALLBACK_VAR_PREFIXES: tuple[str, ...] = ()


# Match #rgb, #rrggbb, #rrggbbaa — exclude pure-numeric sequences (e.g. #1234, #257)
# which are likely issue numbers, IDs, or code references, not colors.
HEX_COLOR_RE = re.compile(r"#(?![0-9]+\b)[0-9a-f]{3,8}\b", re.IGNORECASE)
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

    total = len(hits)

    if total == 0:
        print("[check_no_hardcoded_theme_styles] OK ✅ — sıfır ihlal")
        return 0

    print(f"[check_no_hardcoded_theme_styles] FAIL: {total} ihlal bulundu:")
    for h in hits:
        print(f"- {h}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
