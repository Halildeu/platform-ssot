#!/usr/bin/env python3
"""
Tailwind token map guardrail.

Amaç:
- Tailwind config içinde `var(--x, fallback)` kullanımını engelle (fallback yasak).
- Tailwind config içinde referans verilen CSS var'ların theme.css içinde tanımlı olduğundan emin ol.

Kullanım:
  python3 scripts/check_tailwind_token_map.py
"""

from __future__ import annotations

from pathlib import Path
import re
import sys
from typing import Iterable, Set


ROOT = Path(__file__).resolve().parents[1]
TAILWIND_CONFIG = ROOT / "web/tailwind.config.js"
THEME_CSS = ROOT / "web/apps/mfe-shell/src/styles/theme.css"


VAR_REF_RE = re.compile(r"var\(--([a-z0-9-]+)", re.IGNORECASE)
VAR_FALLBACK_IN_VAR_FN_RE = re.compile(r"var\(--[a-z0-9-]+\s*,", re.IGNORECASE)
CSS_VAR_DEF_RE = re.compile(r"--([a-z0-9-]+)\s*:", re.IGNORECASE)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def iter_matches_with_line_numbers(pattern: re.Pattern[str], text: str) -> Iterable[int]:
    for idx, line in enumerate(text.splitlines(), start=1):
        if pattern.search(line):
            yield idx


def extract_var_refs(text: str) -> Set[str]:
    return {m.group(1) for m in VAR_REF_RE.finditer(text)}


def extract_defined_css_vars(theme_css_text: str) -> Set[str]:
    return {m.group(1) for m in CSS_VAR_DEF_RE.finditer(theme_css_text)}


def main() -> int:
    if not TAILWIND_CONFIG.exists():
        print(f"[check_tailwind_token_map] FAIL: tailwind config bulunamadı: {TAILWIND_CONFIG}")
        return 1
    if not THEME_CSS.exists():
        print(
            "[check_tailwind_token_map] FAIL: theme.css bulunamadı. Önce `npm -C web run tokens:build` çalıştırın."
        )
        return 1

    tailwind_text = read_text(TAILWIND_CONFIG)
    theme_css_text = read_text(THEME_CSS)

    fallback_lines = list(iter_matches_with_line_numbers(VAR_FALLBACK_IN_VAR_FN_RE, tailwind_text))
    if fallback_lines:
        lines = ", ".join(str(n) for n in fallback_lines[:10])
        print("[check_tailwind_token_map] FAIL: tailwind.config.js içinde var() fallback bulundu.")
        print(f"- {TAILWIND_CONFIG.relative_to(ROOT)}:{lines}")
        return 1

    refs = extract_var_refs(tailwind_text)
    if not refs:
        print("[check_tailwind_token_map] FAIL: tailwind.config.js içinde var(--...) referansı bulunamadı.")
        return 1

    defined = extract_defined_css_vars(theme_css_text)
    missing = sorted(refs - defined)
    if missing:
        print("[check_tailwind_token_map] FAIL: tailwind.config.js CSS var referansı theme.css içinde yok.")
        for name in missing[:20]:
            print(f"- --{name}")
        if len(missing) > 20:
            print(f"- ... (+{len(missing) - 20})")
        return 1

    print("[check_tailwind_token_map] OK ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

