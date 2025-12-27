#!/usr/bin/env python3
import re
import sys
from pathlib import Path

TEMPLATE = Path("docs/99-templates/RUNBOOK.template.md")
RUNBOOK_DIR = Path("docs/04-operations/RUNBOOKS")

# Numbered heading: "1. AMAÇ" gibi
NUM_HDR = re.compile(r"^\s*\d+\.\s+([A-ZÇĞİÖŞÜ0-9 /-]+)\s*$", re.M)


def extract_required(template_text: str) -> list[str]:
    return [h.strip() for h in NUM_HDR.findall(template_text)]


def main() -> int:
    if not TEMPLATE.exists():
        print("[check_runbook_required_sections] SKIP: template missing")
        return 0

    required = extract_required(TEMPLATE.read_text(encoding="utf-8", errors="ignore"))
    if not required:
        print("[check_runbook_required_sections] SKIP: no numbered headings found in template")
        return 0

    bad: list[tuple[Path, list[str]]] = []
    for rb in RUNBOOK_DIR.glob("RB-*.md"):
        txt = rb.read_text(encoding="utf-8", errors="ignore")
        have = {h.strip() for h in NUM_HDR.findall(txt)}
        missing = [h for h in required if h not in have]
        if missing:
            bad.append((rb, missing))

    if bad:
        print("[check_runbook_required_sections] FAIL:")
        for rb, missing in bad[:100]:
            print(f"- {rb}: missing {missing}")
        return 1

    print("[check_runbook_required_sections] PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())

