#!/usr/bin/env python3
"""
Local merge conflict resolver (v0.1)

Amaç:
- Local SSOT akışında, `origin/main` ile bir PR branch'i arasındaki "dirty" merge conflict durumunu
  deterministik kurallarla çözmeye çalışmak.

Girdi:
- `--repo owner/repo --pr <N>`  (PR'dan head branch okunur)
- veya `--branch <name>`        (doğrudan branch)

Guardrails:
- Yalnız belirli conflict path'lerinde otomatik çözüm:
  - docs/**, scripts/**, docs/03-delivery/PROJECT-FLOW.*        -> ours
  - .github/workflows/**                                        -> theirs
  - .gitignore                                                  -> union (ours + theirs, uniq)
- Allowlist dışı conflict varsa STOP (exit 3)
- Max conflict file: 25 (exit 3)

Çıktı:
- `origin/<branch>` üzerine merge commit push eder.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]

EXIT_OK = 0
EXIT_CONFIG = 2
EXIT_GUARDRAIL = 3
EXIT_GIT = 4


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def run(
    cmd: Sequence[str],
    *,
    check: bool = False,
    capture: bool = False,
    cwd: Path = ROOT,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        list(cmd),
        cwd=str(cwd),
        text=True,
        check=check,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def require_clean_worktree() -> None:
    proc = run(["git", "status", "--porcelain=v1"], capture=True)
    if (proc.stdout or "").strip():
        raise SystemExit("HATA: Working tree temiz değil. Önce local değişiklikleri commit/stash edin.")


def parse_origin_repo() -> Optional[str]:
    proc = run(["git", "remote", "get-url", "origin"], capture=True)
    if proc.returncode != 0:
        return None
    url = (proc.stdout or "").strip()
    if not url:
        return None
    m = re.search(r"github\\.com[:/](.+?)/(.+?)(?:\\.git)?$", url)
    if not m:
        return None
    return f"{m.group(1)}/{m.group(2)}"


def resolve_repo(explicit_repo: Optional[str]) -> str:
    if explicit_repo and "/" in explicit_repo:
        return explicit_repo.strip()
    env_repo = os.environ.get("GITHUB_REPOSITORY")
    if env_repo and "/" in env_repo:
        return env_repo.strip()
    origin_repo = parse_origin_repo()
    if origin_repo:
        return origin_repo
    raise SystemExit("HATA: --repo verilmeli (örn: owner/repo) veya origin remote github.com olmalı.")


def require_gh() -> None:
    if run(["bash", "-lc", "command -v gh >/dev/null 2>&1"]).returncode != 0:
        raise SystemExit("HATA: gh CLI bulunamadı.")


def gh_api_json(endpoint: str) -> dict:
    require_gh()
    proc = run(["gh", "api", endpoint], capture=True)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "").strip() or f"gh api failed: {endpoint}")
    out = (proc.stdout or "").strip()
    data = json.loads(out) if out else {}
    if not isinstance(data, dict):
        raise RuntimeError(f"gh api response dict değil: {endpoint}")
    return data


def pr_head_branch(repo: str, pr_number: int) -> str:
    pr = gh_api_json(f"repos/{repo}/pulls/{pr_number}")
    head = pr.get("head") or {}
    if not isinstance(head, dict):
        raise RuntimeError("PR head shape beklenmedik.")
    ref = head.get("ref")
    if not isinstance(ref, str) or not ref.strip():
        raise RuntimeError("PR head.ref okunamadı.")
    return ref.strip()


def fetch_origin_refs(branch: str) -> None:
    # main + branch fetch (branch yoksa da git fetch başarısız olabilir; guardrail olarak bırakıyoruz).
    run(["git", "fetch", "--prune", "origin", "main"], check=True)
    run(["git", "fetch", "--prune", "origin", branch], check=True)


def checkout_branch(branch: str) -> None:
    if run(["git", "show-ref", "--verify", "--quiet", f"refs/heads/{branch}"]).returncode == 0:
        run(["git", "checkout", branch], check=True)
        return
    run(["git", "checkout", "-b", branch, f"origin/{branch}"], check=True)


def conflict_files() -> List[str]:
    proc = run(["git", "diff", "--name-only", "--diff-filter=U"], capture=True)
    files = [x.strip() for x in (proc.stdout or "").splitlines() if x.strip()]
    files.sort()
    return files


def is_allowed_conflict_path(path: str) -> bool:
    if path == ".gitignore":
        return True
    if path.startswith("docs/"):
        return True
    if path.startswith("scripts/"):
        return True
    if path.startswith(".github/workflows/"):
        return True
    return False


def resolve_gitignore_union() -> None:
    ours_p = run(["git", "show", ":2:.gitignore"], capture=True)
    theirs_p = run(["git", "show", ":3:.gitignore"], capture=True)
    ours = (ours_p.stdout or "").splitlines()
    theirs = (theirs_p.stdout or "").splitlines()

    seen = set()
    merged: List[str] = []
    for line in list(ours) + list(theirs):
        if line in seen:
            continue
        seen.add(line)
        merged.append(line)

    (ROOT / ".gitignore").write_text("\n".join(merged).rstrip() + "\n", encoding="utf-8")
    run(["git", "add", ".gitignore"], check=True)


def resolve_conflicts(files: Iterable[str]) -> None:
    for f in files:
        if f == ".gitignore":
            resolve_gitignore_union()
            continue
        if f.startswith(".github/workflows/"):
            run(["git", "checkout", "--theirs", "--", f], check=True)
            run(["git", "add", "--", f], check=True)
            continue
        if f.startswith("docs/") or f.startswith("scripts/"):
            run(["git", "checkout", "--ours", "--", f], check=True)
            run(["git", "add", "--", f], check=True)
            continue
        # Buraya düşmemeli (guardrail)
        raise RuntimeError(f"Allowlist dışı conflict dosyası: {f}")


def abort_merge_best_effort() -> None:
    run(["git", "merge", "--abort"], capture=True)


def merge_main_into_branch() -> Tuple[bool, str]:
    """
    Dönüş:
      (ok, msg)
    """
    proc = run(["git", "merge", "--no-ff", "--no-edit", "origin/main"], capture=True)
    if proc.returncode == 0:
        return True, "merge-ok"
    # Conflict olabilir.
    if conflict_files():
        return False, "merge-conflict"
    # Başka bir git hata durumu.
    err = (proc.stderr or proc.stdout or "").strip()
    return False, f"merge-failed: {err}"


def push_branch(branch: str) -> None:
    run(["git", "push", "origin", branch], check=True)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="resolve_merge_conflicts.py")
    ap.add_argument("--repo", default=None, help="owner/repo (default: origin remote)")
    ap.add_argument("--pr", type=int, default=None, help="PR number (reads head branch via GitHub API)")
    ap.add_argument("--branch", default=None, help="Target branch name (overrides --pr)")
    ap.add_argument("--max-conflicts", type=int, default=25, help="Max conflict file count before STOP")
    ap.add_argument(
        "--commit-message",
        default="chore: auto-resolve conflicts with main",
        help="Merge commit message (conflict case)",
    )
    return ap.parse_args(list(argv))


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)

    require_clean_worktree()
    repo = resolve_repo(args.repo)

    branch = (args.branch or "").strip()
    if not branch:
        if not args.pr:
            eprint("HATA: --branch veya --pr verilmeli.")
            return EXIT_CONFIG
        try:
            branch = pr_head_branch(repo, int(args.pr))
        except Exception as exc:
            eprint(f"HATA: PR head branch okunamadı: {exc}")
            return EXIT_CONFIG

    try:
        fetch_origin_refs(branch)
        checkout_branch(branch)
    except subprocess.CalledProcessError as exc:
        eprint(f"HATA: git fetch/checkout başarısız: {exc}")
        return EXIT_GIT

    ok, msg = merge_main_into_branch()
    if ok:
        # Conflict yok; merge commit zaten oluştu.
        try:
            push_branch(branch)
        except subprocess.CalledProcessError as exc:
            eprint(f"HATA: push başarısız: {exc}")
            return EXIT_GIT
        print(f"[resolve] ok: merged origin/main into {branch} (no conflicts) and pushed")
        return EXIT_OK

    if msg == "merge-conflict":
        files = conflict_files()
        if len(files) > int(args.max_conflicts):
            eprint(f"[resolve] STOP: conflict_count={len(files)} > max={args.max_conflicts}")
            abort_merge_best_effort()
            return EXIT_GUARDRAIL

        disallowed = [f for f in files if not is_allowed_conflict_path(f)]
        if disallowed:
            eprint("[resolve] STOP: allowlist dışı conflict dosyaları:")
            for f in disallowed:
                eprint(f"- {f}")
            abort_merge_best_effort()
            return EXIT_GUARDRAIL

        try:
            resolve_conflicts(files)
        except Exception as exc:
            eprint(f"[resolve] STOP: conflict resolve hatası: {exc}")
            abort_merge_best_effort()
            return EXIT_GUARDRAIL

        remaining = conflict_files()
        if remaining:
            eprint("[resolve] STOP: unresolved conflicts kaldı:")
            for f in remaining:
                eprint(f"- {f}")
            abort_merge_best_effort()
            return EXIT_GUARDRAIL

        try:
            run(["git", "commit", "-m", str(args.commit_message)], check=True)
            push_branch(branch)
        except subprocess.CalledProcessError as exc:
            eprint(f"HATA: commit/push başarısız: {exc}")
            abort_merge_best_effort()
            return EXIT_GIT

        print(f"[resolve] ok: auto-resolved {len(files)} conflict(s) and pushed {branch}")
        return EXIT_OK

    eprint(f"HATA: {msg}")
    abort_merge_best_effort()
    return EXIT_GIT


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

