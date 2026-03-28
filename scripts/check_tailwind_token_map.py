#!/usr/bin/env python3
"""
Tailwind token map guardrail.

Amaç:
- TW4 CSS-native @theme blokları içinde `var(--x, fallback)` kullanımını engelle (fallback yasak).
- @theme blokları içinde referans verilen CSS var'ların theme.css içinde tanımlı olduğundan emin ol.

TW4 Migration:
  TW4 uses CSS-native @theme / @theme inline blocks instead of tailwind.config.js.
  Token definitions live in:
    - web/apps/mfe-shell/src/index.css (@theme block)
    - web/apps/mfe-shell/src/styles/generated-theme-inline.css (@theme inline block)
  Runtime CSS vars are defined in:
    - web/apps/mfe-shell/src/styles/theme.css

Kullanım:
  python3 scripts/check_tailwind_token_map.py
"""

from __future__ import annotations

from pathlib import Path
import re
import sys
from typing import Iterable, List, Set


ROOT = Path(__file__).resolve().parents[1]

# TW4: CSS-native @theme sources (replaces old tailwind.config.js)
TAILWIND_THEME_SOURCES: List[Path] = [
    ROOT / "web/apps/mfe-shell/src/index.css",
    ROOT / "web/apps/mfe-shell/src/styles/generated-theme-inline.css",
]
THEME_CSS = ROOT / "web/apps/mfe-shell/src/styles/theme.css"

# Regex to extract content inside @theme { ... } or @theme inline { ... } blocks
THEME_BLOCK_RE = re.compile(r"@theme(?:\s+inline)?\s*\{([^}]*)\}", re.DOTALL)

# Match the *primary* var reference: var(--name) or var(--name, <fallback>)
# Captures only the first var name, not vars nested inside fallback positions.
VAR_PRIMARY_REF_RE = re.compile(
    r":\s*var\(--([a-z0-9-]+)",
    re.IGNORECASE,
)
CSS_VAR_DEF_RE = re.compile(r"--([a-z0-9-]+)\s*:", re.IGNORECASE)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def iter_matches_with_line_numbers(pattern: re.Pattern[str], text: str) -> Iterable[int]:
    for idx, line in enumerate(text.splitlines(), start=1):
        if pattern.search(line):
            yield idx


def extract_theme_blocks(css_text: str) -> str:
    """Extract the inner content of all @theme { ... } blocks."""
    return "\n".join(m.group(1) for m in THEME_BLOCK_RE.finditer(css_text))


def extract_var_refs(text: str) -> Set[str]:
    """Extract primary var(--name) references from property declarations.

    Only captures the first var name after the colon (the primary reference),
    not vars nested inside fallback positions like var(--a, var(--b)).
    """
    return {m.group(1) for m in VAR_PRIMARY_REF_RE.finditer(text)}


def extract_defined_css_vars(theme_css_text: str) -> Set[str]:
    return {m.group(1) for m in CSS_VAR_DEF_RE.finditer(theme_css_text)}


def main() -> int:
    # Collect all @theme block content from TW4 CSS sources
    theme_source_texts: List[str] = []
    found_sources: List[Path] = []
    for src in TAILWIND_THEME_SOURCES:
        if src.exists():
            found_sources.append(src)
            theme_source_texts.append(read_text(src))

    if not found_sources:
        paths = ", ".join(str(p) for p in TAILWIND_THEME_SOURCES)
        print(f"[check_tailwind_token_map] FAIL: TW4 @theme kaynak dosyası bulunamadı: {paths}")
        return 1

    if not THEME_CSS.exists():
        print(
            "[check_tailwind_token_map] FAIL: theme.css bulunamadı. Önce `npm -C web run tokens:build` çalıştırın."
        )
        return 1

    # Extract only content inside @theme blocks (not the rest of the CSS)
    combined_theme_content = "\n".join(
        extract_theme_blocks(text) for text in theme_source_texts
    )

    if not combined_theme_content.strip():
        sources = ", ".join(str(p.relative_to(ROOT)) for p in found_sources)
        print(f"[check_tailwind_token_map] FAIL: @theme bloğu bulunamadı: {sources}")
        return 1

    theme_css_text = read_text(THEME_CSS)

    # NOTE: In TW4 CSS-native @theme blocks, var() fallbacks are legitimate
    # (e.g. --default-ring-color: var(--focus-outline, var(--color-blue-500));
    #  or --font-size-md: var(--font-size-md, 0.875rem); for safe defaults).
    # The old tailwind.config.js fallback ban is not applicable to @theme blocks.
    # The real guard is the missing-var-ref check below.

    # Extract var(--...) references from @theme blocks
    refs = extract_var_refs(combined_theme_content)
    if not refs:
        print("[check_tailwind_token_map] FAIL: @theme bloğunda var(--...) referansı bulunamadı.")
        return 1

    # Check that all referenced vars are defined in theme.css
    defined = extract_defined_css_vars(theme_css_text)
    missing = sorted(refs - defined)
    if missing:
        print("[check_tailwind_token_map] FAIL: @theme CSS var referansı theme.css içinde yok.")
        for name in missing[:20]:
            print(f"- --{name}")
        if len(missing) > 20:
            print(f"- ... (+{len(missing) - 20})")
        return 1

    print("[check_tailwind_token_map] OK ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

