#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
ROADMAP = ROOT / "docs/02-architecture/context/ui-library-component-roadmap.v1.json"

REQUIRED_FAMILIES = {
    "foundation_primitives",
    "navigation",
    "forms",
    "data_display",
    "page_blocks",
    "overlay",
    "ai_native_helpers",
}

REQUIRED_WAVES = {
    "wave_0_foundation_locked",
    "wave_1_foundation_primitives",
    "wave_2_navigation",
    "wave_3_forms",
    "wave_4_data_display",
    "wave_5_overlay",
    "wave_6_ai_native_helpers",
    "wave_7_page_blocks",
}


def main() -> int:
    if not ROADMAP.exists():
        print("[check_ui_library_component_roadmap] FAIL: missing roadmap")
        return 1

    data = json.loads(ROADMAP.read_text(encoding="utf-8"))
    problems: list[str] = []

    required_top = [
        "version",
        "subject_id",
        "baseline_state",
        "planning_rule",
        "component_family_matrix",
        "maturity_targets",
        "gate_check_evidence_plan",
        "release_waves",
    ]
    for key in required_top:
        if key not in data:
            problems.append(f"missing-key:{key}")

    families = data.get("component_family_matrix", [])
    family_ids = {family.get("family_id") for family in families}
    for family_id in REQUIRED_FAMILIES:
        if family_id not in family_ids:
            problems.append(f"missing-family:{family_id}")

    for family in families:
        if not family.get("target_components"):
            problems.append(f"family-without-targets:{family.get('family_id', 'unknown')}")
            continue
        for item in family["target_components"]:
            for key in ["component_name", "target_wave", "target_maturity", "ux_primary_theme_id", "ux_primary_subtheme_id"]:
                if key not in item:
                    problems.append(f"missing-target-field:{family.get('family_id','unknown')}:{item.get('component_name','unknown')}:{key}")

    waves = data.get("release_waves", [])
    wave_ids = {wave.get("wave_id") for wave in waves}
    for wave_id in REQUIRED_WAVES:
        if wave_id not in wave_ids:
            problems.append(f"missing-wave:{wave_id}")

    if "common_checks" not in data.get("gate_check_evidence_plan", {}):
        problems.append("missing-common-checks")

    if problems:
        print("[check_ui_library_component_roadmap] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_component_roadmap] OK families=%d waves=%d"
        % (len(families), len(waves))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
