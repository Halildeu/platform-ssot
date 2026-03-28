#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, fail, load_json, ok


SCRIPT = "check_ui_library_governance_contract"


def main() -> int:
    required = [
        "docs/02-architecture/context/ui-library-governance.contract.v1.json",
        "web/packages/ui-kit/package.json",
        "web/packages/ui-kit/src/catalog/component-registry.v1.json",
        "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    governance = load_json("docs/02-architecture/context/ui-library-governance.contract.v1.json")
    registry = load_json("web/packages/ui-kit/src/catalog/component-registry.v1.json")
    problems: list[str] = []

    if governance.get("package_name") != "mfe-ui-kit":
        problems.append("invalid-package-name")
    if governance.get("preview_route") != "/admin/design-lab":
        problems.append("invalid-preview-route")
    if registry.get("preview_route") != governance.get("preview_route"):
        problems.append("preview-route-drift")

    required_scripts = set(governance.get("required_scripts", []))
    for script_name in ("designlab:index", "doctor:frontend", "gate:ui-library-wave"):
        if script_name not in required_scripts:
            problems.append(f"missing-governance-script:{script_name}")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, "preview_route=/admin/design-lab scripts=ok")


if __name__ == "__main__":
    raise SystemExit(main())
