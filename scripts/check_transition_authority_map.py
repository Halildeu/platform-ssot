#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent

MANDATORY_REFERENCES = {
    "AGENTS.md": [
        "standards.lock",
        "docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md",
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition-active",
    ],
    "AGENT-CODEX.core.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.backend.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.web.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.mobile.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.ai.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.data.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "AGENT-CODEX.docs.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "docs/00-handbook/DEV-GUIDE.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "docs/00-handbook/DOC-HIERARCHY.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "docs/00-handbook/DOCS-WORKFLOW.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "docs/00-handbook/DOCS-PROJECT-LAYOUT.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
        "Transition Durumu",
    ],
    "docs/04-operations/RUNBOOKS/RB-insansiz-flow.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
    ],
    "docs/04-operations/RUNBOOKS/RB-codex-canonical-flow-v0.1.md": [
        "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
    ],
}


def main() -> int:
    errors: list[str] = []

    authority_map = REPO_ROOT / "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md"
    if not authority_map.exists():
        errors.append("Missing docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md")

    for rel_path, needles in MANDATORY_REFERENCES.items():
        path = REPO_ROOT / rel_path
        if not path.exists():
            errors.append(f"Missing required transition file: {rel_path}")
            continue
        text = path.read_text(encoding="utf-8")
        for needle in needles:
            if needle not in text:
                errors.append(f"{rel_path}: missing marker -> {needle}")

    if errors:
        print("FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("OK - transition authority map markers present")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
