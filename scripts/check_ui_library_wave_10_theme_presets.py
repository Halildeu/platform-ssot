#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-wave-10-theme-presets.v1.json"
CATALOG = ROOT / "docs/02-architecture/context/ui-library-theme-preset-catalog.v1.json"
EXPECTED_GATES = {
    "python3 scripts/check_ui_library_system_extensions.py",
    "python3 scripts/check_ui_library_governance_contract.py",
    "npm -C web run gate:ui-library-wave -- --wave wave_10_theme_presets",
}


def main() -> int:
    if not CONTRACT.exists():
        print("[check_ui_library_wave_10_theme_presets] FAIL")
        print(f"- missing-contract:{CONTRACT}")
        return 1

    data = json.loads(CONTRACT.read_text(encoding="utf-8"))
    problems: list[str] = []

    if data.get("wave_id") != "wave_10_theme_presets":
        problems.append("invalid-wave-id")
    if data.get("status") != "completed":
        problems.append("invalid-status")
    if data.get("families") != ["theme_presets"]:
        problems.append("invalid-families")
    if data.get("dependencies") != ["wave_9_foundation_language"]:
        problems.append("invalid-dependencies")

    focus = set(data.get("focus_artifacts", []))
    if focus != {CATALOG.relative_to(ROOT).as_posix()}:
        problems.append("invalid-focus-artifacts")
    if not CATALOG.exists():
        problems.append(f"missing-focus-artifact:{CATALOG}")
    else:
        catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
        if len(catalog.get("presets", [])) < 4:
            problems.append("insufficient-presets")

    gates = set(data.get("gate_requirements", []))
    for gate in EXPECTED_GATES:
        if gate not in gates:
            problems.append(f"missing-gate:{gate}")

    if problems:
        print("[check_ui_library_wave_10_theme_presets] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_wave_10_theme_presets] OK presets=%d"
        % len(json.loads(CATALOG.read_text(encoding="utf-8")).get("presets", []))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
