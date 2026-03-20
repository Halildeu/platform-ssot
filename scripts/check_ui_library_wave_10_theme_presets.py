#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from ui_library_checks import load_json_with_authorities

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-wave-10-theme-presets.v1.json"
CATALOG = ROOT / "docs/02-architecture/context/ui-library-theme-preset-catalog.v1.json"
ROADMAP = ROOT / "docs/02-architecture/context/ui-library-component-roadmap.v1.json"
REGISTRY = ROOT / "web/packages/ui-kit/src/catalog/component-registry.v1.json"
API_CATALOG = ROOT / "web/packages/ui-kit/src/catalog/component-api-catalog.v1.json"
DESIGNLAB_INDEX = ROOT / "web/apps/mfe-shell/src/pages/admin/design-lab.index.json"

EXPECTED_GATES = {
    "python3 scripts/check_ui_library_system_extensions.py",
    "python3 scripts/check_ui_library_governance_contract.py",
    "npm -C web run gate:ui-library-wave -- --wave wave_10_theme_presets",
}
EXPECTED_COMPONENTS = {"ThemePresetGallery", "ThemePresetCompare"}

def main() -> int:
    required_paths = [CONTRACT, CATALOG, ROADMAP, REGISTRY, API_CATALOG, DESIGNLAB_INDEX]
    missing = [path for path in required_paths if not path.exists()]
    if missing:
        print("[check_ui_library_wave_10_theme_presets] FAIL")
        for path in missing:
            print(f"- missing-file:{path}")
        return 1

    data = load_json_with_authorities(CONTRACT.relative_to(ROOT).as_posix())
    catalog = load_json_with_authorities(CATALOG.relative_to(ROOT).as_posix())
    roadmap = load_json_with_authorities(ROADMAP.relative_to(ROOT).as_posix())
    registry = load_json_with_authorities(REGISTRY.relative_to(ROOT).as_posix())
    api_catalog = load_json_with_authorities(API_CATALOG.relative_to(ROOT).as_posix())
    designlab_index = load_json_with_authorities(DESIGNLAB_INDEX.relative_to(ROOT).as_posix())
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
    if CATALOG.relative_to(ROOT).as_posix() not in focus:
        problems.append("missing-focus-artifact:theme-preset-catalog")

    if len(catalog.get("presets", [])) < 4:
        problems.append("insufficient-presets")
    if set(catalog.get("rules", [])) == set():
        problems.append("missing-preset-rules")

    gates = set(data.get("gate_requirements", []))
    for gate in EXPECTED_GATES:
        if gate not in gates:
            problems.append(f"missing-gate:{gate}")

    roadmap_families = {
        family.get("family_id"): family for family in roadmap.get("component_family_matrix", [])
    }
    theme_family = roadmap_families.get("theme_presets")
    if not theme_family:
        problems.append("roadmap-missing-family:theme_presets")
    else:
        target_components = {
            item.get("component_name")
            for item in theme_family.get("target_components", [])
            if item.get("target_wave") == "wave_10_theme_presets"
        }
        if target_components != EXPECTED_COMPONENTS:
            problems.append(f"roadmap-target-components:{sorted(target_components)}")
        implemented_now = set(theme_family.get("current_state", {}).get("implemented_now", []))
        if implemented_now != EXPECTED_COMPONENTS:
            problems.append(f"roadmap-implemented-now:{sorted(implemented_now)}")

    roadmap_waves = {
        wave.get("wave_id"): set(wave.get("candidate_components", []))
        for wave in roadmap.get("release_waves", [])
    }
    if roadmap_waves.get("wave_10_theme_presets") != EXPECTED_COMPONENTS:
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
        if entry.get("roadmapWaveId") != "wave_10_theme_presets":
            problems.append(f"registry-wave:{component}:{entry.get('roadmapWaveId')}")
        if component not in api_items:
            problems.append(f"missing-api-catalog-entry:{component}")
        if component not in index_items:
            problems.append(f"missing-designlab-index-entry:{component}")

    if problems:
        print("[check_ui_library_wave_10_theme_presets] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_wave_10_theme_presets] OK presets=%d components=%d"
        % (len(catalog.get("presets", [])), len(EXPECTED_COMPONENTS))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
