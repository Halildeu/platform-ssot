#!/usr/bin/env python3
"""
ci-gate: always-run PR quality gate runner.

Amaç:
- PR'da değişen alanlara göre (docs/web/backend/workflows) seçici gate çalıştırmak.
- Tek bir PASS/FAIL sinyali üretmek (required check olarak kullanılabilir).

Kullanım:
  python3 scripts/ci_gate.py
  python3 scripts/ci_gate.py --emit-github-outputs
"""

from __future__ import annotations

import argparse
import json
import os
import shlex
import subprocess
import sys
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]
IS_GITHUB_ACTIONS = os.environ.get("GITHUB_ACTIONS") == "true"
CI_GATE_REPORT_PATH = ROOT / "artifacts" / "ci-gate-report.md"


def gha_escape_data(value: str) -> str:
    return value.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def gha_escape_property(value: str) -> str:
    return gha_escape_data(value).replace(":", "%3A").replace(",", "%2C")


def gha_group(title: str) -> None:
    if not IS_GITHUB_ACTIONS:
        return
    print(f"::group::{gha_escape_data(title)}")


def gha_endgroup() -> None:
    if not IS_GITHUB_ACTIONS:
        return
    print("::endgroup::")


def gha_error(title: str, message: str) -> None:
    if not IS_GITHUB_ACTIONS:
        return
    print(
        f"::error title={gha_escape_property(title)}::{gha_escape_data(message)}",
    )


def gha_notice(title: str, message: str) -> None:
    if not IS_GITHUB_ACTIONS:
        return
    print(
        f"::notice title={gha_escape_property(title)}::{gha_escape_data(message)}",
    )


def gha_add_mask(value: str) -> None:
    if not IS_GITHUB_ACTIONS:
        return
    print(f"::add-mask::{gha_escape_data(value)}")


@dataclass(frozen=True)
class ChangeFlags:
    docs_changed: bool
    web_changed: bool
    backend_changed: bool
    workflows_changed: bool
    meta_changed: bool


@dataclass(frozen=True)
class GateResult:
    name: str
    status: str  # PASS | FAIL | SKIP
    exit_code: int
    fail_cmd: Optional[str] = None


