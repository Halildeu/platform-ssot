#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


FATAL_MARKERS = (
    "ERROR in",
    "Failed to compile",
    "Module not found",
    "ModuleFederationError",
    "npm ERR!",
    " ELIFECYCLE ",
    "ERR!",
    "UnhandledPromiseRejection",
    "TypeError:",
    "ReferenceError:",
    "SyntaxError:",
)

IGNORED_WARNING_MARKERS = (
    "asset size limit",
    "entrypoint size limit",
    "webpack performance recommendations",
    "DeprecationWarning: 'onAfterSetupMiddleware'",
    "DeprecationWarning: 'onBeforeSetupMiddleware'",
)


def _now_iso_utc() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def _resolve_path(root: Path, raw_path: str) -> Path:
    path = Path(str(raw_path).strip())
    return (root / path).resolve() if not path.is_absolute() else path.resolve()


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--session-file", default=".cache/runtime_guard/web_start_session.v1.json")
    parser.add_argument("--report", default=".cache/reports/web_runtime_guard.v1.json")
    parser.add_argument("--wait-seconds", type=int, default=120)
    parser.add_argument("--poll-interval", type=float, default=2.0)
    parser.add_argument("--strict-warnings", action="store_true")
    return parser.parse_args(argv)


def _http_check(url: str, timeout_seconds: float = 3.0) -> dict[str, Any]:
    request = Request(url, headers={"Accept": "*/*"})
    try:
        with urlopen(request, timeout=timeout_seconds) as response:
            status_code = int(response.getcode())
            body = response.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        status_code = int(exc.code)
        body = exc.read().decode("utf-8", errors="replace")
    except URLError as exc:
        return {
            "reachable": False,
            "status": "DOWN",
            "error": str(exc.reason),
            "url": url,
        }
    except Exception as exc:  # pragma: no cover - defensive
        return {
            "reachable": False,
            "status": "DOWN",
            "error": str(exc),
            "url": url,
        }

    return {
        "reachable": True,
        "status": "UP" if status_code == 200 else "DOWN",
        "http_status": status_code,
        "url": url,
        "body_tail": body[-400:] if body else "",
    }


def _wait_for_http(entries: list[dict[str, Any]], wait_seconds: int, poll_interval: float) -> dict[str, dict[str, Any]]:
    results = {
        str(entry.get("name") or ""): {"status": "DOWN", "reachable": False}
        for entry in entries
        if str(entry.get("check_url") or "").strip()
    }
    deadline = time.time() + max(wait_seconds, 1)
    while time.time() <= deadline:
        pending = 0
        for entry in entries:
            name = str(entry.get("name") or "")
            url = str(entry.get("check_url") or "").strip()
            if not name or not url:
                continue
            result = _http_check(url)
            results[name] = result
            if result.get("status") != "UP":
                pending += 1
        if pending == 0:
            break
        time.sleep(max(poll_interval, 0.5))
    return results


def _line_matches_warning(line: str) -> bool:
    upper = line.upper()
    return (
        " WARNING " in upper
        or upper.startswith("WARNING ")
        or "WARNING IN" in upper
        or "COMPILED WITH WARNINGS" in upper
        or "[WARN]" in upper
    )


def _line_matches_error(line: str) -> bool:
    upper = line.upper()
    if "[ERROR]" in upper or " ERROR " in upper:
        return True
    return any(marker.upper() in upper for marker in FATAL_MARKERS)


def _line_is_ignored_warning(line: str) -> bool:
    return any(marker in line for marker in IGNORED_WARNING_MARKERS)


def _scan_log(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {
            "performed": False,
            "error_matches": [],
            "warning_matches": [],
            "ignored_warning_matches": [],
            "reason": "log_missing",
            "log_path": str(path),
        }

    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    error_matches: list[dict[str, Any]] = []
    warning_matches: list[dict[str, Any]] = []
    ignored_warning_matches: list[dict[str, Any]] = []
    for idx, raw_line in enumerate(lines, start=1):
        line = raw_line.rstrip()
        if not line.strip():
            continue
        entry = {"line": idx, "text": line[:400]}
        if _line_matches_error(line):
            error_matches.append(entry)
            continue
        if _line_matches_warning(line):
            if _line_is_ignored_warning(line):
                ignored_warning_matches.append(entry)
            else:
                warning_matches.append(entry)

    return {
        "performed": True,
        "log_path": str(path),
        "error_matches": error_matches[-20:],
        "warning_matches": warning_matches[-20:],
        "ignored_warning_matches": ignored_warning_matches[-20:],
    }


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    root = _repo_root()
    session_path = _resolve_path(root, args.session_file)
    report_path = _resolve_path(root, args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)

    if not session_path.exists():
        payload = {
            "status": "FAIL",
            "error_code": "WEB_SESSION_MISSING",
            "session_file": str(session_path),
        }
        report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
        return 2

    session = _load_json(session_path)
    service_entries = session.get("services") if isinstance(session, dict) else None
    if not isinstance(service_entries, list):
        service_entries = []

    selected_services = [
        entry
        for entry in service_entries
        if isinstance(entry, dict) and str(entry.get("status") or "unknown") != "filtered"
    ]
    health_results = _wait_for_http(selected_services, args.wait_seconds, args.poll_interval)

    total_error_matches = 0
    total_warning_matches = 0
    total_ignored_warning_matches = 0
    failed_services: list[str] = []
    service_reports: list[dict[str, Any]] = []

    for entry in selected_services:
        name = str(entry.get("name") or "")
        log_path = Path(str(entry.get("log_path") or ""))
        health = health_results.get(name) or {"status": "DOWN", "reachable": False}
        log_scan = _scan_log(log_path)

        total_error_matches += len(log_scan.get("error_matches") or [])
        total_warning_matches += len(log_scan.get("warning_matches") or [])
        total_ignored_warning_matches += len(log_scan.get("ignored_warning_matches") or [])

        if health.get("status") != "UP" or (log_scan.get("error_matches") or []):
            failed_services.append(name)

        service_reports.append(
            {
                "name": name,
                "startup_status": str(entry.get("status") or "unknown"),
                "check_url": str(entry.get("check_url") or ""),
                "health": health,
                "log_scan": log_scan,
            }
        )

    status = "OK"
    if failed_services or total_error_matches:
        status = "FAIL"
    elif total_warning_matches:
        status = "FAIL" if bool(args.strict_warnings) else "WARN"

    report = {
        "version": "v1",
        "kind": "web-runtime-guard-report",
        "generated_at": _now_iso_utc(),
        "status": status,
        "strict_warnings": bool(args.strict_warnings),
        "session_file": str(session_path),
        "report_path": str(report_path),
        "summary": {
            "services_checked": len(service_reports),
            "failed_services": failed_services,
            "error_match_count": total_error_matches,
            "warning_match_count": total_warning_matches,
            "ignored_warning_match_count": total_ignored_warning_matches,
        },
        "session": {
            "session_id": session.get("session_id") if isinstance(session, dict) else None,
            "created_at": session.get("created_at") if isinstance(session, dict) else None,
            "profile": session.get("profile") if isinstance(session, dict) else None,
        },
        "services": service_reports,
    }

    report_path.write_text(json.dumps(report, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "status": status,
                "report_path": str(report_path),
                "failed_services": failed_services,
                "error_match_count": total_error_matches,
                "warning_match_count": total_warning_matches,
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0 if status in {"OK", "WARN"} else 2


if __name__ == "__main__":
    raise SystemExit(main())
