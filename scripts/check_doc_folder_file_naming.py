#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/nonprefix-naming-policy.v1.json")
SSOT_PATH = Path("docs-ssot/00-handbook/DOC-NONPREFIX-NAMING-SSOT.json")


def read_json(p: Path) -> dict:
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    if not POLICY_PATH.exists() or not SSOT_PATH.exists():
        print("[check_doc_folder_file_naming] FAIL: missing policy/ssot")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    ssot = read_json(SSOT_PATH)

    violations = []

    # Topic folder naming + parity (BM vs BENCH)
    topic_cfg = (ssot.get("topic_folders") or {}).get("rules") or {}
    canonical_case = str(topic_cfg.get("canonical_case", "UPPER"))
    pattern = str(topic_cfg.get("pattern", r"^[A-Z0-9_]+$"))
    require_parity = bool(topic_cfg.get("require_bm_bench_parity", False))
    topic_re = re.compile(pattern)

    bm_root = Path("docs/01-product/BUSINESS-MASTERS")
    bench_root = Path("docs/01-product/BENCHMARKS")

    bm_topics = [p.name for p in bm_root.iterdir() if p.is_dir()] if bm_root.exists() else []
    bench_topics = [p.name for p in bench_root.iterdir() if p.is_dir()] if bench_root.exists() else []

    def bad_topic(name: str) -> bool:
        if canonical_case == "UPPER" and name != name.upper():
            return True
        if not topic_re.match(name):
            return True
        return False

    for t in bm_topics:
        if bad_topic(t):
            violations.append(
                f"[TOPIC_NAME] BM topic invalid: {bm_root}/{t} (expected {canonical_case} + {pattern})"
            )
    for t in bench_topics:
        if bad_topic(t):
            violations.append(
                f"[TOPIC_NAME] BENCH topic invalid: {bench_root}/{t} (expected {canonical_case} + {pattern})"
            )

    if require_parity:
        bm_set = set(bm_topics)
        bench_set = set(bench_topics)
        only_bm = sorted(list(bm_set - bench_set))
        only_bench = sorted(list(bench_set - bm_set))
        if only_bm:
            violations.append(f"[TOPIC_PARITY] Topics in BM but missing in BENCH: {only_bm}")
        if only_bench:
            violations.append(f"[TOPIC_PARITY] Topics in BENCH but missing in BM: {only_bench}")

    # Nonprefix allowlist checks (file names in given dirs must match regex)
    for rule in ssot.get("nonprefix_allowlist", []):
        dir_path = Path(rule.get("dir", ""))
        file_regex = rule.get("file_regex")
        recursive = bool(rule.get("recursive", True))

        if not dir_path or not file_regex:
            continue
        if not dir_path.exists():
            continue

        rx = re.compile(str(file_regex))
        files = dir_path.rglob("*.md") if recursive else dir_path.glob("*.md")
        for f in sorted([p for p in files if p.is_file()]):
            if not rx.match(f.name):
                violations.append(
                    f"[NONPREFIX_NAME] {f} violates regex {file_regex} (dir={rule.get('dir')})"
                )

    # Local-only report
    out_dir = Path(".autopilot-tmp/flow-mining")
    out_dir.mkdir(parents=True, exist_ok=True)
    report_path = out_dir / "nonprefix-naming-report.md"
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    report_lines = []
    report_lines.append("# Nonprefix Naming Report (local-only)")
    report_lines.append("")
    report_lines.append(f"- ts_utc: {ts}")
    report_lines.append(f"- enabled: {enabled}")
    report_lines.append(f"- violations: {len(violations)}")
    report_lines.append("")

    report_lines.append("## Violations")
    if violations:
        for v in violations[:200]:
            report_lines.append(f"- {v}")
        if len(violations) > 200:
            report_lines.append(f"- ... ({len(violations) - 200} more)")
    else:
        report_lines.append("- none")

    report_path.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(f"[check_doc_folder_file_naming] report={report_path} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
