#!/usr/bin/env python3
"""
GUIDE migration helper: minimal template alignment without content loss.

What it does (in-place):
- Ensures each GUIDE file has an H1 like: "# GUIDE-0001: <Title>"
- Ensures numbered headings from docs/99-templates/GUIDE.template.md exist.
  Missing headings are appended with a "TBD" placeholder.

This script is intentionally conservative: it does NOT restructure existing
content; it only adds missing required headings and normalizes the H1 line.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


GUIDES_ROOT = Path("docs/03-delivery/guides")
TEMPLATE_PATH = Path("docs/99-templates/GUIDE.template.md")

RE_H1 = re.compile(r"^#\s+(.+?)\s*$")
RE_GUIDE_ID = re.compile(r"\bGUIDE-\d{4}\b", re.IGNORECASE)
RE_NUM = re.compile(r"^\s*(\d+)\.\s+(.+?)\s*$")


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip()).lower()


def load_required_headings(template_path: Path) -> list[tuple[int, str]]:
    txt = template_path.read_text(encoding="utf-8", errors="ignore")
    required: list[tuple[int, str]] = []
    for line in txt.splitlines():
        m = RE_NUM.match(line)
        if not m:
            continue
        required.append((int(m.group(1)), m.group(2).strip()))
    if not required:
        raise ValueError(f"No numbered headings found in template: {template_path}")
    return required


def extract_guide_id(path: Path) -> str | None:
    m = RE_GUIDE_ID.search(path.name)
    return m.group(0).upper() if m else None


def title_from_existing_h1(h1: str, guide_id: str, fallback: str) -> str:
    s = h1.strip()
    # If h1 already contains GUIDE-XXXX, strip it and any separators.
    # Examples:
    #   "GUIDE-0001: Foo" -> "Foo"
    #   "GUIDE-0001 - Foo" -> "Foo"
    #   "GUIDE-0001" -> fallback
    m = re.match(r"^\s*(GUIDE-\d{4})\s*[:–-]?\s*(.*?)\s*$", s, flags=re.IGNORECASE)
    if m:
        rest = (m.group(2) or "").strip()
        return rest if rest else fallback
    return s if s else fallback


def title_from_filename(path: Path) -> str:
    # GUIDE-0001-foo-bar.md -> "foo bar"
    stem = path.stem
    m = re.match(r"^GUIDE-\d{4}-(.+)$", stem, flags=re.IGNORECASE)
    if not m:
        return stem
    slug = m.group(1)
    return slug.replace("-", " ").strip() or stem


def ensure_h1(lines: list[str], guide_id: str, title: str) -> tuple[list[str], bool]:
    new_h1 = f"# {guide_id}: {title}"
    for i, line in enumerate(lines):
        m = RE_H1.match(line)
        if not m:
            continue
        if line.strip() == new_h1.strip():
            return lines, False
        lines2 = list(lines)
        lines2[i] = new_h1
        return lines2, True

    # No H1 found; prepend.
    out = [new_h1, ""] + list(lines)
    return out, True


def existing_numbered_headings(lines: list[str]) -> set[str]:
    have: set[str] = set()
    for line in lines:
        m = RE_NUM.match(line)
        if not m:
            continue
        have.add(norm(m.group(2)))
    return have


def append_missing_headings(
    lines: list[str], required: list[tuple[int, str]]
) -> tuple[list[str], bool]:
    have = existing_numbered_headings(lines)
    missing = [(n, label) for n, label in required if norm(label) not in have]
    if not missing:
        return lines, False

    out = list(lines)
    if out and out[-1].strip():
        out.append("")
    for n, label in missing:
        out.append(f"{n}. {label}")
        out.append("TBD")
        out.append("")
    # Trim trailing blank lines to a single newline at write time.
    while out and not out[-1].strip():
        out.pop()
    out.append("")  # final newline
    return out, True


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Print changes, do not write files")
    ap.add_argument("--root", default=str(GUIDES_ROOT), help="Guides root directory")
    args = ap.parse_args(argv[1:])

    guides_root = Path(args.root)
    if not TEMPLATE_PATH.exists():
        print(f"[align_guides_to_template] FAIL: missing template: {TEMPLATE_PATH}")
        return 1
    if not guides_root.exists():
        print(f"[align_guides_to_template] FAIL: guides root missing: {guides_root}")
        return 1

    required = load_required_headings(TEMPLATE_PATH)

    files = sorted([p for p in guides_root.rglob("GUIDE-*.md") if p.is_file()])
    changed = 0
    for path in files:
        guide_id = extract_guide_id(path)
        if not guide_id:
            continue

        raw = path.read_text(encoding="utf-8", errors="ignore")
        lines = raw.splitlines()

        # Determine title
        existing_title = None
        for line in lines:
            m = RE_H1.match(line)
            if m:
                existing_title = m.group(1).strip()
                break
        fallback_title = title_from_filename(path)
        title = title_from_existing_h1(existing_title or "", guide_id, fallback_title)

        lines2, h1_changed = ensure_h1(lines, guide_id, title)
        lines3, headings_changed = append_missing_headings(lines2, required)

        if not (h1_changed or headings_changed):
            continue

        changed += 1
        if args.dry_run:
            print(f"[DRY] would update: {path}")
            continue
        path.write_text("\n".join(lines3), encoding="utf-8")

    print(f"[align_guides_to_template] files={len(files)} changed={changed} dry_run={args.dry_run}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
