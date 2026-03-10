#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, ensure_list, fail, load_json, ok


SCRIPT = "check_ui_library_component_roadmap"


def main() -> int:
    roadmap_path = "docs/02-architecture/context/ui-library-component-roadmap.v1.json"
    missing = ensure_exists(roadmap_path)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    roadmap = load_json(roadmap_path)
    problems: list[str] = []
    if len(ensure_list(roadmap.get("component_family_matrix"))) == 0:
        problems.append("empty-component-family-matrix")
    if len(ensure_list(roadmap.get("release_waves"))) == 0:
        problems.append("empty-release-waves")

    if problems:
        return fail(SCRIPT, problems)
    return ok(
        SCRIPT,
        "families=%d waves=%d"
        % (
            len(ensure_list(roadmap.get("component_family_matrix"))),
            len(ensure_list(roadmap.get("release_waves"))),
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
