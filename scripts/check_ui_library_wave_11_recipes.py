#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-wave-11-recipes.v1.json"
RECIPE_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-recipe-system.contract.v1.json"
ADOPTION_CONTRACT = ROOT / "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json"
ROADMAP = ROOT / "docs/02-architecture/context/ui-library-component-roadmap.v1.json"
REGISTRY = ROOT / "web/packages/ui-kit/src/catalog/component-registry.v1.json"
API_CATALOG = ROOT / "web/packages/ui-kit/src/catalog/component-api-catalog.v1.json"
DESIGNLAB_INDEX = ROOT / "web/apps/mfe-shell/src/pages/admin/design-lab.index.json"

EXPECTED_GATES = {
    "python3 scripts/check_ui_library_system_extensions.py",
    "python3 scripts/check_ui_library_governance_contract.py",
    "npm -C web run gate:ui-library-wave -- --wave wave_11_recipes",
}
EXPECTED_DEPENDENCIES = {"wave_7_page_blocks", "wave_10_theme_presets"}
EXPECTED_COMPONENTS = {
    "SearchFilterListing",
    "DetailSummary",
    "ApprovalReview",
    "EmptyErrorLoading",
    "AIGuidedAuthoring",
}
EXPECTED_RECIPE_IDS = {
    "search_filter_listing",
    "detail_summary",
    "approval_review",
    "empty_error_loading",
    "ai_guided_authoring",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    required_paths = [
        CONTRACT,
        RECIPE_CONTRACT,
        ADOPTION_CONTRACT,
        ROADMAP,
        REGISTRY,
        API_CATALOG,
        DESIGNLAB_INDEX,
    ]
    missing = [path for path in required_paths if not path.exists()]
    if missing:
        print("[check_ui_library_wave_11_recipes] FAIL")
        for path in missing:
            print(f"- missing-file:{path}")
        return 1

    data = load_json(CONTRACT)
    recipes = load_json(RECIPE_CONTRACT)
    roadmap = load_json(ROADMAP)
    registry = load_json(REGISTRY)
    api_catalog = load_json(API_CATALOG)
    designlab_index = load_json(DESIGNLAB_INDEX)
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

    recipe_ids = {
        item.get("recipe_id") for item in recipes.get("current_recipe_families", []) if isinstance(item, dict)
    }
    if recipe_ids != EXPECTED_RECIPE_IDS:
        problems.append(f"recipe-contract-ids:{sorted(recipe_ids)}")

    gates = set(data.get("gate_requirements", []))
    for gate in EXPECTED_GATES:
        if gate not in gates:
            problems.append(f"missing-gate:{gate}")

    roadmap_families = {
        family.get("family_id"): family for family in roadmap.get("component_family_matrix", [])
    }
    recipe_family = roadmap_families.get("recipes")
    if not recipe_family:
        problems.append("roadmap-missing-family:recipes")
    else:
        target_components = {
            item.get("component_name")
            for item in recipe_family.get("target_components", [])
            if item.get("target_wave") == "wave_11_recipes"
        }
        if target_components != EXPECTED_COMPONENTS:
            problems.append(f"roadmap-target-components:{sorted(target_components)}")

    roadmap_waves = {
        wave.get("wave_id"): set(wave.get("candidate_components", []))
        for wave in roadmap.get("release_waves", [])
    }
    if roadmap_waves.get("wave_11_recipes") != EXPECTED_COMPONENTS:
        problems.append("roadmap-wave-candidates-mismatch")

    registry_items = {
        item.get("name"): item for item in registry.get("items", []) if isinstance(item, dict)
    }
    api_items = {
        item.get("name") for item in api_catalog.get("items", []) if isinstance(item, dict)
    }
    index_items = {
        item.get("name") for item in designlab_index.get("items", []) if isinstance(item, dict)
    }

    for component in EXPECTED_COMPONENTS:
        entry = registry_items.get(component)
        if not entry:
            problems.append(f"missing-registry-entry:{component}")
            continue
        if entry.get("availability") != "exported":
            problems.append(f"registry-not-exported:{component}")
        if entry.get("demoMode") != "live":
            problems.append(f"registry-demo-mode:{component}:{entry.get('demoMode')}")
        if entry.get("roadmapWaveId") != "wave_11_recipes":
            problems.append(f"registry-wave:{component}:{entry.get('roadmapWaveId')}")
        if component not in api_items:
            problems.append(f"missing-api-catalog-entry:{component}")
        if component not in index_items:
            problems.append(f"missing-designlab-index-entry:{component}")

    if problems:
        print("[check_ui_library_wave_11_recipes] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_wave_11_recipes] OK recipe_families=%d components=%d"
        % (len(recipe_ids), len(EXPECTED_COMPONENTS))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
