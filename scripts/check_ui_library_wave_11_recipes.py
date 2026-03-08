#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-wave-11-recipes.v1.json"
RECIPE_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-recipe-system.contract.v1.json"
ADOPTION_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json"
EXPECTED_GATES = {
    "python3 scripts/check_ui_library_system_extensions.py",
    "python3 scripts/check_ui_library_governance_contract.py",
    "npm -C web run gate:ui-library-wave -- --wave wave_11_recipes",
}
EXPECTED_DEPENDENCIES = {"wave_7_page_blocks", "wave_10_theme_presets"}


def main() -> int:
    if not CONTRACT.exists():
        print("[check_ui_library_wave_11_recipes] FAIL")
        print(f"- missing-contract:{CONTRACT}")
        return 1

    data = json.loads(CONTRACT.read_text(encoding="utf-8"))
    problems: list[str] = []

    if data.get("wave_id") != "wave_11_recipes":
        problems.append("invalid-wave-id")
    if data.get("status") != "completed":
        problems.append("invalid-status")
    if data.get("families") != ["recipes"]:
        problems.append("invalid-families")

    dependencies = set(data.get("dependencies", []))
    if dependencies != EXPECTED_DEPENDENCIES:
        problems.append("invalid-dependencies")

    focus = set(data.get("focus_artifacts", []))
    expected_focus = {
        RECIPE_CONTRACT.relative_to(ROOT).as_posix(),
        ADOPTION_CONTRACT.relative_to(ROOT).as_posix(),
    }
    if focus != expected_focus:
        problems.append("invalid-focus-artifacts")

    for path in (RECIPE_CONTRACT, ADOPTION_CONTRACT):
        if not path.exists():
            problems.append(f"missing-focus-artifact:{path}")

    if RECIPE_CONTRACT.exists():
        recipes = json.loads(RECIPE_CONTRACT.read_text(encoding="utf-8"))
        if len(recipes.get("current_recipe_families", [])) < 5:
            problems.append("insufficient-recipe-families")

    gates = set(data.get("gate_requirements", []))
    for gate in EXPECTED_GATES:
        if gate not in gates:
            problems.append(f"missing-gate:{gate}")

    if problems:
        print("[check_ui_library_wave_11_recipes] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_wave_11_recipes] OK recipe_families=%d"
        % len(json.loads(RECIPE_CONTRACT.read_text(encoding="utf-8")).get("current_recipe_families", []))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
