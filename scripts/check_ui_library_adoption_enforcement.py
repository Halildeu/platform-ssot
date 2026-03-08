#!/usr/bin/env python3
from __future__ import annotations

import json
from fnmatch import fnmatch
from pathlib import Path

ROOT = Path(".")
CONTRACT_PATH = ROOT / "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json"
APPS_ROOT = ROOT / "web" / "apps"

SCANNED_SUFFIXES = {".ts", ".tsx", ".js", ".jsx"}
SKIP_DIRS = {"node_modules", "dist", "build", "coverage", "test-results", ".git"}
FORBIDDEN_DIR_MARKERS = {
    "components/ui",
    "components/primitives",
    "shared/ui",
    "shared/primitives",
}
PRIMITIVE_FILE_NAMES = {
    "Button",
    "Input",
    "TextInput",
    "TextArea",
    "Modal",
    "Card",
    "Badge",
    "Tooltip",
    "Drawer",
    "Checkbox",
    "Radio",
    "Switch",
    "Table",
    "List",
    "Tabs",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def is_allowed(rel_path: str, patterns: list[str]) -> bool:
    return any(fnmatch(rel_path, pattern) for pattern in patterns)


def main() -> int:
    if not CONTRACT_PATH.exists():
        print("[check_ui_library_adoption_enforcement] FAIL")
        print(f"- missing-contract:{CONTRACT_PATH}")
        return 1

    contract = load_json(CONTRACT_PATH)
    problems: list[str] = []

    if contract.get("ui_kit_first_rule") is not True:
        problems.append("invalid-ui-kit-first-rule")

    allowed_patterns = [str(value) for value in contract.get("allowed_exception_paths", []) if str(value).strip()]

    if not APPS_ROOT.exists():
        problems.append("missing-apps-root")
    else:
        for path in APPS_ROOT.rglob("*"):
            if not path.is_file():
                continue
            if any(part in SKIP_DIRS for part in path.parts):
                continue
            if path.suffix not in SCANNED_SUFFIXES:
                continue

            rel_path = path.relative_to(ROOT).as_posix()
            if is_allowed(rel_path, allowed_patterns):
                continue
            if rel_path.endswith((".test.tsx", ".spec.tsx", ".stories.tsx", ".stories.ts")):
                continue

            normalized_rel = rel_path.replace("\\", "/")
            for marker in FORBIDDEN_DIR_MARKERS:
                if f"/{marker}/" in f"/{normalized_rel}/":
                    problems.append(f"forbidden-ui-folder:{rel_path}")
                    break
            else:
                if normalized_rel.endswith((".ui.tsx", ".ui.ts", ".ui.jsx", ".ui.js")):
                    continue
                if normalized_rel.startswith("web/apps/mfe-shell/src/app/theme/components/"):
                    continue

                base_name = path.name
                stem = path.stem.split(".", 1)[0]
                if stem in PRIMITIVE_FILE_NAMES:
                    problems.append(f"local-primitive-file:{rel_path}")
                elif base_name in {"index.ts", "index.tsx", "index.js", "index.jsx"} and any(
                    marker in normalized_rel for marker in ("components/ui", "components/primitives", "shared/ui", "shared/primitives")
                ):
                    problems.append(f"local-primitive-index:{rel_path}")

            if len(problems) >= 40:
                break

    if problems:
        print("[check_ui_library_adoption_enforcement] FAIL")
        for problem in problems[:30]:
            print(f"- {problem}")
        if len(problems) > 30:
            print(f"- ... (+{len(problems) - 30})")
        return 1

    print("[check_ui_library_adoption_enforcement] OK scope=web/apps mode=fail-closed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
