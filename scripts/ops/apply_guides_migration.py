#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path


def sh(cmd: list[str]) -> None:
    subprocess.check_call(cmd)


def main() -> int:
    plan_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not plan_path or not plan_path.exists():
        print("Usage: python3 scripts/ops/apply_guides_migration.py <plan.json>")
        return 2

    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    if not isinstance(plan, list):
        print("[apply_guides_migration] FAIL: plan.json must be a list")
        return 2

    try:
        st = subprocess.check_output(["git", "status", "--porcelain=v1"], text=True).strip()
        if st:
            print("[apply_guides_migration] WARN: working tree not clean:")
            print(st)
    except Exception:
        pass

    for item in plan:
        src = Path(item["from"])
        dst = Path(item["to"])
        if not src.exists():
            print(f"[SKIP] missing src: {src}")
            continue
        if dst.exists():
            print(f"[FAIL] dst exists (collision): {dst}")
            return 1

        dst.parent.mkdir(parents=True, exist_ok=True)
        sh(["git", "mv", str(src), str(dst)])
        print(f"[MOVED] {src} -> {dst}")

    print("[apply_guides_migration] DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
