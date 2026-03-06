#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[3]
BACKEND_DIR = ROOT / "backend"
REGISTRY_PATH = ROOT / "docs/02-architecture/context/backend-diagnostics.registry.v1.json"
DEFAULT_COMPOSE_FILE = BACKEND_DIR / "docker-compose.yml"
DEFAULT_OUTPUT_ROOT = BACKEND_DIR / "test-results/diagnostics/backend-doctor"

JWT_RE = re.compile(r"[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}")
BEARER_RE = re.compile(r"Bearer\s+[A-Za-z0-9._\-]+", re.IGNORECASE)
SECRET_RE = re.compile(r"(?i)(authorization|token|secret|password|client_secret|private_key)\s*[:=]\s*([^\s,;]+)")


@dataclass
class CommandResult:
    ok: bool
    exit_code: int
    stdout: str
    stderr: str
    command: list[str]


def now_utc() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def safe_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace(":", "-").replace("+00:00", "Z")


def run_command(command: list[str], cwd: Path) -> CommandResult:
    completed = subprocess.run(
        command,
        cwd=str(cwd),
        text=True,
        capture_output=True,
        check=False,
    )
    return CommandResult(
        ok=completed.returncode == 0,
        exit_code=completed.returncode,
        stdout=completed.stdout,
        stderr=completed.stderr,
        command=command,
    )


def parse_json_lines(text: str) -> list[dict[str, Any]]:
    stripped = text.strip()
    if not stripped:
        return []
    if stripped.startswith("["):
        parsed = json.loads(stripped)
        return parsed if isinstance(parsed, list) else []
    items: list[dict[str, Any]] = []
    for line in stripped.splitlines():
        line = line.strip()
        if not line or not line.startswith("{"):
            continue
        try:
            parsed = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            items.append(parsed)
    return items


def redact(text: str) -> str:
    text = BEARER_RE.sub("Bearer [REDACTED]", text)
    text = JWT_RE.sub("[REDACTED_JWT]", text)
    text = SECRET_RE.sub(lambda match: f"{match.group(1)}=[REDACTED]", text)
    return text


def http_probe(url: str, expected_statuses: list[int], timeout: int = 5) -> dict[str, Any]:
    started_at = now_utc()
    request = Request(url, headers={"User-Agent": "backend-doctor/1.0"})
    try:
        with urlopen(request, timeout=timeout) as response:
            body = response.read(512).decode("utf-8", errors="replace")
            status = response.getcode()
    except HTTPError as exc:
        status = exc.code
        body = exc.read(512).decode("utf-8", errors="replace")
    except URLError as exc:
        return {
            "status": "FAIL",
            "http_status": None,
            "ok": False,
            "url": url,
            "expected_statuses": expected_statuses,
            "error": redact(str(exc.reason)),
            "body_excerpt": "",
            "started_at": started_at,
            "ended_at": now_utc(),
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "status": "FAIL",
            "http_status": None,
            "ok": False,
            "url": url,
            "expected_statuses": expected_statuses,
            "error": redact(str(exc)),
            "body_excerpt": "",
            "started_at": started_at,
            "ended_at": now_utc(),
        }

    ok = status in expected_statuses
    return {
        "status": "PASS" if ok else "FAIL",
        "http_status": status,
        "ok": ok,
        "url": url,
        "expected_statuses": expected_statuses,
        "error": "",
        "body_excerpt": redact(body),
        "started_at": started_at,
        "ended_at": now_utc(),
    }


