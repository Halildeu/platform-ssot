#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from ui_library_checks import fail, ok, path_in_repo


SCRIPT = "check_ui_library_i18n_surface"
TURKISH_CHAR_PATTERN = re.compile(r"[ÇĞİÖŞÜçğıöşü]")
BLOCK_COMMENT_PATTERN = re.compile(r"/\*.*?\*/", re.DOTALL)
ARTIFACT_PATH = path_in_repo("web/test-results/releases/ui-library/latest/ui-library-i18n-surface.v1.json")
BLOCKING_TARGET_ROOTS = (
    "web/packages/ui-kit/src/components",
    "web/apps/mfe-shell/src/pages/admin/design-lab",
)
BLOCKING_TARGET_FILES = (
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
)
REPORT_ONLY_TARGET_ROOTS = (
    "web/apps/mfe-shell/src/app",
    "web/apps/mfe-shell/src/pages/admin",
)
REPORT_ONLY_EXCLUDED_PREFIXES = (
    "web/apps/mfe-shell/src/pages/admin/design-lab",
)
EXCLUDED_SUFFIXES = (
    ".test.ts",
    ".test.tsx",
    ".stories.ts",
    ".stories.tsx",
    ".doc.ts",
)
IGNORED_SUBSTRINGS = (
    "console.error(",
    "console.warn(",
    "console.info(",
    "console.debug(",
    "toLocaleLowerCase('tr-TR')",
    'toLocaleLowerCase("tr-TR")',
    ".replace(/ç/g, 'c')",
    '.replace(/ç/g, "c")',
    ".replace(/ğ/g, 'g')",
    '.replace(/ğ/g, "g")',
    ".replace(/ı/g, 'i')",
    '.replace(/ı/g, "i")',
    ".replace(/ö/g, 'o')",
    '.replace(/ö/g, "o")',
    ".replace(/ş/g, 's')",
    '.replace(/ş/g, "s")',
    ".replace(/ü/g, 'u')",
    '.replace(/ü/g, "u")',
    "Intl.Locale('tr'",
    'Intl.Locale("tr"',
)


def iter_target_files(
    roots: Iterable[str],
    *,
    include_files: Iterable[str] = (),
    excluded_prefixes: Iterable[str] = (),
) -> list[Path]:
    paths: list[Path] = []
    excluded_resolved = [path_in_repo(prefix) for prefix in excluded_prefixes]
    for root in roots:
        absolute_root = path_in_repo(root)
        if not absolute_root.is_dir():
            continue
        for path in absolute_root.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix not in {".ts", ".tsx"}:
                continue
            if path.name.endswith(EXCLUDED_SUFFIXES):
                continue
            if any(path.is_relative_to(prefix) for prefix in excluded_resolved if prefix.exists()):
                continue
            paths.append(path)
    for target in include_files:
        absolute_target = path_in_repo(target)
        if absolute_target.is_file():
            paths.append(absolute_target)
    return sorted(set(paths))


def strip_block_comments(text: str) -> str:
    return BLOCK_COMMENT_PATTERN.sub(lambda match: "\n" * match.group(0).count("\n"), text)


def scan_files(paths: list[Path]) -> list[str]:
    findings: list[str] = []
    for path in paths:
        relative_path = path.relative_to(path_in_repo(""))
        text = strip_block_comments(path.read_text(encoding="utf-8"))
        for lineno, line in enumerate(text.splitlines(), start=1):
            if not TURKISH_CHAR_PATTERN.search(line):
                continue
            stripped = line.strip()
            if not stripped:
                continue
            if stripped.startswith("//"):
                continue
            if any(fragment in line for fragment in IGNORED_SUBSTRINGS):
                continue
            findings.append(f"{relative_path}:{lineno}:{stripped}")
    return findings


def write_artifact(payload: dict) -> None:
    ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT_PATH.write_text(f"{json.dumps(payload, ensure_ascii=False, indent=2)}\n", encoding="utf-8")


def main() -> int:
    blocking_files = iter_target_files(BLOCKING_TARGET_ROOTS, include_files=BLOCKING_TARGET_FILES)
    report_only_files = iter_target_files(
        REPORT_ONLY_TARGET_ROOTS,
        excluded_prefixes=REPORT_ONLY_EXCLUDED_PREFIXES,
    )
    blocking_findings = scan_files(blocking_files)
    report_only_findings = scan_files(report_only_files)
    payload = {
        "version": "1.0",
        "overall_status": "FAIL" if blocking_findings else "PASS",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "summary": {
          "blockingFileCount": len(blocking_files),
          "reportOnlyFileCount": len(report_only_files),
          "totalScannedFiles": len(blocking_files) + len(report_only_files),
          "blockingFindingCount": len(blocking_findings),
          "reportOnlyFindingCount": len(report_only_findings),
        },
        "blockingFindings": blocking_findings,
        "reportOnlyFindings": report_only_findings[:200],
    }
    write_artifact(payload)

    if blocking_findings:
        return fail(
            SCRIPT,
            blocking_findings[:30] + ([f"... toplam {len(blocking_findings)} blocking bulgu"] if len(blocking_findings) > 30 else []),
        )

    return ok(
        SCRIPT,
        "scanned=%d blocking=0 report_only=%d artifact=%s"
        % (
            payload["summary"]["totalScannedFiles"],
            payload["summary"]["reportOnlyFindingCount"],
            ARTIFACT_PATH.relative_to(path_in_repo("")),
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
