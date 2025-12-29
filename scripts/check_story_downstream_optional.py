#!/usr/bin/env python3
"""
STORY Downstream optional token enforcement (hard gate).

Goal:
- Optional dokümanlar her işte zorunlu değil.
- Ama bir STORY meta bloğunda Downstream satırında optional token verilirse,
  o dokümanların repo içinde gerçekten var olmasını garanti eder.

Supported tokens (case-insensitive):
- ADR-0001 (or ADR-0001-<slug>)
- TECH-DESIGN
- GUIDE (or GUIDE-0001 / GUIDE-0001-<slug>)
- INTERFACE-CONTRACT
- DATA-CARD
- MODEL-CARD
- svc=<service> / service=<service> (kebab-case)

Canonical paths (DOCS-PRODUCTION):
- TECH-DESIGN: docs/02-architecture/services/<svc>/TECH-DESIGN-<delivery-slug>.md
- ADR: docs/02-architecture/services/**/ADR/ADR-0001-*.md (svc varsa daha dar)
- GUIDE: docs/03-delivery/guides/<delivery-slug>/GUIDE-*.md
- INTERFACE-CONTRACT: docs/03-delivery/INTERFACE-CONTRACTS/INTERFACE-CONTRACT-<delivery-slug>.md
- DATA-CARD: docs/05-ml-ai/DATA-CARDS/DATA-CARD-<delivery-slug>.md
- MODEL-CARD: docs/05-ml-ai/MODEL-CARDS/MODEL-CARD-<delivery-slug>.md
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STORIES_DIR = ROOT / "docs/03-delivery/STORIES"
SERVICES_DIR = ROOT / "docs/02-architecture/services"
GUIDES_DIR = ROOT / "docs/03-delivery/guides"

INTERFACE_CONTRACT_DIR = ROOT / "docs/03-delivery/INTERFACE-CONTRACTS"
DATA_CARD_DIR = ROOT / "docs/05-ml-ai/DATA-CARDS"
MODEL_CARD_DIR = ROOT / "docs/05-ml-ai/MODEL-CARDS"

OUT_REPORT = ROOT / ".autopilot-tmp/flow-mining/story-downstream-optional-report.md"

RX_DOWNSTREAM = re.compile(r"(?mi)^\s*Downstream:\s*(?P<value>.+?)\s*$")
RX_SVC = re.compile(r"\b(?:svc|service)=(?P<svc>[a-z0-9]+(?:-[a-z0-9]+)*)\b", re.IGNORECASE)
RX_ADR = re.compile(r"\bADR-(?P<num>\d{4})(?:-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*))?\b", re.IGNORECASE)
RX_GUIDE = re.compile(r"\bGUIDE-(?P<num>\d{4})(?:-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*))?\b", re.IGNORECASE)


def story_id_and_slug_from_filename(path: Path) -> tuple[str, str] | None:
    m = re.match(r"^(STORY-\d{4})-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$", path.name)
    if not m:
        return None
    return m.group(1), m.group("slug")


def read_downstream_value(path: Path) -> str:
    # meta bloğu genelde dosyanın başında; hızlı okumak için ilk ~30 satır yeterli
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()[:40]
    text = "\n".join(lines)
    m = RX_DOWNSTREAM.search(text)
    return m.group("value") if m else ""


def exists_any(pattern: str) -> bool:
    return any(True for _ in ROOT.glob(pattern))


def main() -> int:
    if not STORIES_DIR.exists():
        print(f"[check_story_downstream_optional] FAIL: missing stories dir: {STORIES_DIR}")
        return 1

    scanned = 0
    violations: list[str] = []

    for story_path in sorted(STORIES_DIR.glob("STORY-*.md")):
        meta = story_id_and_slug_from_filename(story_path)
        if not meta:
            continue
        story_id, delivery_slug = meta
        scanned += 1

        downstream = read_downstream_value(story_path)
        if not downstream:
            continue

        svc_matches = RX_SVC.findall(downstream)
        service_slug = svc_matches[0].lower() if svc_matches else ""

        adr_matches = list(RX_ADR.finditer(downstream))
        guide_matches = list(RX_GUIDE.finditer(downstream))

        wants_tech_design = bool(re.search(r"\bTECH-DESIGN\b", downstream, re.IGNORECASE))
        wants_guide_auto = bool(re.search(r"\bGUIDE\b", downstream, re.IGNORECASE)) and not guide_matches
        wants_interface_contract = bool(re.search(r"\bINTERFACE-CONTRACT\b", downstream, re.IGNORECASE))
        wants_data_card = bool(re.search(r"\bDATA-CARD\b", downstream, re.IGNORECASE))
        wants_model_card = bool(re.search(r"\bMODEL-CARD\b", downstream, re.IGNORECASE))

        # ADR tokens
        for m in adr_matches:
            adr_id = f"ADR-{m.group('num')}"
            slug = (m.group("slug") or "").strip().lower()
            if slug:
                expected_name = f"{adr_id}-{slug}.md"
                if service_slug:
                    ok = (SERVICES_DIR / service_slug / "ADR" / expected_name).exists()
                else:
                    ok = exists_any(f"docs/02-architecture/services/**/ADR/{expected_name}")
                if not ok:
                    violations.append(f"{story_id}: missing ADR doc: {expected_name} (svc={service_slug or 'any'})")
            else:
                if service_slug:
                    ok = exists_any(f"docs/02-architecture/services/{service_slug}/ADR/{adr_id}-*.md")
                else:
                    ok = exists_any(f"docs/02-architecture/services/**/ADR/{adr_id}-*.md")
                if not ok:
                    violations.append(f"{story_id}: missing ADR doc for {adr_id} (svc={service_slug or 'any'})")

        # TECH-DESIGN token (service-scoped if svc provided; otherwise best-effort global lookup)
        if wants_tech_design:
            expected_name = f"TECH-DESIGN-{delivery_slug}.md"
            if service_slug:
                if not (SERVICES_DIR / service_slug / expected_name).exists():
                    violations.append(f"{story_id}: missing TECH-DESIGN: services/{service_slug}/{expected_name}")
            else:
                if not exists_any(f"docs/02-architecture/services/**/{expected_name}"):
                    violations.append(f"{story_id}: missing TECH-DESIGN: {expected_name} (svc not provided)")

        # GUIDE tokens (canonical: guides/<delivery-slug>/)
        if wants_guide_auto:
            guide_dir = GUIDES_DIR / delivery_slug
            if not any(p.is_file() for p in guide_dir.glob("GUIDE-*.md")):
                violations.append(f"{story_id}: missing GUIDE under docs/03-delivery/guides/{delivery_slug}/ (token=GUIDE)")

        for m in guide_matches:
            guide_id = f"GUIDE-{m.group('num')}"
            slug = (m.group("slug") or "").strip().lower()
            if slug:
                expected_name = f"{guide_id}-{slug}.md"
            else:
                expected_name = f"{guide_id}-{delivery_slug}.md"
            if not (GUIDES_DIR / delivery_slug / expected_name).exists():
                # fallback: allow any folder if exact match exists elsewhere
                if not exists_any(f"docs/03-delivery/guides/**/{expected_name}"):
                    violations.append(f"{story_id}: missing GUIDE doc: {expected_name}")

        # Delivery-slug scoped optional docs
        if wants_interface_contract:
            expected = INTERFACE_CONTRACT_DIR / f"INTERFACE-CONTRACT-{delivery_slug}.md"
            if not expected.exists():
                violations.append(f"{story_id}: missing INTERFACE-CONTRACT: {expected.as_posix()}")

        if wants_data_card:
            expected = DATA_CARD_DIR / f"DATA-CARD-{delivery_slug}.md"
            if not expected.exists():
                violations.append(f"{story_id}: missing DATA-CARD: {expected.as_posix()}")

        if wants_model_card:
            expected = MODEL_CARD_DIR / f"MODEL-CARD-{delivery_slug}.md"
            if not expected.exists():
                violations.append(f"{story_id}: missing MODEL-CARD: {expected.as_posix()}")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    md: list[str] = []
    md.append("# STORY Downstream Optional Report (local-only)")
    md.append("")
    md.append(f"- ts_utc: {ts}")
    md.append(f"- scanned_stories: {scanned}")
    md.append(f"- violations: {len(violations)}")
    md.append("")
    if violations:
        for v in violations[:200]:
            md.append(f"- {v}")
        if len(violations) > 200:
            md.append(f"- ... ({len(violations) - 200} more)")
    else:
        md.append("- none")
    OUT_REPORT.write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"[check_story_downstream_optional] report={OUT_REPORT} violations={len(violations)}")
    return 1 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())