def render_markdown_table(headers: list[str], rows: list[list[str]]) -> str:
    lines = ["| " + " | ".join(headers) + " |", "|" + "|".join(["---"] * len(headers)) + "|"]
    for row in rows:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Backend runtime diagnostics doctor")
    parser.add_argument("--preset", default="local-compose")
    parser.add_argument("--compose-file", default=str(DEFAULT_COMPOSE_FILE))
    parser.add_argument("--out-root", default=str(DEFAULT_OUTPUT_ROOT))
    parser.add_argument("--tail", type=int, default=200)
    args = parser.parse_args()

    registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    preset_map = {item["preset_id"]: item for item in registry.get("doctor_presets", [])}
    preset = preset_map.get(args.preset)
    if not preset:
        print(json.dumps({"status": "FAIL", "error": f"unknown preset: {args.preset}"}, ensure_ascii=False, indent=2))
        return 1

    out_dir = Path(args.out_root) / safe_timestamp()
    artifacts_dir = out_dir / "artifacts"
    out_dir.mkdir(parents=True, exist_ok=True)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    started_at = now_utc()
    compose_file = Path(args.compose_file)
    compose_cmd = ["docker", "compose", "-f", str(compose_file), "ps", "--format", "json"]
    compose_result = run_command(compose_cmd, cwd=ROOT)
    (artifacts_dir / "compose-ps.raw.txt").write_text(compose_result.stdout, encoding="utf-8")
    (artifacts_dir / "compose-ps.stderr.log").write_text(redact(compose_result.stderr), encoding="utf-8")

    compose_rows = parse_json_lines(compose_result.stdout)
    compose_by_service = {row.get("Service"): row for row in compose_rows if isinstance(row, dict)}

    fail_reasons: list[str] = []
    warn_reasons: list[str] = []

    service_matrix: list[dict[str, Any]] = []
    for service in registry.get("service_matrix", []):
        compose_service = service["compose_service"]
        row = compose_by_service.get(compose_service)
        optional = not service.get("critical", False)
        if row is None:
            entry = {
                "service_id": service["service_id"],
                "compose_service": compose_service,
                "critical": service.get("critical", False),
                "state": "missing",
                "health": "missing",
                "status_text": "missing",
                "ports": "",
                "ok": optional,
            }
            if optional:
                warn_reasons.append(f"optional-service-missing:{compose_service}")
            else:
                fail_reasons.append(f"critical-service-missing:{compose_service}")
        else:
            state = str(row.get("State", "unknown"))
            health = str(row.get("Health", "none"))
            status_text = str(row.get("Status", ""))
            ok = state == "running" and (health in {"healthy", "none", ""} or health == "null")
            if not ok:
                if optional:
                    warn_reasons.append(f"optional-service-unhealthy:{compose_service}:{state}:{health}")
                else:
                    fail_reasons.append(f"critical-service-unhealthy:{compose_service}:{state}:{health}")
            entry = {
                "service_id": service["service_id"],
                "compose_service": compose_service,
                "critical": service.get("critical", False),
                "state": state,
                "health": health,
                "status_text": status_text,
                "ports": str(row.get("Ports", "")),
                "ok": ok,
            }
        service_matrix.append(entry)

    service_matrix_path = out_dir / "service-matrix.v1.json"
    service_matrix_path.write_text(json.dumps(service_matrix, ensure_ascii=False, indent=2), encoding="utf-8")

    health_results: list[dict[str, Any]] = []
    for service in registry.get("service_matrix", []):
        health_url = service.get("health_url")
        if not health_url:
            continue
        result = http_probe(health_url, service.get("expected_http_statuses", [200]))
        result.update(
            {
                "service_id": service["service_id"],
                "compose_service": service["compose_service"],
                "critical": service.get("critical", False),
            }
        )
        if not result["ok"]:
            if service.get("critical", False):
                fail_reasons.append(f"critical-health-fail:{service['compose_service']}")
            else:
                warn_reasons.append(f"optional-health-fail:{service['compose_service']}")
        health_results.append(result)

    health_path = out_dir / "health-probes.v1.json"
    health_path.write_text(json.dumps(health_results, ensure_ascii=False, indent=2), encoding="utf-8")

    smoke_results: list[dict[str, Any]] = []
    for smoke in registry.get("smoke_checks", []):
        result = http_probe(smoke["url"], smoke.get("expected_statuses", [200]))
        result.update(
            {
                "check_id": smoke["check_id"],
                "critical": smoke.get("critical", False),
                "method": smoke.get("method", "GET"),
            }
        )
        if not result["ok"]:
            if smoke.get("critical", False):
                fail_reasons.append(f"critical-smoke-fail:{smoke['check_id']}")
            else:
                warn_reasons.append(f"optional-smoke-fail:{smoke['check_id']}")
        smoke_results.append(result)

    smoke_path = out_dir / "smoke-checks.v1.json"
    smoke_path.write_text(json.dumps(smoke_results, ensure_ascii=False, indent=2), encoding="utf-8")

    patterns = [re.compile(pattern, re.IGNORECASE) for pattern in registry.get("log_triage", {}).get("patterns", [])]
    excerpt_limit = int(registry.get("log_triage", {}).get("excerpt_limit_per_service", 5))
    log_triage: list[dict[str, Any]] = []
    for service in registry.get("service_matrix", []):
        compose_service = service["compose_service"]
        if compose_service not in compose_by_service:
            log_triage.append(
                {
                    "service_id": service["service_id"],
                    "compose_service": compose_service,
                    "status": "SKIPPED",
                    "reason": "service-not-running",
                    "finding_count": 0,
                    "excerpts": [],
                }
            )
            continue
        logs_result = run_command(
            ["docker", "compose", "-f", str(compose_file), "logs", "--no-color", f"--tail={args.tail}", compose_service],
            cwd=ROOT,
        )
        findings: list[str] = []
        if logs_result.stdout:
            for line in logs_result.stdout.splitlines():
                sanitized = redact(line.strip())
                if not sanitized:
                    continue
                if any(pattern.search(sanitized) for pattern in patterns):
                    if sanitized not in findings:
                        findings.append(sanitized)
                if len(findings) >= excerpt_limit:
                    break
        status = "PASS" if not findings else "WARN"
        if findings:
            warn_reasons.append(f"log-triage-findings:{compose_service}:{len(findings)}")
        log_triage.append(
            {
                "service_id": service["service_id"],
                "compose_service": compose_service,
                "status": status,
                "reason": "findings-detected" if findings else "no-red-flags",
                "finding_count": len(findings),
                "excerpts": findings,
            }
        )

    log_triage_path = out_dir / "log-triage.v1.json"
    log_triage_path.write_text(json.dumps(log_triage, ensure_ascii=False, indent=2), encoding="utf-8")

    compose_warning_lines = [redact(line.strip()) for line in compose_result.stderr.splitlines() if line.strip()]
    if compose_warning_lines:
        warn_reasons.append("compose-env-warnings-present")

    overall_status = "FAIL" if fail_reasons else "WARN" if warn_reasons else "PASS"
    ended_at = now_utc()

    summary = {
        "version": "1.0",
        "doctor_id": "backend-doctor",
        "preset": args.preset,
        "compose_file": str(compose_file.relative_to(ROOT)),
        "started_at": started_at,
        "ended_at": ended_at,
        "overall_status": overall_status,
        "service_matrix": service_matrix,
        "health_probes": health_results,
        "smoke_checks": smoke_results,
        "log_triage": log_triage,
        "compose_warnings": compose_warning_lines,
        "fail_reasons": sorted(set(fail_reasons)),
        "warn_reasons": sorted(set(warn_reasons)),
        "artifacts": {
            "summary_json": str((out_dir / "backend-doctor.summary.v1.json").relative_to(ROOT)),
            "summary_md": str((out_dir / "backend-doctor.summary.v1.md").relative_to(ROOT)),
            "service_matrix": str(service_matrix_path.relative_to(ROOT)),
            "health_probes": str(health_path.relative_to(ROOT)),
            "smoke_checks": str(smoke_path.relative_to(ROOT)),
            "log_triage": str(log_triage_path.relative_to(ROOT)),
            "compose_ps_raw": str((artifacts_dir / "compose-ps.raw.txt").relative_to(ROOT)),
            "compose_ps_stderr": str((artifacts_dir / "compose-ps.stderr.log").relative_to(ROOT)),
        },
    }

    summary_json_path = out_dir / "backend-doctor.summary.v1.json"
    summary_json_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    service_rows = [
        [item["compose_service"], "kritik" if item["critical"] else "opsiyonel", item["state"], item["health"], "OK" if item["ok"] else "FAIL"]
        for item in service_matrix
    ]
    health_rows = [
        [item["compose_service"], str(item.get("http_status")), ",".join(str(x) for x in item.get("expected_statuses", [])), item["status"]]
        for item in health_results
    ]
    smoke_rows = [
        [item["check_id"], str(item.get("http_status")), ",".join(str(x) for x in item.get("expected_statuses", [])), item["status"]]
        for item in smoke_results
    ]
    log_rows = [
        [item["compose_service"], item["status"], str(item["finding_count"]), (item["excerpts"][0] if item["excerpts"] else "-")[:120]]
        for item in log_triage
    ]

    md_lines = [
        "# Backend Doctor Summary",
        "",
        f"- Preset: `{args.preset}`",
        f"- Zaman: `{started_at}` -> `{ended_at}`",
        f"- Sonuc: `{overall_status}`",
        "",
        "## Service Matrix",
        "",
        render_markdown_table(["Service", "Kritiklik", "State", "Health", "Result"], service_rows),
        "",
        "## Health Probes",
        "",
        render_markdown_table(["Service", "HTTP", "Beklenen", "Result"], health_rows),
        "",
        "## Smoke Checks",
        "",
        render_markdown_table(["Check", "HTTP", "Beklenen", "Result"], smoke_rows),
        "",
        "## Log Triage",
        "",
        render_markdown_table(["Service", "Result", "Hit", "Ilk excerpt"], log_rows),
        "",
        "## Compose Warnings",
        "",
    ]
    if compose_warning_lines:
        md_lines.extend([f"- {line}" for line in compose_warning_lines])
    else:
        md_lines.append("- yok")
    md_lines.extend(
        [
            "",
            "## Fail Reasons",
            "",
        ]
    )
    if summary["fail_reasons"]:
        md_lines.extend([f"- {item}" for item in summary["fail_reasons"]])
    else:
        md_lines.append("- yok")
    md_lines.extend(["", "## Warn Reasons", ""])
    if summary["warn_reasons"]:
        md_lines.extend([f"- {item}" for item in summary["warn_reasons"]])
    else:
        md_lines.append("- yok")
    md_lines.extend(
        [
            "",
            "## Artifacts",
            "",
            f"- JSON summary: `{summary['artifacts']['summary_json']}`",
            f"- Service matrix: `{summary['artifacts']['service_matrix']}`",
            f"- Health probes: `{summary['artifacts']['health_probes']}`",
            f"- Smoke checks: `{summary['artifacts']['smoke_checks']}`",
            f"- Log triage: `{summary['artifacts']['log_triage']}`",
        ]
    )
    (out_dir / "backend-doctor.summary.v1.md").write_text("\n".join(md_lines) + "\n", encoding="utf-8")

    print(json.dumps({
        "status": overall_status,
        "out_json": str(summary_json_path.relative_to(ROOT)),
        "out_md": str((out_dir / 'backend-doctor.summary.v1.md').relative_to(ROOT)),
        "fail_reasons": summary["fail_reasons"],
        "warn_reasons": summary["warn_reasons"],
    }, ensure_ascii=False, indent=2))
    return 0 if overall_status in {"PASS", "WARN"} else 1


if __name__ == "__main__":
    raise SystemExit(main())
