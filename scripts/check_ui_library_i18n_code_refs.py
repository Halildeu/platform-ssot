#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from ui_library_checks import fail, ok, path_in_repo


SCRIPT = "check_ui_library_i18n_code_refs"
ARTIFACT_PATH = path_in_repo("web/test-results/releases/ui-library/latest/ui-library-i18n-code-refs.v1.json")
DICTIONARY_PATH = path_in_repo("web/packages/i18n-dicts/src/locales/en/designlab.ts")
TARGET_ROOT = path_in_repo("web/apps/mfe-shell/src/pages/admin/design-lab")
TARGET_FILES = (
    path_in_repo("web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"),
    path_in_repo("web/apps/mfe-shell/src/pages/admin/design-lab/useDesignLabI18n.ts"),
)
EXCLUDED_SUFFIXES = (
    ".test.ts",
    ".test.tsx",
    ".stories.ts",
    ".stories.tsx",
)
KEY_DEF_PATTERN = re.compile(r"""['"](designlab\.[^'"]+)['"]\s*:""")
KEY_REF_PATTERN = re.compile(r"""\bt\s*\(\s*['"](designlab\.[^'"]+)['"]""")


def iter_target_files() -> list[Path]:
    paths: list[Path] = []
    if TARGET_ROOT.is_dir():
        for path in TARGET_ROOT.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix not in {".ts", ".tsx"}:
                continue
            if path.name.endswith(EXCLUDED_SUFFIXES):
                continue
            paths.append(path)
    for path in TARGET_FILES:
        if path.is_file():
            paths.append(path)
    return sorted(set(paths))


def load_defined_keys() -> set[str]:
    text = DICTIONARY_PATH.read_text(encoding="utf-8")
    return set(KEY_DEF_PATTERN.findall(text))


def find_referenced_keys(paths: list[Path]) -> tuple[set[str], dict[str, list[str]]]:
    referenced: set[str] = set()
    references: dict[str, list[str]] = {}
    for path in paths:
        relative_path = path.relative_to(path_in_repo(""))
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            for key in KEY_REF_PATTERN.findall(line):
                referenced.add(key)
                references.setdefault(key, []).append(f"{relative_path}:{lineno}")
    return referenced, references


def write_artifact(payload: dict) -> None:
    ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT_PATH.write_text(f"{json.dumps(payload, ensure_ascii=False, indent=2)}\n", encoding="utf-8")


def main() -> int:
    target_files = iter_target_files()
    defined_keys = load_defined_keys()
    referenced_keys, references = find_referenced_keys(target_files)
    missing_keys = sorted(referenced_keys - defined_keys)

    payload = {
        "version": "1.0",
        "overall_status": "REPORT_ONLY" if missing_keys else "PASS",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "scannedFileCount": len(target_files),
            "referencedKeyCount": len(referenced_keys),
            "definedKeyCount": len(defined_keys),
            "blockingMissingKeyCount": 0,
            "reportOnlyMissingKeyCount": len(missing_keys),
        },
        "missingKeys": [
            {
                "key": key,
                "references": references.get(key, []),
            }
            for key in missing_keys
        ],
    }
    write_artifact(payload)

    return ok(
        SCRIPT,
        "scanned=%d referenced=%d blocking=0 report_only=%d artifact=%s"
        % (
            payload["summary"]["scannedFileCount"],
            payload["summary"]["referencedKeyCount"],
            payload["summary"]["reportOnlyMissingKeyCount"],
            ARTIFACT_PATH.relative_to(path_in_repo("")),
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
