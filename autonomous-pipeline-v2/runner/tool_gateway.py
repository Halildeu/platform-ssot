#!/usr/bin/env python3
from __future__ import annotations

import difflib
import fnmatch
import hashlib
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def sha256_bytes(data: bytes) -> str:
    h = hashlib.sha256()
    h.update(data)
    return f"sha256:{h.hexdigest()}"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return f"sha256:{h.hexdigest()}"


def safe_resolve_under(root: Path, rel_path: str) -> Path:
    p = Path(rel_path)
    if p.is_absolute():
        raise ValueError(f"absolute_path_not_allowed: {rel_path}")
    if any(part == ".." for part in p.parts):
        raise ValueError(f"path_traversal_not_allowed: {rel_path}")
    resolved = (root / p).resolve()
    resolved.relative_to(root.resolve())
    return resolved


def posix_relpath(root: Path, p: Path) -> str:
    rel = p.resolve().relative_to(root.resolve())
    return rel.as_posix()


def is_match_any(value: str, patterns: Iterable[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatch(value, pat):
            return True
    return False


def forbidden_patterns(security_policy: dict[str, Any]) -> list[str]:
    fs = security_policy.get("filesystem") if isinstance(security_policy, dict) else None
    if not isinstance(fs, dict):
        return []
    pats = fs.get("forbidden_paths") or []
    return [str(x) for x in pats if isinstance(x, str) and x.strip()]


def network_allowlist_hosts(security_policy: dict[str, Any]) -> list[str]:
    net = security_policy.get("network") if isinstance(security_policy, dict) else None
    if not isinstance(net, dict):
        return []
    hosts = net.get("allowlist_hosts") or []
    return [str(x).strip().lower() for x in hosts if isinstance(x, str) and x.strip()]


def network_http_request_limits(security_policy: dict[str, Any]) -> dict[str, Any]:
    net = security_policy.get("network") if isinstance(security_policy, dict) else None
    net = net if isinstance(net, dict) else {}
    http = net.get("http_request") if isinstance(net.get("http_request"), dict) else {}
    return http if isinstance(http, dict) else {}


def tls_ca_bundle_path() -> str | None:
    env_candidates = [
        os.environ.get("SSL_CERT_FILE") or "",
        os.environ.get("REQUESTS_CA_BUNDLE") or "",
    ]
    common_candidates = [
        "/etc/ssl/cert.pem",
        "/etc/ssl/certs/ca-certificates.crt",
        "/etc/pki/tls/certs/ca-bundle.crt",
        "/etc/ssl/certs/ca-bundle.crt",
        "/etc/ssl/ca-bundle.pem",
    ]
    for cand in [*env_candidates, *common_candidates]:
        if not cand:
            continue
        try:
            if Path(cand).is_file():
                return cand
        except Exception:
            continue
    return None


def base_content_type(value: str) -> str:
    return (value.split(";", 1)[0] if isinstance(value, str) else "").strip().lower()


def redact_url(url: str) -> str:
    try:
        parts = urllib.parse.urlsplit(url)
        scheme = (parts.scheme or "").lower()
        host = (parts.hostname or "").lower()
        port = parts.port
        path = parts.path or "/"
        if len(path) > 200:
            path = path[:200] + "...[truncated]"
        if scheme and host:
            if port and not ((scheme == "https" and port == 443) or (scheme == "http" and port == 80)):
                return f"{scheme}://{host}:{port}{path}"
            return f"{scheme}://{host}{path}"
    except Exception:
        pass
    return "url_redacted"


RE_HEADER_NAME = re.compile(r"^[A-Za-z0-9-]{1,64}$")


def normalize_headers(headers: dict[str, Any] | None) -> dict[str, str]:
    headers = headers or {}
    out: dict[str, str] = {}
    if not isinstance(headers, dict):
        return out
    for k, v in headers.items():
        if not isinstance(k, str) or not isinstance(v, str):
            continue
        name = k.strip()
        value = v.strip()
        if not name or not RE_HEADER_NAME.match(name):
            continue
        if not value or len(value) > 512:
            continue
        if "\n" in value or "\r" in value:
            continue
        out[name] = value
        if len(out) >= 32:
            break
    return out


@dataclass(frozen=True)
class CapabilitySpec:
    allowed_tools: list[str]
    fs_read_allowlist: list[str]
    fs_write_allowlist: list[str]


def parse_capabilities(raw: Any) -> CapabilitySpec:
    raw = raw if isinstance(raw, dict) else {}
    allowed_tools = raw.get("allowed_tools") or []
    allowed_tools = [str(x) for x in allowed_tools if isinstance(x, str) and x.strip()]

    fs = raw.get("fs") if isinstance(raw.get("fs"), dict) else {}
    fs_read_allowlist = (fs.get("read_allowlist") or []) if isinstance(fs, dict) else []
    fs_write_allowlist = (fs.get("write_allowlist") or []) if isinstance(fs, dict) else []

    fs_read_allowlist = [str(x) for x in fs_read_allowlist if isinstance(x, str) and x.strip()]
    fs_write_allowlist = [str(x) for x in fs_write_allowlist if isinstance(x, str) and x.strip()]

    return CapabilitySpec(
        allowed_tools=allowed_tools,
        fs_read_allowlist=fs_read_allowlist,
        fs_write_allowlist=fs_write_allowlist,
    )


class ToolGateway:
    def __init__(
        self,
        *,
        repo_root: Path,
        run_dir: Path,
        node_id: str,
        capabilities: CapabilitySpec,
        security_policy: dict[str, Any],
    ) -> None:
        self._repo_root = repo_root
        self._run_dir = run_dir
        self._node_id = node_id
        self._cap = capabilities
        self._security_policy = security_policy
        self._events: list[dict[str, Any]] = []

    @property
    def events(self) -> list[dict[str, Any]]:
        return list(self._events)

    def _record(self, *, tool: str, target: str, decision: str, reason: str, details: dict[str, Any] | None = None) -> None:
        ev: dict[str, Any] = {
            "tool": tool,
            "node_id": self._node_id,
            "target": target,
            "decision": decision,
            "reason": reason,
        }
        if details:
            ev["details"] = details
        self._events.append(ev)

    def _require_tool(self, tool: str, *, target: str) -> None:
        if tool not in self._cap.allowed_tools:
            self._record(tool=tool, target=target, decision="block", reason="tool_not_allowed", details={"allowed_tools": self._cap.allowed_tools})
            raise PermissionError(f"tool_not_allowed: {tool}")

    def read_text(self, rel_path: str) -> tuple[str, dict[str, Any]]:
        tool = "fs.read_text"
        self._require_tool(tool, target=rel_path)

        try:
            abs_path = safe_resolve_under(self._repo_root, rel_path)
            rel_posix = posix_relpath(self._repo_root, abs_path)
        except Exception as exc:
            self._record(tool=tool, target=rel_path, decision="block", reason="path_invalid", details={"error": str(exc)})
            raise

        forbidden = forbidden_patterns(self._security_policy)
        if forbidden and is_match_any(rel_posix, forbidden):
            self._record(tool=tool, target=rel_posix, decision="block", reason="forbidden_path")
            raise PermissionError("forbidden_path")

        if self._cap.fs_read_allowlist and not is_match_any(rel_posix, self._cap.fs_read_allowlist):
            self._record(
                tool=tool,
                target=rel_posix,
                decision="block",
                reason="read_not_allowlisted",
                details={"read_allowlist": self._cap.fs_read_allowlist},
            )
            raise PermissionError("read_not_allowlisted")

        content = abs_path.read_text(encoding="utf-8", errors="ignore")
        info = {
            "path": rel_posix,
            "sha256": sha256_bytes(content.encode("utf-8", errors="ignore")),
            "sha256_file": sha256_file(abs_path),
            "bytes": len(content.encode("utf-8", errors="ignore")),
        }
        self._record(tool=tool, target=rel_posix, decision="allow", reason="ok", details={"sha256_file": info["sha256_file"]})
        return content, info

    def file_write(
        self,
        *,
        output_path: str,
        content_bytes: bytes,
        mode: str,
        dry_run: bool,
        allowed_commit_paths: list[str],
    ) -> tuple[dict[str, Any], dict[str, Any] | None]:
        tool = "fs.write_file"
        self._require_tool(tool, target=output_path)

        try:
            out_abs = safe_resolve_under(self._repo_root, output_path)
            out_rel_posix = posix_relpath(self._repo_root, out_abs)
        except Exception as exc:
            self._record(tool=tool, target=output_path, decision="block", reason="path_invalid", details={"error": str(exc)})
            raise

        forbidden = forbidden_patterns(self._security_policy)
        if forbidden and is_match_any(out_rel_posix, forbidden):
            self._record(tool=tool, target=out_rel_posix, decision="block", reason="forbidden_path")
            return (
                {"type": "file_write", "mode": mode, "target": out_rel_posix, "result": "blocked", "metadata": {"reason": "forbidden_path"}},
                None,
            )

        if self._cap.fs_write_allowlist and not is_match_any(out_rel_posix, self._cap.fs_write_allowlist):
            self._record(
                tool=tool,
                target=out_rel_posix,
                decision="block",
                reason="write_not_allowlisted",
                details={"write_allowlist": self._cap.fs_write_allowlist},
            )
            return (
                {"type": "file_write", "mode": mode, "target": out_rel_posix, "result": "blocked", "metadata": {"reason": "write_not_allowlisted"}},
                None,
            )

        if mode not in {"deny", "draft", "commit"}:
            self._record(tool=tool, target=out_rel_posix, decision="block", reason="unknown_mode", details={"mode": mode})
            return (
                {"type": "file_write", "mode": str(mode), "target": out_rel_posix, "result": "blocked", "metadata": {"reason": "unknown_mode"}},
                None,
            )

        if dry_run or mode == "deny":
            decision = "allow" if dry_run else "block"
            reason = "dry_run" if dry_run else "side_effect_denied"
            self._record(tool=tool, target=out_rel_posix, decision=decision, reason=reason, details={"mode": mode, "dry_run": dry_run})
            return (
                {
                    "type": "file_write",
                    "mode": mode,
                    "target": out_rel_posix,
                    "result": "skipped" if dry_run else "blocked",
                    "metadata": {"dry_run": dry_run},
                },
                {"written_path": None, "dry_run": dry_run, "mode": mode},
            )

        if mode == "commit":
            is_under_autopilot = out_rel_posix.startswith(".autopilot-tmp/")
            is_allowlisted = any(
                out_rel_posix.startswith(pfx.rstrip("/") + "/") or out_rel_posix == pfx.rstrip("/") for pfx in allowed_commit_paths
            )
            if not (is_under_autopilot or is_allowlisted):
                self._record(
                    tool=tool,
                    target=out_rel_posix,
                    decision="block",
                    reason="commit_not_allowlisted",
                    details={"allowed_paths": allowed_commit_paths},
                )
                return (
                    {
                        "type": "file_write",
                        "mode": mode,
                        "target": out_rel_posix,
                        "result": "blocked",
                        "metadata": {"reason": "commit_not_allowed_without_allowlist", "allowed_paths": allowed_commit_paths},
                    },
                    None,
                )

        if mode == "draft":
            target_abs = (self._run_dir / "drafts" / out_rel_posix).resolve()
            target_abs.parent.mkdir(parents=True, exist_ok=True)
        else:
            target_abs = out_abs
            target_abs.parent.mkdir(parents=True, exist_ok=True)

        before = b""
        if target_abs.exists():
            try:
                before = target_abs.read_bytes()
            except Exception:
                before = b""

        target_abs.write_bytes(content_bytes)

        diff_ref: str | None = None
        try:
            before_text = before.decode("utf-8", errors="ignore")
            after_text = content_bytes.decode("utf-8", errors="ignore")
            diff = "\n".join(
                difflib.unified_diff(
                    before_text.splitlines(),
                    after_text.splitlines(),
                    fromfile=f"{out_rel_posix}:before",
                    tofile=f"{out_rel_posix}:after",
                    lineterm="",
                )
            )
            if diff.strip():
                diff_path = self._run_dir / "side_effects" / f"{self._node_id}.file_write.diff"
                diff_path.parent.mkdir(parents=True, exist_ok=True)
                diff_path.write_text(diff + "\n", encoding="utf-8")
                diff_ref = str(diff_path.relative_to(self._repo_root).as_posix())
        except Exception:
            diff_ref = None

        side_effect: dict[str, Any] = {"type": "file_write", "mode": mode, "target": out_rel_posix, "result": "success"}
        if diff_ref:
            side_effect["diff_ref"] = diff_ref

        written_rel = str(target_abs.relative_to(self._repo_root).as_posix())
        self._record(
            tool=tool,
            target=out_rel_posix,
            decision="allow",
            reason="ok",
            details={"mode": mode, "written_path": written_rel, "bytes_written": len(content_bytes), "diff_ref": diff_ref},
        )

        return side_effect, {"written_path": written_rel, "bytes_written": len(content_bytes), "mode": mode, "dry_run": False}

    def http_request(
        self,
        *,
        method: str,
        url: str,
        headers: dict[str, Any] | None,
        body_bytes: bytes | None,
        mode: str,
        dry_run: bool,
        request_allowlist_hosts: list[str],
    ) -> tuple[dict[str, Any], dict[str, Any] | None]:
        tool = "http.request"
        url_sanitized = redact_url(url)
        self._require_tool(tool, target=url_sanitized)

        if mode not in {"deny", "allow"}:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="unknown_mode", details={"mode": mode})
            return ({"type": "http_request", "mode": str(mode), "target": url_sanitized, "result": "blocked"}, None)

        if dry_run or mode == "deny":
            decision = "allow" if dry_run else "block"
            reason = "dry_run" if dry_run else "side_effect_denied"
            self._record(tool=tool, target=url_sanitized, decision=decision, reason=reason, details={"mode": mode, "dry_run": dry_run})
            return (
                {
                    "type": "http_request",
                    "mode": mode,
                    "target": url_sanitized,
                    "result": "skipped" if dry_run else "blocked",
                    "metadata": {"dry_run": dry_run},
                },
                {"status_code": None, "dry_run": dry_run},
            )

        allow_req = [str(x).strip().lower() for x in request_allowlist_hosts if isinstance(x, str) and str(x).strip()]
        allow_sec = network_allowlist_hosts(self._security_policy)
        if not allow_sec:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="security_allowlist_empty")
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "security_allowlist_empty"}}, None)
        if not allow_req:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="request_allowlist_empty")
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "request_allowlist_empty"}}, None)

        try:
            parts = urllib.parse.urlsplit(url)
        except Exception as exc:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="url_parse_failed", details={"error": str(exc)})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "url_parse_failed"}}, None)

        scheme = (parts.scheme or "").lower()
        host = (parts.hostname or "").lower()
        port = parts.port
        if parts.username or parts.password:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="userinfo_not_allowed")
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "userinfo_not_allowed"}}, None)
        if not scheme or not host:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="missing_scheme_or_host")
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "missing_scheme_or_host"}}, None)

        lim = network_http_request_limits(self._security_policy)
        allowed_schemes = [str(x).strip().lower() for x in (lim.get("allowed_schemes") or ["https"]) if isinstance(x, str) and str(x).strip()]
        if scheme not in allowed_schemes:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="scheme_not_allowed", details={"scheme": scheme, "allowed_schemes": allowed_schemes})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "scheme_not_allowed"}}, None)

        allowed_ports = lim.get("allowed_ports")
        if isinstance(allowed_ports, list) and allowed_ports:
            ports = [int(x) for x in allowed_ports if isinstance(x, int) and x > 0 and x <= 65535]
        else:
            ports = [443] if scheme == "https" else [80]
        eff_port = int(port or (443 if scheme == "https" else 80))
        if eff_port not in ports:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="port_not_allowed", details={"port": eff_port, "allowed_ports": ports})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "port_not_allowed"}}, None)

        if not is_match_any(host, allow_sec):
            self._record(tool=tool, target=url_sanitized, decision="block", reason="host_not_allowlisted_security", details={"host": host})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "host_not_allowlisted_security"}}, None)
        if not is_match_any(host, allow_req):
            self._record(tool=tool, target=url_sanitized, decision="block", reason="host_not_allowlisted_request", details={"host": host})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "host_not_allowlisted_request"}}, None)

        allowed_methods = [str(x).strip().upper() for x in (lim.get("allowed_methods") or ["GET"]) if isinstance(x, str) and str(x).strip()]
        req_method = str(method or "").strip().upper()
        if req_method not in allowed_methods:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="method_not_allowed", details={"method": req_method, "allowed_methods": allowed_methods})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "method_not_allowed"}}, None)

        timeout_ms = lim.get("timeout_ms")
        timeout_ms = int(timeout_ms) if isinstance(timeout_ms, int) and timeout_ms > 0 else 5000
        max_bytes_out = lim.get("max_bytes_out")
        max_bytes_out = int(max_bytes_out) if isinstance(max_bytes_out, int) and max_bytes_out > 0 else 1024 * 1024
        max_bytes_in = lim.get("max_bytes_in")
        max_bytes_in = int(max_bytes_in) if isinstance(max_bytes_in, int) and max_bytes_in > 0 else 64 * 1024
        allowed_content_types = [base_content_type(str(x)) for x in (lim.get("allowed_content_types") or []) if isinstance(x, str) and str(x).strip()]

        body_bytes = body_bytes or b""
        if len(body_bytes) > max_bytes_in:
            self._record(tool=tool, target=url_sanitized, decision="block", reason="request_body_too_large", details={"max_bytes_in": max_bytes_in})
            return ({"type": "http_request", "mode": mode, "target": url_sanitized, "result": "blocked", "metadata": {"reason": "request_body_too_large"}}, None)

        req_headers = normalize_headers(headers)
        if "User-Agent" not in req_headers:
            req_headers["User-Agent"] = "autonomous-pipeline-v2-tool-gateway/0"

        req = urllib.request.Request(url, data=body_bytes or None, headers=req_headers, method=req_method)

        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
                return None

        handlers: list[Any] = [NoRedirect]
        if scheme == "https":
            try:
                ca_path = tls_ca_bundle_path()
                ctx = ssl.create_default_context(cafile=ca_path) if ca_path else ssl.create_default_context()
                handlers.append(urllib.request.HTTPSHandler(context=ctx))
            except Exception as exc:
                self._record(tool=tool, target=url_sanitized, decision="block", reason="tls_context_failed", details={"error": str(exc)})
                return (
                    {"type": "http_request", "mode": mode, "target": url_sanitized, "result": "failure", "metadata": {"reason": "tls_context_failed"}},
                    {"status_code": None, "error": str(exc)},
                )

        opener = urllib.request.build_opener(*handlers)

        try:
            resp = opener.open(req, timeout=float(timeout_ms) / 1000.0)
        except urllib.error.HTTPError as exc:
            resp = exc
        except Exception as exc:
            self._record(
                tool=tool,
                target=url_sanitized,
                decision="allow",
                reason="request_failed",
                details={"error": str(exc), "timeout_ms": timeout_ms},
            )
            return (
                {"type": "http_request", "mode": mode, "target": url_sanitized, "result": "failure", "metadata": {"reason": "request_failed"}},
                {"status_code": None, "error": str(exc)},
            )

        try:
            status_code = int(resp.getcode())  # type: ignore[call-arg]
        except Exception:
            status_code = getattr(resp, "code", None)
        if isinstance(status_code, int) and (status_code == 301 or status_code == 302 or status_code == 303 or status_code == 307 or status_code == 308):
            self._record(tool=tool, target=url_sanitized, decision="allow", reason="redirect_blocked", details={"status_code": status_code})
            return (
                {"type": "http_request", "mode": mode, "target": url_sanitized, "result": "failure", "metadata": {"reason": "redirect_blocked"}},
                {"status_code": status_code, "redirect_blocked": True},
            )

        content_type_raw = ""
        try:
            content_type_raw = str(resp.headers.get("Content-Type") or "")
        except Exception:
            content_type_raw = ""
        ct_base = base_content_type(content_type_raw)
        if allowed_content_types and ct_base not in allowed_content_types:
            self._record(
                tool=tool,
                target=url_sanitized,
                decision="allow",
                reason="content_type_blocked",
                details={"content_type": ct_base, "allowed_content_types": allowed_content_types},
            )
            return (
                {
                    "type": "http_request",
                    "mode": mode,
                    "target": url_sanitized,
                    "result": "failure",
                    "metadata": {"reason": "content_type_blocked", "content_type": ct_base},
                },
                {"status_code": status_code, "content_type": ct_base},
            )

        body = b""
        too_large = False
        try:
            while True:
                chunk = resp.read(64 * 1024)
                if not chunk:
                    break
                if len(body) + len(chunk) > max_bytes_out:
                    too_large = True
                    body += chunk[: max(0, max_bytes_out - len(body))]
                    break
                body += chunk
        except Exception as exc:
            self._record(tool=tool, target=url_sanitized, decision="allow", reason="read_failed", details={"error": str(exc)})
            return (
                {"type": "http_request", "mode": mode, "target": url_sanitized, "result": "failure", "metadata": {"reason": "read_failed"}},
                {"status_code": status_code, "error": str(exc)},
            )

        body_sha256 = sha256_bytes(body)
        out_dir = self._run_dir / "side_effects" / "http_request"
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{self._node_id}.{body_sha256.replace(':', '_')}.body"
        out_path.write_bytes(body)
        body_ref = str(out_path.relative_to(self._repo_root).as_posix())

        if too_large:
            self._record(tool=tool, target=url_sanitized, decision="allow", reason="response_too_large", details={"max_bytes_out": max_bytes_out})
            return (
                {
                    "type": "http_request",
                    "mode": mode,
                    "target": url_sanitized,
                    "result": "failure",
                    "metadata": {"reason": "response_too_large", "max_bytes_out": max_bytes_out, "body_ref": body_ref},
                },
                {"status_code": status_code, "content_type": ct_base, "bytes_out": len(body), "body_sha256": body_sha256, "body_ref": body_ref},
            )

        side_effect: dict[str, Any] = {"type": "http_request", "mode": mode, "target": url_sanitized, "result": "success"}
        self._record(
            tool=tool,
            target=url_sanitized,
            decision="allow",
            reason="ok",
            details={"status_code": status_code, "content_type": ct_base, "bytes_out": len(body), "body_sha256": body_sha256, "body_ref": body_ref},
        )

        return (
            side_effect,
            {"status_code": status_code, "content_type": ct_base, "bytes_out": len(body), "body_sha256": body_sha256, "body_ref": body_ref},
        )


def format_gateway_evidence(gw: ToolGateway) -> dict[str, Any]:
    return {"tool_calls": gw.events}


def json_bytes(obj: Any) -> bytes:
    return (json.dumps(obj, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
