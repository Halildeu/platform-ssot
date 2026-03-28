#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, ensure_list, fail, load_json, ok


SCRIPT = "check_ui_library_ux_alignment"


def main() -> int:
    required = [
        "docs/02-architecture/context/ux-katalogu.reference.v1.json",
        "docs/02-architecture/context/ui-library-ux-alignment.v1.json",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    reference = load_json("docs/02-architecture/context/ux-katalogu.reference.v1.json")
    alignment = load_json("docs/02-architecture/context/ui-library-ux-alignment.v1.json")
    themes = {item.get("theme_id") for item in ensure_list(reference.get("themes")) if isinstance(item, dict)}
    problems: list[str] = []

    for item in ensure_list(alignment.get("family_alignment")):
        if not isinstance(item, dict):
            problems.append("invalid-family-alignment-entry")
            continue
        if item.get("ux_theme_id") not in themes:
            problems.append(f"unknown-theme:{item.get('family_id')}")

    for artifact in ensure_list(alignment.get("artifacts")):
        if isinstance(artifact, str) and ensure_exists(artifact):
            problems.append(f"missing-artifact:{artifact}")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, f"families={len(ensure_list(alignment.get('family_alignment')))}")


if __name__ == "__main__":
    raise SystemExit(main())
