#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, ensure_list, fail, load_json, ok


SCRIPT = "check_ui_library_page_block_contract"


def main() -> int:
    required = [
        "docs/02-architecture/context/ui-library-recipe-system.contract.v1.json",
        "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    recipe_contract = load_json(required[0])
    index = load_json(required[1])
    contract_ids = {
        item.get("recipe_id")
        for item in ensure_list(recipe_contract.get("current_recipe_families"))
        if isinstance(item, dict)
    }
    index_ids = {
        item.get("recipeId")
        for item in ensure_list(index.get("recipes", {}).get("currentFamilies"))
        if isinstance(item, dict)
    }
    problems: list[str] = []
    if not contract_ids:
        problems.append("empty-recipe-contract")
    if contract_ids != index_ids:
        problems.append("recipe-id-drift")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, f"recipes={len(contract_ids)}")


if __name__ == "__main__":
    raise SystemExit(main())
