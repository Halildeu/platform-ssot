#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
UX_REF = ROOT / "docs/02-architecture/context/ux-katalogu.reference.v1.json"
ALIGNMENT = ROOT / "docs/02-architecture/context/ui-library-ux-alignment.v1.json"
GOVERNANCE = ROOT / "docs/02-architecture/context/ui-library-governance.contract.v1.json"
REGISTRY = ROOT / "web/packages/ui-kit/src/catalog/component-registry.v1.json"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    problems: list[str] = []
    for path in [UX_REF, ALIGNMENT, GOVERNANCE, REGISTRY]:
        if not path.exists():
            problems.append(f"missing-file:{path}")
    if problems:
        print("[check_ui_library_ux_alignment] FAIL")
        for item in problems:
            print(f"- {item}")
        return 1

    ux_ref = load_json(UX_REF)
    alignment = load_json(ALIGNMENT)
    governance = load_json(GOVERNANCE)
    registry = load_json(REGISTRY)

    theme_map = {
        theme["theme_id"]: set(theme.get("subthemes", []))
        for theme in ux_ref.get("themes", [])
    }

    if alignment.get("catalog_reference") != "docs/02-architecture/context/ux-katalogu.reference.v1.json":
        problems.append("alignment-catalog-reference-mismatch")

    families = alignment.get("family_alignment", [])
    if not families:
        problems.append("missing-family-alignment")

    for family in families:
        if not family.get("family_id"):
            problems.append("family-missing-id")
            continue
        targets = family.get("targets", [])
        if not targets:
            problems.append(f"family-no-targets:{family['family_id']}")
            continue
        for target in targets:
            theme_id = target.get("ux_theme_id")
            if theme_id not in theme_map:
                problems.append(f"unknown-theme:{family['family_id']}:{theme_id}")
                continue
            for subtheme_id in target.get("ux_subtheme_ids", []):
                if subtheme_id not in theme_map[theme_id]:
                    problems.append(f"unknown-subtheme:{family['family_id']}:{theme_id}:{subtheme_id}")

    gov_alignment = governance.get("ux_catalog_alignment", {})
    if gov_alignment.get("catalog_reference") != "docs/02-architecture/context/ux-katalogu.reference.v1.json":
        problems.append("governance-catalog-reference-mismatch")
    if gov_alignment.get("ui_alignment_reference") != "docs/02-architecture/context/ui-library-ux-alignment.v1.json":
        problems.append("governance-alignment-reference-mismatch")

    registry_ux = registry.get("ux_contract", {})
    if registry_ux.get("catalog_reference") != "docs/02-architecture/context/ux-katalogu.reference.v1.json":
        problems.append("registry-catalog-reference-mismatch")
    if registry_ux.get("alignment_reference") != "docs/02-architecture/context/ui-library-ux-alignment.v1.json":
        problems.append("registry-alignment-reference-mismatch")

    if "ux_catalog_alignment" not in registry.get("quality_gates", []):
        problems.append("missing-registry-quality-gate:ux_catalog_alignment")

    if problems:
        print("[check_ui_library_ux_alignment] FAIL")
        for item in problems:
            print(f"- {item}")
        return 1

    print(
        "[check_ui_library_ux_alignment] OK themes=%d families=%d"
        % (len(theme_map), len(families))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
