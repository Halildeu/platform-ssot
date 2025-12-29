#!/usr/bin/env python3
"""
PRD Delivery Items SSOT checker (hard gate, conditional).

Goal:
- PRD içinde (10. DELIVERY ITEMS) tanımlanan `PRD_DELIVERY_ITEMS_V1` JSON bloğunu
  deterministik şekilde doğrulamak.
- Bu blok yoksa: SKIP (PASS).

Rules (summary):
- delivery_items[]: id/title/slug zorunlu
- split_by: none|stream; stream ise streams[] dolu
- optional_docs: allowlist (ADR/TECH-DESIGN/GUIDE/INTERFACE-CONTRACT/DATA-CARD/MODEL-CARD + typed variants)
- story_id/story_ids verilmişse ilgili STORY/AC/TP dosyaları mevcut olmalı
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


PRD_ROOT = Path("docs/01-product/PRD")
STORY_ROOT = Path("docs/03-delivery/STORIES")
AC_ROOT = Path("docs/03-delivery/ACCEPTANCE")
TP_ROOT = Path("docs/03-delivery/TEST-PLANS")

OUT_REPORT = Path(".autopilot-tmp/flow-mining/prd-delivery-items-report.md")

RX_PRD_JSON_BLOCK = re.compile(r"```json\s*(?P<body>.*?)\s*```", re.IGNORECASE | re.DOTALL)
RX_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

RX_TOKEN_ADR = re.compile(r"^ADR-\d{4}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$", re.IGNORECASE)
RX_TOKEN_GUIDE = re.compile(r"^GUIDE-\d{4}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$", re.IGNORECASE)
RX_TOKEN_TYPED = re.compile(
    r"^(TECH-DESIGN|TECH_DESIGN|INTERFACE-CONTRACT|INTERFACE_CONTRACT|DATA-CARD|MODEL-CARD)\s*=\s*([A-Za-z0-9-]+)$",
    re.IGNORECASE,
)

ALLOW_SIMPLE = {
    "ADR",
    "TECH-DESIGN",
    "GUIDE",
    "INTERFACE-CONTRACT",
    "DATA-CARD",
    "MODEL-CARD",
}

ALLOW_SPLIT_BY = {"none", "stream"}


def norm_slug(s: str) -> str:
    s = s.strip().lower()
    if not RX_SLUG.fullmatch(s):
        raise ValueError("slug must be kebab-case")
    return s


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def extract_ssot(prd_text: str) -> dict | None:
    for m in RX_PRD_JSON_BLOCK.finditer(prd_text):
        body = m.group("body").strip()
        if not body.startswith("{"):
            continue
        try:
            data = json.loads(body)
        except Exception:
            continue
        if isinstance(data, dict) and data.get("ssot") == "PRD_DELIVERY_ITEMS_V1":
            return data
    return None


def docs_exist_for_story_num(num4: str) -> bool:
    story_ok = any(True for _ in STORY_ROOT.glob(f"STORY-{num4}-*.md"))
    ac_ok = any(True for _ in AC_ROOT.glob(f"AC-{num4}-*.md"))
    tp_ok = any(True for _ in TP_ROOT.glob(f"TP-{num4}-*.md"))
    return story_ok and ac_ok and tp_ok


def validate_optional_token(token: str) -> str:
    t = token.strip()
    if not t:
        raise ValueError("empty optional_docs token")

    up = t.upper().replace("_", "-")
    if up in ALLOW_SIMPLE:
        return up

    if RX_TOKEN_ADR.match(t):
        return up
    if RX_TOKEN_GUIDE.match(t):
        return up

    m = RX_TOKEN_TYPED.match(t)
    if m:
        typ = m.group(1).upper().replace("_", "-")
        slug = norm_slug(m.group(2))
        return f"{typ}={slug}"

    raise ValueError(f"unknown optional_docs token: {token!r}")


def main() -> int:
    if not PRD_ROOT.exists():
        print(f"[check_prd_delivery_items] FAIL: missing PRD root: {PRD_ROOT}")
        return 1

    scanned = 0
    ssot_prds = 0
    violations: list[str] = []
    warnings: list[str] = []

    for prd_path in sorted(PRD_ROOT.glob("PRD-*.md")):
        if not prd_path.is_file():
            continue
        scanned += 1
        txt = read_text(prd_path)
        ssot = extract_ssot(txt)
        if not ssot:
            continue
        ssot_prds += 1

        items = ssot.get("delivery_items")
        if not isinstance(items, list):
            violations.append(f"{prd_path}: delivery_items must be a list")
            continue

        seen_ids: set[str] = set()
        seen_slugs: set[str] = set()

        for it in items:
            if not isinstance(it, dict):
                violations.append(f"{prd_path}: each delivery_item must be an object")
                continue
            item_id = it.get("id")
            title = it.get("title")
            slug = it.get("slug")
            if not isinstance(item_id, str) or not item_id.strip():
                violations.append(f"{prd_path}: delivery_item.id missing/invalid")
                continue
            if not isinstance(title, str) or not title.strip():
                violations.append(f"{prd_path}: {item_id}: title missing/invalid")
                continue
            if not isinstance(slug, str) or not slug.strip():
                violations.append(f"{prd_path}: {item_id}: slug missing/invalid")
                continue

            try:
                slug_n = norm_slug(slug)
            except Exception as e:
                violations.append(f"{prd_path}: {item_id}: slug invalid: {e}")
                continue

            if item_id in seen_ids:
                violations.append(f"{prd_path}: duplicate delivery_item.id: {item_id}")
            if slug_n in seen_slugs:
                violations.append(f"{prd_path}: duplicate delivery_item.slug: {slug_n}")
            seen_ids.add(item_id)
            seen_slugs.add(slug_n)

            split_by = str(it.get("split_by") or "none").strip().lower()
            if split_by not in ALLOW_SPLIT_BY:
                violations.append(f"{prd_path}: {item_id}: split_by must be none|stream")

            streams = it.get("streams") or []
            if streams is None:
                streams = []
            if not isinstance(streams, list):
                violations.append(f"{prd_path}: {item_id}: streams must be a list")
                streams = []
            norm_streams: list[str] = []
            for s in streams:
                if not isinstance(s, str) or not s.strip():
                    violations.append(f"{prd_path}: {item_id}: streams must contain non-empty strings")
                    continue
                try:
                    norm_streams.append(norm_slug(s))
                except Exception as e:
                    violations.append(f"{prd_path}: {item_id}: stream invalid: {s!r}: {e}")
            if split_by == "stream" and not norm_streams:
                violations.append(f"{prd_path}: {item_id}: split_by=stream requires non-empty streams")

            services = it.get("services") or []
            if services is None:
                services = []
            if not isinstance(services, list):
                violations.append(f"{prd_path}: {item_id}: services must be a list")
                services = []
            norm_services: list[str] = []
            for s in services:
                if not isinstance(s, str) or not s.strip():
                    violations.append(f"{prd_path}: {item_id}: services must contain non-empty strings")
                    continue
                try:
                    norm_services.append(norm_slug(s))
                except Exception as e:
                    violations.append(f"{prd_path}: {item_id}: service invalid: {s!r}: {e}")

            optional_docs = it.get("optional_docs") or []
            if optional_docs is None:
                optional_docs = []
            if not isinstance(optional_docs, list):
                violations.append(f"{prd_path}: {item_id}: optional_docs must be a list")
                optional_docs = []
            norm_optional: list[str] = []
            for tok in optional_docs:
                if not isinstance(tok, str):
                    violations.append(f"{prd_path}: {item_id}: optional_docs must contain strings")
                    continue
                try:
                    norm_optional.append(validate_optional_token(tok))
                except Exception as e:
                    violations.append(f"{prd_path}: {item_id}: optional token invalid: {e}")

            # service requirement hint (ADR/TECH-DESIGN)
            if any(x.startswith("ADR") or x.startswith("TECH-DESIGN") for x in norm_optional) and not norm_services:
                violations.append(f"{prd_path}: {item_id}: services required when optional_docs includes ADR/TECH-DESIGN")

            # story_id/story_ids are optional; if provided, docs must exist (keeps SSOT deterministic).
            story_id = it.get("story_id")
            if split_by != "stream" and story_id is None:
                warnings.append(
                    f"{prd_path}: {item_id}: story_id is null (not pinned); pin after first generation to prevent duplicate STORY IDs"
                )
            if story_id is not None:
                if not isinstance(story_id, str) or not re.fullmatch(r"\d{4}", story_id.strip()):
                    violations.append(f"{prd_path}: {item_id}: story_id must be 4 digits or null")
                else:
                    num4 = story_id.strip()
                    if not docs_exist_for_story_num(num4):
                        violations.append(f"{prd_path}: {item_id}: STORY/AC/TP missing for story_id={num4}")

            story_ids = it.get("story_ids")
            if split_by == "stream" and story_ids is None:
                warnings.append(
                    f"{prd_path}: {item_id}: split_by=stream but story_ids is null (not pinned); pin after first generation to prevent duplicate STORY IDs"
                )
            if story_ids is not None:
                if not isinstance(story_ids, dict):
                    violations.append(f"{prd_path}: {item_id}: story_ids must be object or null")
                else:
                    for k, v in story_ids.items():
                        if not isinstance(k, str) or not k.strip():
                            violations.append(f"{prd_path}: {item_id}: story_ids key invalid")
                            continue
                        if not isinstance(v, str) or not re.fullmatch(r"\d{4}", v.strip()):
                            violations.append(f"{prd_path}: {item_id}: story_ids[{k}] must be 4 digits")
                            continue
                        if not docs_exist_for_story_num(v.strip()):
                            violations.append(
                                f"{prd_path}: {item_id}: STORY/AC/TP missing for story_ids[{k}]={v.strip()}"
                            )

        if not items:
            warnings.append(f"{prd_path}: PRD_DELIVERY_ITEMS_V1 present but delivery_items empty")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# PRD Delivery Items SSOT Report (local-only)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- scanned_prds: {scanned}")
    lines.append(f"- prds_with_ssot: {ssot_prds}")
    lines.append(f"- violations: {len(violations)}")
    lines.append(f"- warnings: {len(warnings)}")
    lines.append("")
    for w in warnings[:80]:
        lines.append(f"- WARN: {w}")
    if warnings and len(warnings) > 80:
        lines.append(f"- ... ({len(warnings) - 80} more)")
    for v in violations[:200]:
        lines.append(f"- FAIL: {v}")
    if violations and len(violations) > 200:
        lines.append(f"- ... ({len(violations) - 200} more)")
    if not warnings and not violations:
        lines.append("- none")
    OUT_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[check_prd_delivery_items] report={OUT_REPORT} violations={len(violations)} warnings={len(warnings)}")
    return 1 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
