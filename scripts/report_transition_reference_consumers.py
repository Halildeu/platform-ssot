#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


PATTERNS = {
    "AGENT-CODEX": "AGENT-CODEX",
    "docs/00-handbook": "docs/00-handbook/",
    "backend/docs/legacy": "backend/docs/legacy/",
}
EXCLUDED_PREFIXES = ("backend/docs/legacy/", "docs/ARCHIVE/", ".cache/")
EXCLUDED_PATHS = {
    "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
    "scripts/check_transition_authority_map.py",
    "scripts/report_transition_reference_consumers.py",
}


def _now_iso_utc() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--out-json")
    parser.add_argument("--out-md")
    return parser.parse_args()


def _scan_with_rg(repo_root: Path, pattern: str) -> list[tuple[str, int]]:
    proc = subprocess.run(
        ["rg", "-n", "--no-heading", pattern, str(repo_root)],
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode not in (0, 1):
        raise RuntimeError(proc.stderr.strip() or f"rg failed for pattern: {pattern}")
    matches: list[tuple[str, int]] = []
    for line in proc.stdout.splitlines():
        try:
            file_path, line_no, _rest = line.split(":", 2)
        except ValueError:
            continue
        rel = Path(file_path).relative_to(repo_root).as_posix()
        if rel.startswith(EXCLUDED_PREFIXES):
            continue
        if rel in EXCLUDED_PATHS:
            continue
        matches.append((rel, int(line_no)))
    return matches


def _scan_without_rg(repo_root: Path, needle: str) -> list[tuple[str, int]]:
    matches: list[tuple[str, int]] = []
    for path in repo_root.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(repo_root).as_posix()
        if rel.startswith(EXCLUDED_PREFIXES):
            continue
        if rel in EXCLUDED_PATHS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for idx, line in enumerate(text.splitlines(), start=1):
            if needle in line:
                matches.append((rel, idx))
    return matches


def _scan(repo_root: Path, needle: str) -> list[tuple[str, int]]:
    if shutil.which("rg"):
        return _scan_with_rg(repo_root, needle)
    return _scan_without_rg(repo_root, needle)


def _build_report(repo_root: Path) -> dict[str, object]:
    consumers: dict[str, dict[str, object]] = defaultdict(
        lambda: {"path": "", "pattern_hit_counts": defaultdict(int), "line_hits": defaultdict(list)}
    )

    for label, needle in PATTERNS.items():
        for rel, line_no in _scan(repo_root, needle):
            entry = consumers[rel]
            entry["path"] = rel
            entry["pattern_hit_counts"][label] += 1
            entry["line_hits"][label].append(line_no)

    consumer_rows: list[dict[str, object]] = []
    for rel, entry in consumers.items():
        pattern_hit_counts = dict(sorted(entry["pattern_hit_counts"].items()))
        line_hits = {key: sorted(value) for key, value in sorted(entry["line_hits"].items())}
        consumer_rows.append(
            {
                "path": rel,
                "patterns": sorted(pattern_hit_counts),
                "hit_count": sum(pattern_hit_counts.values()),
                "pattern_hit_counts": pattern_hit_counts,
                "line_hits": line_hits,
            }
        )

    consumer_rows.sort(key=lambda item: (-int(item["hit_count"]), str(item["path"])))

    return {
        "version": "v1",
        "generated_at": _now_iso_utc(),
        "repo_root": repo_root.as_posix(),
        "excluded_prefixes": list(EXCLUDED_PREFIXES),
        "excluded_paths": sorted(EXCLUDED_PATHS),
        "patterns": PATTERNS,
        "consumer_file_count": len(consumer_rows),
        "total_hits": sum(int(item["hit_count"]) for item in consumer_rows),
        "consumers": consumer_rows,
        "top_consumers": consumer_rows[:25],
    }


def _write_outputs(report: dict[str, object], out_json: Path | None, out_md: Path | None) -> None:
    if out_json:
        out_json.parent.mkdir(parents=True, exist_ok=True)
        out_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if out_md:
        out_md.parent.mkdir(parents=True, exist_ok=True)
        lines = [
            "# Transition Reference Consumers",
            "",
            f"- Generated at: {report['generated_at']}",
            f"- Consumer file count: {report['consumer_file_count']}",
            f"- Total hits: {report['total_hits']}",
            "",
            "## Patterns",
            "",
        ]
        for label, needle in PATTERNS.items():
            lines.append(f"- `{label}` -> `{needle}`")
        lines.extend(["", "## Top Consumers", ""])
        for item in report["top_consumers"]:
            hit_count = item["hit_count"]
            path = item["path"]
            patterns = ", ".join(item["patterns"])
            lines.append(f"- `{path}` -> {hit_count} isabet ({patterns})")
        out_md.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    args = _parse_args()
    repo_root = Path(args.repo_root).expanduser().resolve()
    report = _build_report(repo_root)
    out_json = Path(args.out_json).expanduser() if args.out_json else None
    out_md = Path(args.out_md).expanduser() if args.out_md else None
    _write_outputs(report, out_json, out_md)
    print(
        json.dumps(
            {
                "status": "OK",
                "consumer_file_count": report["consumer_file_count"],
                "total_hits": report["total_hits"],
                "out_json": out_json.as_posix() if out_json else "",
                "out_md": out_md.as_posix() if out_md else "",
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
