#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Optional, Set
from zoneinfo import ZoneInfo


TR_TZ = ZoneInfo("Europe/Istanbul")


def now_tr() -> datetime:
    return datetime.now(TR_TZ)


def format_ts(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds")


def format_ts_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="seconds")


def resolve_module_path(from_path: Path, module_path: str) -> Optional[Path]:
    if not module_path.startswith("."):
        return None

    candidate_base = (from_path.parent / module_path).resolve()
    candidates = [
        candidate_base.with_suffix(".ts"),
        candidate_base.with_suffix(".tsx"),
        candidate_base.with_suffix(".js"),
        candidate_base.with_suffix(".jsx"),
        candidate_base / "index.ts",
        candidate_base / "index.tsx",
        candidate_base / "index.js",
        candidate_base / "index.jsx",
    ]

    for candidate in candidates:
        if candidate.is_file():
            return candidate

    return None


EXPORT_VALUE_RE = re.compile(
    r"export\s+(?:const|function|class)\s+([A-Za-z_][A-Za-z0-9_]*)",
    flags=re.MULTILINE,
)
EXPORT_STAR_FROM_RE = re.compile(
    r"export\s+\*\s+from\s+['\"]([^'\"]+)['\"]",
    flags=re.MULTILINE,
)
EXPORT_NAMED_FROM_RE = re.compile(
    r"export\s+{([^}]+)}\s+from\s+['\"]([^'\"]+)['\"]",
    flags=re.MULTILINE | re.DOTALL,
)
EXPORT_NAMED_RE = re.compile(
    r"export\s+{([^}]+)}\s*;",
    flags=re.MULTILINE | re.DOTALL,
)


def parse_named_exports(spec: str) -> Set[str]:
    names: Set[str] = set()
    for raw_part in spec.split(","):
        part = raw_part.strip()
        if not part:
            continue
        if part.startswith("type "):
            continue
        if part.startswith("typeof "):
            continue
        part = re.sub(r"^(type|interface)\s+", "", part).strip()
        if not part:
            continue
        if " as " in part:
            original, alias = [segment.strip() for segment in part.split(" as ", 1)]
            if original:
                names.add(original)
            if alias:
                names.add(alias)
        else:
            names.add(part)
    return names


def collect_runtime_exports(entry_file: Path, visited: Set[Path]) -> Set[str]:
    if entry_file in visited:
        return set()
    visited.add(entry_file)

    try:
        content = entry_file.read_text(encoding="utf-8")
    except Exception:
        return set()

    exports: Set[str] = set(EXPORT_VALUE_RE.findall(content))

    for match in EXPORT_NAMED_FROM_RE.finditer(content):
        exports |= parse_named_exports(match.group(1))

    for match in EXPORT_NAMED_RE.finditer(content):
        exports |= parse_named_exports(match.group(1))

    for match in EXPORT_STAR_FROM_RE.finditer(content):
        target = resolve_module_path(entry_file, match.group(1))
        if target is None:
            continue
        exports |= collect_runtime_exports(target, visited)

    return exports


IMPORT_FROM_UI_KIT_RE = re.compile(
    r"import\s+(?:type\s+)?{([^}]+)}\s+from\s+['\"]mfe-ui-kit['\"]",
    flags=re.MULTILINE | re.DOTALL,
)


def collect_ui_kit_import_usage(
    web_root: Path, exported_names: Set[str]
) -> dict[str, Set[str]]:
    apps_root = web_root / "apps"
    usage: dict[str, Set[str]] = {}

    for file_path in apps_root.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        if any(part in {"node_modules", "dist", "build"} for part in file_path.parts):
            continue

        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for match in IMPORT_FROM_UI_KIT_RE.finditer(content):
            spec = match.group(1)
            for raw_part in spec.split(","):
                part = raw_part.strip()
                if not part:
                    continue
                part = part.split("//", 1)[0].strip()
                if part.startswith("type "):
                    part = part[len("type ") :].strip()
                if not part:
                    continue

                if " as " in part:
                    name, _alias = [segment.strip() for segment in part.split(" as ", 1)]
                else:
                    name = part

                if name not in exported_names:
                    continue

                relative_to_repo = file_path.relative_to(web_root.parent).as_posix()
                usage.setdefault(name, set()).add(relative_to_repo)

    return usage


@dataclass(frozen=True)
class DesignLabIndexEntry:
    name: str
    import_snippet: str
    files: list[str]


def build_design_lab_index(web_root: Path) -> dict:
    ui_kit_index = web_root / "packages" / "ui-kit" / "src" / "index.ts"
    if not ui_kit_index.is_file():
        raise SystemExit(f"[designlab:index] ui-kit index not found: {ui_kit_index}")

    content = ui_kit_index.read_text(encoding="utf-8")
    export_targets = [
        match.group(1)
        for match in EXPORT_STAR_FROM_RE.finditer(content)
        if match.group(1).startswith(".")
    ]

    exported_names: Set[str] = set()
    for module_path in export_targets:
        module_file = resolve_module_path(ui_kit_index, module_path)
        if module_file is None:
            continue
        exported_names |= collect_runtime_exports(module_file, visited=set())

    usage = collect_ui_kit_import_usage(web_root=web_root, exported_names=exported_names)

    entries: list[DesignLabIndexEntry] = []
    for name in sorted(exported_names):
        import_snippet = f"import {{ {name} }} from 'mfe-ui-kit';"
        files = sorted(usage.get(name, set()))
        entries.append(DesignLabIndexEntry(name=name, import_snippet=import_snippet, files=files))

    timestamp_tr = now_tr()
    return {
        "generatedAt": format_ts(timestamp_tr),
        "generatedAtUtc": format_ts_utc(timestamp_tr),
        "components": [
            {"name": entry.name, "import": entry.import_snippet, "files": entry.files}
            for entry in entries
        ],
    }


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Build Design Lab usage index (MVP).")
    parser.add_argument(
        "--output",
        default="apps/mfe-shell/src/pages/admin/design-lab.index.json",
        help="Output JSON path, relative to web/.",
    )
    args = parser.parse_args(argv)

    script_path = Path(__file__).resolve()
    web_root = script_path.parents[1]
    output_path = (web_root / args.output).resolve()

    index = build_design_lab_index(web_root)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[designlab:index] wrote: {output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] components: {len(index.get('components', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

