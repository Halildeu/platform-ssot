#!/usr/bin/env python3
"""
Non-blocking auth/secret registry coverage report.

- If `docs/00-handbook/AUTH-REGISTRY.tsv` is missing: SKIP and exit 0.
- Otherwise:
  - scans workflows for `secrets.<NAME>` usage
  - scans repo for a small allowlisted set of env/secrets identifiers
  - reports any used names missing from the registry

This script is intentionally non-blocking (exit 0) to allow gradual adoption.
"""

import csv
import re
import sys
from pathlib import Path

REGISTRY = Path("docs/00-handbook/AUTH-REGISTRY.tsv")
WORKFLOWS_DIR = Path(".github/workflows")

# Keep this list explicit to limit false positives and keep the scanner deterministic.
KNOWN_NAMES_RX = re.compile(
    r"\b("
    r"GH_TOKEN|GITHUB_TOKEN|DEPLOY_ENABLED|ROLLBACK_ENABLED|"
    r"WEB_DEPLOY_HOOK_URL|WEB_ROLLBACK_HOOK_URL|"
    r"BACKEND_HEALTH_URLS|BACKEND_ROLLBACK_HOOK_URL|"
    r"WEB_SMOKE_URL|"
    r"GH_AUTH_VAULT_PATH|GH_AUTH_VAULT_FIELD|GH_LOCAL_AUTOPILOT_TOKEN"
    r")\b"
)

SECRETS_DOT_RX = re.compile(r"\bsecrets\.([A-Z0-9_]+)\b")


def load_registry_names() -> set[str] | None:
    if not REGISTRY.exists():
        return None
    with REGISTRY.open("r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))
    names = {r.get("NAME", "").strip() for r in rows if r.get("NAME")}
    return {n for n in names if n}


def scan_used_names() -> set[str]:
    used: set[str] = set()

    if WORKFLOWS_DIR.exists():
        for wf in WORKFLOWS_DIR.glob("*.y*ml"):
            txt = wf.read_text(encoding="utf-8", errors="ignore")
            used.update(SECRETS_DOT_RX.findall(txt))
            used.update(KNOWN_NAMES_RX.findall(txt))

    for base in [Path("scripts"), Path("docs")]:
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if not p.is_file():
                continue
            if p.suffix not in (".py", ".sh", ".yml", ".yaml", ".md", ".json", ".tsv"):
                continue
            txt = p.read_text(encoding="utf-8", errors="ignore")
            used.update(KNOWN_NAMES_RX.findall(txt))

    return used


def main() -> int:
    reg = load_registry_names()
    if reg is None:
        print(f"[check_auth_registry] SKIP: missing {REGISTRY}")
        return 0

    used = scan_used_names()
    missing = sorted([u for u in used if u and u not in reg])

    out_dir = Path(".autopilot-tmp/flow-mining")
    out_dir.mkdir(parents=True, exist_ok=True)
    report = out_dir / "auth-registry-report.md"

    lines: list[str] = []
    lines.append("# Auth Registry Report (non-blocking, local-only)")
    lines.append("")
    lines.append(f"- registry: {REGISTRY}")
    lines.append(f"- registry_names: {len(reg)}")
    lines.append(f"- used_names: {len(used)}")
    lines.append(f"- missing_in_registry: {len(missing)}")
    lines.append("")
    if missing:
        lines.append("## Missing")
        for m in missing:
            lines.append(f"- MISSING: {m}")
        lines.append("")
    else:
        lines.append("## Missing")
        lines.append("- none")
        lines.append("")

    report.write_text("\n".join(lines), encoding="utf-8")
    print(f"[check_auth_registry] report={report} missing={len(missing)} (non-blocking)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
