#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


ROOT = repo_root()
TECHNICAL_BASELINE_PATH = ROOT / "registry" / "technical_baseline.aistd.v1.json"
STANDARDS_LOCK_CHECK = ROOT / "ci" / "check_standards_lock.py"
WEB_SRI_MANIFEST_PATH = ROOT / "web" / "security" / "sri-manifest.json"
BACKEND_COMPOSE_PATH = ROOT / "backend" / "docker-compose.yml"
BACKEND_SBOM_SIGN_SCRIPT = ROOT / "backend" / "scripts" / "ci" / "security" / "generate-sbom-and-sign.sh"
BACKEND_DEP_SCAN_SCRIPT = ROOT / "backend" / "scripts" / "ci" / "security" / "run-dependency-scan.sh"


def fail(message: str) -> None:
    raise RuntimeError(message)


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"invalid_json:{path.relative_to(ROOT).as_posix()}:{exc}")


def require_file(path: Path) -> str:
    if not path.is_file():
        fail(f"missing_file:{path.relative_to(ROOT).as_posix()}")
    return path.relative_to(ROOT).as_posix()


def run_json_command(argv: list[str]) -> dict[str, Any]:
    proc = subprocess.run(
        argv,
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    stdout = (proc.stdout or "").strip()
    stderr = (proc.stderr or "").strip()
    if proc.returncode != 0:
        fail(f"command_failed:{' '.join(argv)}:{stderr or stdout or proc.returncode}")
    try:
        return json.loads(stdout)
    except json.JSONDecodeError as exc:
        fail(f"command_invalid_json:{' '.join(argv)}:{exc}")


def validate_public_key(path: Path) -> dict[str, Any]:
    if not path.is_file():
        fail(f"missing_public_key:{path}")
    proc = subprocess.run(
        ["openssl", "pkey", "-pubin", "-in", str(path), "-noout"],
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if proc.returncode != 0:
        fail(f"invalid_public_key:{path}")
    return {
        "path": str(path),
        "format": "PEM",
        "status": "OK",
    }


def validate_technical_baseline(target: str) -> dict[str, Any]:
    require_file(TECHNICAL_BASELINE_PATH)
    baseline = load_json(TECHNICAL_BASELINE_PATH)
    if baseline.get("kind") != "technical-baseline-aistd":
        fail("technical_baseline_kind_invalid")
    if baseline.get("status") != "ACTIVE":
        fail("technical_baseline_status_invalid")
    baseline_section = baseline.get("baseline")
    if not isinstance(baseline_section, dict):
        fail("technical_baseline_section_missing")
    baseline_target = "frontend" if target == "web" else target
    target_section = baseline_section.get(baseline_target)
    if not isinstance(target_section, dict):
        fail(f"technical_baseline_target_missing:{baseline_target}")
    return {
        "path": TECHNICAL_BASELINE_PATH.relative_to(ROOT).as_posix(),
        "kind": baseline.get("kind"),
        "status": baseline.get("status"),
        "baseline_target": baseline_target,
        "target_baseline": target_section,
    }


def validate_web_release_contract() -> dict[str, Any]:
    require_file(WEB_SRI_MANIFEST_PATH)
    manifest = load_json(WEB_SRI_MANIFEST_PATH)
    remotes = manifest.get("remotes")
    if not isinstance(remotes, dict) or not remotes:
        fail("web_sri_manifest_remotes_missing")
    invalid_remote_keys: list[str] = []
    for remote_name, payload in remotes.items():
        if not isinstance(payload, dict):
            invalid_remote_keys.append(str(remote_name))
            continue
        artifact = str(payload.get("artifact") or "").strip()
        sri = str(payload.get("sri") or "").strip()
        rotated = str(payload.get("lastRotatedAt") or "").strip()
        if not artifact or not sri.startswith("sha384-") or not rotated:
            invalid_remote_keys.append(str(remote_name))
    if invalid_remote_keys:
        fail("web_sri_manifest_invalid_remotes:" + ",".join(sorted(invalid_remote_keys)))
    return {
        "sri_manifest_path": WEB_SRI_MANIFEST_PATH.relative_to(ROOT).as_posix(),
        "remote_count": len(remotes),
        "required_remote_examples": sorted(remotes.keys())[:5],
    }


def validate_backend_release_contract() -> dict[str, Any]:
    compose_path = require_file(BACKEND_COMPOSE_PATH)
    sbom_sign_path = require_file(BACKEND_SBOM_SIGN_SCRIPT)
    dep_scan_path = require_file(BACKEND_DEP_SCAN_SCRIPT)

    sbom_sign_text = BACKEND_SBOM_SIGN_SCRIPT.read_text(encoding="utf-8")
    if "cosign" not in sbom_sign_text or "sign-blob" not in sbom_sign_text:
        fail("backend_sbom_signing_capability_missing")

    return {
        "compose_path": compose_path,
        "sbom_sign_script": sbom_sign_path,
        "dependency_scan_script": dep_scan_path,
        "signing_capability": "cosign-sign-blob",
    }


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Deploy scope gate backed by technical baseline and active release artifacts.")
    parser.add_argument("--target", required=True, choices=["backend", "web"])
    parser.add_argument("--scope", required=True, choices=["dev", "stage", "prod"])
    parser.add_argument("--public-key", default="")
    parser.add_argument("--out", default="")
    parser.add_argument("--skip-standards-lock", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    report: dict[str, Any] = {
        "kind": "deploy-scope-gate",
        "version": "v1",
        "status": "FAIL",
        "target": args.target,
        "scope": args.scope,
        "repo_root": str(ROOT),
        "checks": {},
    }
    out_path = Path(args.out).resolve() if args.out else None

    try:
        report["checks"]["technical_baseline"] = validate_technical_baseline(args.target)

        if not args.skip_standards_lock:
            report["checks"]["standards_lock"] = run_json_command(
                ["python3", "ci/check_standards_lock.py", "--repo-root", str(ROOT)]
            )
            if report["checks"]["standards_lock"].get("status") != "OK":
                fail("standards_lock_not_ok")

        if args.target == "backend":
            report["checks"]["release_contract"] = validate_backend_release_contract()
        else:
            report["checks"]["release_contract"] = validate_web_release_contract()

        public_key_arg = str(args.public_key or "").strip()
        if args.scope == "prod":
            if not public_key_arg:
                fail("prod_public_key_required")
            report["checks"]["public_key"] = validate_public_key(Path(public_key_arg))
        elif public_key_arg:
            report["checks"]["public_key"] = validate_public_key(Path(public_key_arg))

        report["status"] = "OK"
    except Exception as exc:  # noqa: BLE001
        report["error"] = str(exc)

    if out_path:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 0 if report["status"] == "OK" else 2


if __name__ == "__main__":
    raise SystemExit(main())
