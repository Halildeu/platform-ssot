#!/usr/bin/env python3
from __future__ import annotations

import glob
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path


POLICY_PATH = Path("docs/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")

# Supports both:
# - "1. AMAÇ"
# - "## 1. AMAÇ"
RE_NUMBERED_HEADING = re.compile(r"^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$", re.M)


def normalize_heading(raw: str) -> str:
    s = re.sub(r"\s+", " ", raw.strip())
    return s.casefold()


def extract_numbered_headings(text: str) -> list[str]:
    out: list[str] = []
    for m in re.finditer(RE_NUMBERED_HEADING, text):
        num = m.group("num").strip()
        title = m.group("title").strip()
        out.append(f"{num}. {title}")
    return out


@dataclass(frozen=True)
class MapEntry:
    doc_type: str
    template: str
    doc_glob: str
    optional: bool
    required_headings: list[str] | None
    heading_contract_mode: str | None


def load_policy() -> tuple[Path, list[MapEntry]]:
    if not POLICY_PATH.exists():
        raise FileNotFoundError(str(POLICY_PATH))
    data = json.loads(POLICY_PATH.read_text(encoding="utf-8"))

    templates_dir = Path(data["templates_dir"])
    entries: list[MapEntry] = []
    for doc_type, cfg in data["map"].items():
        mode = cfg.get("heading_contract_mode")
        entries.append(
            MapEntry(
                doc_type=str(doc_type),
                template=str(cfg["template"]),
                doc_glob=str(cfg["doc_glob"]),
                optional=bool(cfg.get("optional", False)),
                required_headings=[str(x) for x in cfg.get("required_headings", [])]
                if cfg.get("required_headings") is not None
                else None,
                heading_contract_mode=str(mode) if mode is not None else None,
            )
        )
    return templates_dir, entries


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def main() -> int:
    try:
        templates_dir, entries = load_policy()
    except FileNotFoundError:
        print(f"[check_doc_heading_contract] FAIL: policy missing: {POLICY_PATH}")
        return 1
    except Exception as exc:
        print(f"[check_doc_heading_contract] FAIL: policy load error: {exc}")
        return 1

    failures: list[str] = []
    warnings: list[str] = []

    for entry in entries:
        mode = entry.heading_contract_mode or (
            "subset" if entry.required_headings is not None else "template_as_contract"
        )
        if mode == "disabled":
            warnings.append(f"[SKIP] {entry.doc_type}: heading contract disabled by policy")
            continue

        # Non-md docs (örn. TRACE *.tsv) heading-contract kapsamında değildir.
        if ".tsv" in entry.doc_glob:
            warnings.append(f"[SKIP] {entry.doc_type}: non-md docs (tsv) -> heading contract not applied")
            continue

        tmpl_path = templates_dir / entry.template
        if not tmpl_path.exists():
            if entry.optional:
                warnings.append(f"[SKIP] {entry.doc_type}: template missing (optional): {tmpl_path}")
                continue
            failures.append(f"[TEMPLATE_MISSING] {entry.doc_type}: {tmpl_path}")
            continue

        template_headings_raw = extract_numbered_headings(read_text(tmpl_path))
        template_headings = [normalize_heading(h) for h in template_headings_raw]
        if not template_headings:
            warnings.append(f"[SKIP] {entry.doc_type}: template has no numbered headings: {tmpl_path}")
            continue

        if mode == "subset":
            if entry.required_headings is None:
                failures.append(f"[POLICY_INVALID] {entry.doc_type}: heading_contract_mode=subset requires required_headings")
                continue
            required_raw = entry.required_headings
        elif mode == "template_as_contract":
            required_raw = template_headings_raw
        else:
            failures.append(f"[POLICY_INVALID] {entry.doc_type}: unknown heading_contract_mode={mode!r}")
            continue
        required = [normalize_heading(h) for h in required_raw]
        if not required:
            warnings.append(f"[SKIP] {entry.doc_type}: required headings empty (policy/template)")
            continue

        # If required list is provided by policy, ensure it exists in template (drift guard)
        if entry.required_headings is not None and mode == "subset":
            missing_from_template = [h for h in required if h not in template_headings]
            if missing_from_template:
                failures.append(
                    f"[POLICY_DRIFT] {entry.doc_type}: required_headings not found in template: {tmpl_path.name}"
                )
                continue

        matched_docs = [Path(p) for p in glob.glob(entry.doc_glob, recursive=True)]
        if not matched_docs:
            warnings.append(f"[SKIP] {entry.doc_type}: no docs matched glob: {entry.doc_glob}")
            continue

        for doc_path in sorted(matched_docs):
            doc_text = read_text(doc_path)
            doc_headings_raw = extract_numbered_headings(doc_text)
            doc_headings = [normalize_heading(h) for h in doc_headings_raw]

            cursor = 0
            missing: list[str] = []
            for expected in required:
                try:
                    cursor = doc_headings.index(expected, cursor) + 1
                except ValueError:
                    missing.append(expected)

            if missing:
                # Show the first few headings for debugging
                preview = ", ".join(doc_headings_raw[:8]) if doc_headings_raw else "(no headings found)"
                missing_preview = ", ".join(missing[:6])
                failures.append(
                    f"[MISSING_HEADINGS] {entry.doc_type}: {doc_path} missing={len(missing)} missing_preview={missing_preview} preview={preview}"
                )

    if warnings:
        print("[check_doc_heading_contract] WARN:")
        for w in warnings[:200]:
            print(f"- {w}")
        if len(warnings) > 200:
            print(f"- ... ({len(warnings) - 200} more)")

    if failures:
        print("[check_doc_heading_contract] FAIL:")
        for f in failures[:200]:
            print(f"- {f}")
        if len(failures) > 200:
            print(f"- ... ({len(failures) - 200} more)")
        return 1

    print("[check_doc_heading_contract] PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