def run_cmd(argv: Sequence[str], *, gate: str, cwd: Optional[Path] = None) -> int:
    cmd = shlex.join(list(argv))
    print(f"[ci-gate] RUN: {cmd}")

    tail = deque(maxlen=200)

    try:
        proc = subprocess.Popen(
            list(argv),
            cwd=str(cwd) if cwd else None,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
    except FileNotFoundError:
        msg = f"[ci-gate] FAIL: gate={gate} (command not found): {cmd}"
        print(msg)
        gha_error(title=f"ci-gate {gate}", message=f"command not found: {cmd}")
        append_ci_gate_markdown(f"### ci-gate failure ({gate})\n\n{msg}\n")
        return 127

    assert proc.stdout is not None
    for line in proc.stdout:
        sys.stdout.write(line)
        sys.stdout.flush()
        tail.append(line.rstrip("\n"))

    proc.wait()
    code = int(proc.returncode or 0)

    if code != 0:
        tail_text = "\n".join(tail)
        header = f"[ci-gate] FAIL: gate={gate} code={code} cmd={cmd}"
        print(header)
        gha_error(title=f"ci-gate {gate}", message=f"exit_code={code}, cmd={cmd}")
        print("[ci-gate] last 200 lines:")
        if tail_text:
            print(tail_text)
        else:
            print("(no output)")

        append_ci_gate_markdown(
            "\n".join(
                [
                    f"### ci-gate failure ({gate})",
                    "",
                    f"- exit_code: `{code}`",
                    "",
                    "```",
                    cmd,
                    "```",
                    "",
                    "Last 200 lines:",
                    "```",
                    tail_text or "(no output)",
                    "```",
                    "",
                ]
            )
        )

    return code


def git_capture(argv: Sequence[str]) -> str:
    proc = subprocess.run(
        ["git", *argv],
        cwd=str(ROOT),
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return proc.stdout


def try_git_capture(argv: Sequence[str]) -> Tuple[bool, str]:
    proc = subprocess.run(
        ["git", *argv],
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return proc.returncode == 0, proc.stdout


def read_github_event() -> Optional[dict]:
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    if not event_path:
        return None
    path = Path(event_path)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def compute_changed_files(base_ref: str, head_ref: str) -> List[str]:
    # 1) GitHub PR event payload varsa base/head sha ile diff al (en deterministik yol).
    event = read_github_event()
    pr = (event or {}).get("pull_request")
    if isinstance(pr, dict):
        base_sha = ((pr.get("base") or {}) if isinstance(pr.get("base"), dict) else {}).get("sha")
        head_sha = ((pr.get("head") or {}) if isinstance(pr.get("head"), dict) else {}).get("sha")
        if isinstance(base_sha, str) and isinstance(head_sha, str):
            ok2, out2 = try_git_capture(["diff", "--name-only", f"{base_sha}..{head_sha}"])
            if ok2:
                return [l.strip() for l in out2.splitlines() if l.strip()]

    # 2) PR merge commit ise (2 parent), doğrudan parent diff (checkout merge ref için).
    ok, parents_line = try_git_capture(["rev-list", "--parents", "-n", "1", head_ref])
    if ok:
        parts = parents_line.strip().split()
        if len(parts) == 3:
            _, p1, p2 = parts
            out = git_capture(["diff", "--name-only", p1, p2])
            return [l.strip() for l in out.splitlines() if l.strip()]

    # 3) Local/fallback: merge-base diff (A...B)
    out = git_capture(["diff", "--name-only", f"{base_ref}...{head_ref}"])
    return [l.strip() for l in out.splitlines() if l.strip()]


def flags_from_paths(paths: Sequence[str]) -> ChangeFlags:
    def is_docs_path(p: str) -> bool:
        return (
            p.startswith("docs/")
            or p == "AGENTS.md"
            or p.startswith("AGENT-CODEX")
            or p == "NUMARALANDIRMA-STANDARDI.md"
        )

    def is_workflows_path(p: str) -> bool:
        return (
            p.startswith(".github/workflows/")
            or p == "scripts/ci_gate.py"
            or p.startswith("scripts/ci_gate.")
        )

    docs_changed = any(is_docs_path(p) for p in paths)
    web_changed = any(p.startswith("web/") for p in paths)
    backend_changed = any(p.startswith("backend/") for p in paths)
    workflows_changed = any(is_workflows_path(p) for p in paths)
    meta_changed = any(p in {".gitignore", ".editorconfig"} for p in paths)
    return ChangeFlags(
        docs_changed=docs_changed,
        web_changed=web_changed,
        backend_changed=backend_changed,
        workflows_changed=workflows_changed,
        meta_changed=meta_changed,
    )


def write_github_outputs(flags: ChangeFlags) -> None:
    out_path = os.environ.get("GITHUB_OUTPUT")
    if not out_path:
        return
    lines = [
        f"docs_changed={'true' if flags.docs_changed else 'false'}",
        f"web_changed={'true' if flags.web_changed else 'false'}",
        f"backend_changed={'true' if flags.backend_changed else 'false'}",
        f"workflows_changed={'true' if flags.workflows_changed else 'false'}",
        f"meta_changed={'true' if flags.meta_changed else 'false'}",
    ]
    Path(out_path).write_text("\n".join(lines) + "\n", encoding="utf-8")


def append_step_summary(text: str) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    with open(summary_path, "a", encoding="utf-8") as f:
        f.write(text)
        if not text.endswith("\n"):
            f.write("\n")


def reset_ci_gate_report() -> None:
    CI_GATE_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    CI_GATE_REPORT_PATH.write_text("", encoding="utf-8")


def append_ci_gate_report(text: str) -> None:
    CI_GATE_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CI_GATE_REPORT_PATH, "a", encoding="utf-8") as f:
        f.write(text)
        if not text.endswith("\n"):
            f.write("\n")


def append_ci_gate_markdown(text: str) -> None:
    append_step_summary(text)
    append_ci_gate_report(text)


def run_gate(name: str, commands: List[Tuple[List[str], Optional[Path]]]) -> GateResult:
    gha_group(f"{name} gate")
    try:
        for argv, cwd in commands:
            cmd = shlex.join(list(argv))
            code = run_cmd(argv, gate=name, cwd=cwd)
            if code != 0:
                return GateResult(name=name, status="FAIL", exit_code=code, fail_cmd=cmd)
        return GateResult(name=name, status="PASS", exit_code=0)
    finally:
        gha_endgroup()


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(prog="ci_gate.py")
    parser.add_argument("--base-ref", default="origin/main", help="Diff base ref (fallback).")
    parser.add_argument("--head-ref", default="HEAD", help="Diff head ref (fallback).")
    parser.add_argument(
        "--emit-github-outputs",
        action="store_true",
        help="Sadece change flag'lerini hesapla ve GITHUB_OUTPUT'a yaz (exit 0).",
    )
    args = parser.parse_args(argv[1:])

    reset_ci_gate_report()

    changed_files = compute_changed_files(base_ref=args.base_ref, head_ref=args.head_ref)
    flags = flags_from_paths(changed_files)

    print("[ci-gate] change flags:")
    print(f"- docs_changed={flags.docs_changed}")
    print(f"- web_changed={flags.web_changed}")
    print(f"- backend_changed={flags.backend_changed}")
    print(f"- workflows_changed={flags.workflows_changed}")
    print(f"- meta_changed={flags.meta_changed}")

    if args.emit_github_outputs:
        write_github_outputs(flags)
        append_ci_gate_report(
            "\n".join(
                [
                    "# ci-gate report",
                    "",
                    "_Mode: emit-github-outputs (flags only)_",
                    "",
                    "## Flags",
                    "",
                    "| Flag | Value |",
                    "| --- | --- |",
                    f"| docs_changed | `{flags.docs_changed}` |",
                    f"| web_changed | `{flags.web_changed}` |",
                    f"| backend_changed | `{flags.backend_changed}` |",
                    f"| workflows_changed | `{flags.workflows_changed}` |",
                    f"| meta_changed | `{flags.meta_changed}` |",
                    "",
                ]
            )
        )
        return 0

    results: List[GateResult] = []

    docs_gate_needed = flags.workflows_changed or flags.docs_changed
    layout_gate_needed = flags.workflows_changed or flags.backend_changed or flags.web_changed
    web_gate_needed = flags.workflows_changed or flags.web_changed or flags.meta_changed
    backend_gate_needed = flags.workflows_changed or flags.backend_changed

    if docs_gate_needed:
        results.append(
            run_gate(
                "docs",
                [
                    (["python3", "scripts/docflow_next.py", "render-flow", "--check"], ROOT),
                    (["python3", "scripts/check_doc_templates.py"], ROOT),
                    (["python3", "scripts/check_doc_ids.py"], ROOT),
                    (["python3", "scripts/check_unique_delivery_ids.py"], ROOT),
                    (["python3", "scripts/check_id_registry.py"], ROOT),
                    (["python3", "scripts/check_doc_locations.py"], ROOT),
                    (["python3", "scripts/check_acceptance_evidence.py"], ROOT),
                    (["python3", "scripts/check_story_links.py"], ROOT),
                    (["python3", "scripts/check_doc_chain.py"], ROOT),
                    (["python3", "scripts/check_governance_migration.py"], ROOT),
                    # v0.1: non-blocking rubric report (semantik skor yok; sadece proxy sinyaller).
                    (
                        [
                            "python3",
                            "scripts/check_doc_maturity_rubric.py",
                            "--flow-path",
                            "docs/03-delivery/PROJECT-FLOW.tsv",
                        ],
                        ROOT,
                    ),
                ],
            )
        )
    else:
        results.append(GateResult(name="docs", status="SKIP", exit_code=0))

    if layout_gate_needed:
        results.append(
            run_gate(
                "layout",
                [
                    (["python3", "scripts/check_backend_service_layout.py"], ROOT),
                    (["python3", "scripts/check_web_mfe_layout.py"], ROOT),
                ],
            )
        )
    else:
        results.append(GateResult(name="layout", status="SKIP", exit_code=0))

    if web_gate_needed:
        results.append(
            run_gate(
                "web",
                [
                    (["python3", "scripts/check_version_gates.py", "--mode", "ci"], ROOT),
                    (["npm", "-C", "web", "ci"], ROOT),
                    (["npm", "-C", "web", "run", "tokens:build", "--", "--check"], ROOT),
                    (["bash", "scripts/run_lint_web.sh"], ROOT),
                    (["bash", "scripts/run_tests_web.sh"], ROOT),
                ],
            )
        )
    else:
        results.append(GateResult(name="web", status="SKIP", exit_code=0))

    if backend_gate_needed:
        results.append(
            run_gate(
                "backend",
                [
                    (["./mvnw", "-DskipITs=true", "test"], ROOT / "backend"),
                ],
            )
        )
    else:
        results.append(GateResult(name="backend", status="SKIP", exit_code=0))

    # v0.1: non-blocking (noop + summary)
    results.append(GateResult(name="security", status="SKIP", exit_code=0))

    failed = [r for r in results if r.status == "FAIL"]
    overall = "PASS" if not failed else "FAIL"

    ran_gates = [r.name for r in results if r.status != "SKIP"]
    skipped_gates = [r.name for r in results if r.status == "SKIP"]
    failed_cmds = [r for r in results if r.status == "FAIL" and r.fail_cmd]

    summary_lines = [
        "# ci-gate summary",
        "",
        "## Overall",
        f"`{overall}`",
        "",
        "## Flags",
        "",
        "| Flag | Value |",
        "| --- | --- |",
        f"| docs_changed | `{flags.docs_changed}` |",
        f"| web_changed | `{flags.web_changed}` |",
        f"| backend_changed | `{flags.backend_changed}` |",
        f"| workflows_changed | `{flags.workflows_changed}` |",
        f"| meta_changed | `{flags.meta_changed}` |",
        "",
        "## Gates",
        "",
        "| Gate | Status |",
        "| --- | --- |",
    ]
    for r in results:
        summary_lines.append(f"| {r.name} | `{r.status}` |")

    summary_lines.extend(["", "## Ran gates", ""])
    if ran_gates:
        summary_lines.extend([f"- `{g}`" for g in ran_gates])
    else:
        summary_lines.append("- (none)")

    summary_lines.extend(["", "## Skipped gates", ""])
    if skipped_gates:
        summary_lines.extend([f"- `{g}`" for g in skipped_gates])
    else:
        summary_lines.append("- (none)")

    if failed_cmds:
        summary_lines.extend(["", "## Failing commands", ""])
        for r in failed_cmds:
            summary_lines.append(f"- `{r.name}`: exit `{r.exit_code}` → `{r.fail_cmd}`")

    append_ci_gate_markdown("\n".join(summary_lines) + "\n")

    print("\n[ci-gate] results:")
    for r in results:
        print(f"- {r.name}: {r.status}")
    print(f"\n[ci-gate] overall: {overall}")

    if failed:
        # İlk FAIL exit code'u ile çıkalım.
        return failed[0].exit_code or 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
