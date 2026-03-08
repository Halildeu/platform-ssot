#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
ADOPTION = ROOT / "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json"
THEME_CATALOG = ROOT / "docs/02-architecture/context/ui-library-theme-preset-catalog.v1.json"
RECIPE_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-recipe-system.contract.v1.json"
THEME_CONTRACT = ROOT / "web/design-tokens/generated/theme-contract.json"
REGISTRY = ROOT / "web/packages/ui-kit/src/catalog/component-registry.v1.json"
PAGE_BLOCK_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-page-block-library.contract.v1.json"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    problems: list[str] = []
    for path in (ADOPTION, THEME_CATALOG, RECIPE_CONTRACT, THEME_CONTRACT, REGISTRY, PAGE_BLOCK_CONTRACT):
        if not path.exists():
            problems.append(f"missing-file:{path}")
    if problems:
        print("[check_ui_library_system_extensions] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    adoption = load_json(ADOPTION)
    theme_catalog = load_json(THEME_CATALOG)
    recipe_contract = load_json(RECIPE_CONTRACT)
    theme_contract = load_json(THEME_CONTRACT)
    registry = load_json(REGISTRY)
    page_block = load_json(PAGE_BLOCK_CONTRACT)

    for key in ("version", "contract_id", "subject_id", "purpose", "ui_kit_first_rule", "forbidden_patterns", "current_enforced_checks"):
        if key not in adoption:
            problems.append(f"adoption-missing-key:{key}")

    required_checks = {
        "npm -C web run lint:tailwind",
        "npm -C web run lint:no-antd",
        "npm -C web run doctor:frontend -- --preset ui-library",
        "npm -C web run gate:ui-library-wave",
        "python3 scripts/check_no_hardcoded_theme_styles.py",
        "python3 scripts/check_ui_library_adoption_enforcement.py",
    }
    enforced = set(adoption.get("current_enforced_checks", []))
    for item in required_checks:
        if item not in enforced:
            problems.append(f"adoption-missing-check:{item}")

    allowed_modes = set(theme_contract.get("allowedModes", []))
    presets = theme_catalog.get("presets", [])
    if len(presets) < 4:
        problems.append("insufficient-theme-presets")
    for preset in presets:
        if preset.get("theme_mode") not in allowed_modes:
            problems.append(f"invalid-theme-mode:{preset.get('preset_id', 'unknown')}")

    registry_names = {item.get("name") for item in registry.get("items", [])}
    page_block_names = set(page_block.get("scope", {}).get("current_exported_blocks", []))
    for recipe in recipe_contract.get("current_recipe_families", []):
        for owner in recipe.get("owner_blocks", []):
            if owner not in registry_names and owner not in page_block_names:
                problems.append(f"unknown-recipe-owner:{recipe.get('recipe_id', 'unknown')}:{owner}")

    if problems:
        print("[check_ui_library_system_extensions] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_system_extensions] OK presets=%d recipes=%d"
        % (len(presets), len(recipe_contract.get("current_recipe_families", [])))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
