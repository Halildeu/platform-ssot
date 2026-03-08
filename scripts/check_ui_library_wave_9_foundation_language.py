#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-wave-9-foundation-language.v1.json"
EXPECTED_ARTIFACTS = {
    "docs/02-architecture/context/ui-library-typography.contract.v1.json",
    "docs/02-architecture/context/ui-library-iconography.contract.v1.json",
    "docs/02-architecture/context/ui-library-motion.contract.v1.json",
    "docs/02-architecture/context/ui-library-responsive-layout.contract.v1.json",
}
EXPECTED_GATES = {
    "python3 scripts/check_ui_library_foundation_contracts.py",
    "python3 scripts/check_ui_library_governance_contract.py",
    "npm -C web run gate:ui-library-wave -- --wave wave_9_foundation_language",
}


def main() -> int:
    if not CONTRACT.exists():
        print("[check_ui_library_wave_9_foundation_language] FAIL")
        print(f"- missing-contract:{CONTRACT}")
        return 1

    data = json.loads(CONTRACT.read_text(encoding="utf-8"))
    problems: list[str] = []

    if data.get("wave_id") != "wave_9_foundation_language":
        problems.append("invalid-wave-id")
    if data.get("status") != "completed":
        problems.append("invalid-status")
    if data.get("families") != ["foundation_language"]:
        problems.append("invalid-families")

    artifacts = set(data.get("focus_artifacts", []))
    if artifacts != EXPECTED_ARTIFACTS:
        problems.append("invalid-focus-artifacts")
    for rel_path in artifacts:
        if not (ROOT / rel_path).exists():
            problems.append(f"missing-focus-artifact:{rel_path}")

    gates = set(data.get("gate_requirements", []))
    for gate in EXPECTED_GATES:
        if gate not in gates:
            problems.append(f"missing-gate:{gate}")

    if problems:
        print("[check_ui_library_wave_9_foundation_language] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_wave_9_foundation_language] OK artifacts=%d"
        % len(artifacts)
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
