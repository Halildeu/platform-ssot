#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import secrets
import subprocess
import sys
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from tool_gateway import CapabilitySpec, ToolGateway, format_gateway_evidence, json_bytes, parse_capabilities


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


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


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def repo_root() -> Path:
    here = Path(__file__).resolve()
    project_root = here.parent.parent
    if project_root.name == "autonomous-pipeline-v2":
        return project_root.parent
    return project_root


def posix_relpath(root: Path, p: Path) -> str:
    rel = p.resolve().relative_to(root.resolve())
    return rel.as_posix()


def resolve_registry_item_path(repo: Path, config_root: Path, item: dict[str, Any]) -> Path:
    rel = item.get("path")
    if not isinstance(rel, str) or not rel.strip():
        raise ValueError("invalid_registry_item_path")
    abs_path = (config_root / rel).resolve()
    abs_path.relative_to(repo.resolve())
    if not abs_path.exists():
        raise FileNotFoundError(rel)
    return abs_path


def verify_registry_item_digest(repo: Path, config_root: Path, item: dict[str, Any]) -> None:
    integrity = item.get("integrity")
    integrity = integrity if isinstance(integrity, dict) else {}
    expected = integrity.get("digest")
    if not isinstance(expected, str) or not expected.strip():
        raise ValueError("missing_integrity_digest")
    abs_path = resolve_registry_item_path(repo, config_root, item)
    actual = sha256_file(abs_path)
    if actual != expected:
        raise ValueError(f"integrity_digest_mismatch expected={expected} actual={actual} path={abs_path.relative_to(repo).as_posix()}")


def resolve_signature_path(repo: Path, config_root: Path, item: dict[str, Any]) -> Path:
    integrity = item.get("integrity")
    integrity = integrity if isinstance(integrity, dict) else {}
    sig_ref = integrity.get("signature_ref")
    if not isinstance(sig_ref, str) or not sig_ref.strip():
        raise ValueError("missing_signature_ref")
    sig_path = (config_root / sig_ref).resolve()
    sig_path.relative_to(repo.resolve())
    return sig_path


def verify_registry_item_signature(repo: Path, config_root: Path, item: dict[str, Any], public_keys: list[Path]) -> None:
    integrity = item.get("integrity")
    integrity = integrity if isinstance(integrity, dict) else {}
    signed = bool(integrity.get("signed", False))
    if not signed:
        raise ValueError("item_not_signed")
    file_path = resolve_registry_item_path(repo, config_root, item)
    sig_path = resolve_signature_path(repo, config_root, item)
    if not sig_path.exists():
        raise FileNotFoundError(sig_path.relative_to(repo).as_posix())

    if not public_keys:
        raise ValueError("missing_public_keys")

    last_err: str | None = None
    for pk in public_keys:
        cmd = ["openssl", "dgst", "-sha256", "-verify", str(pk), "-signature", str(sig_path), str(file_path)]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        if proc.returncode == 0:
            return
        last_err = (proc.stdout or "").strip() or f"openssl_exit_code={proc.returncode}"
    raise ValueError(f"signature_verify_failed last_error={last_err}")


def deployment_scope_from_request(request: dict[str, Any]) -> str:
    ext = request.get("extensions")
    ext = ext if isinstance(ext, dict) else {}
    scope = ext.get("deployment_scope") or ext.get("scope") or "dev"
    return str(scope)


def safe_resolve_under(root: Path, rel_path: str) -> Path:
    p = Path(rel_path)
    if p.is_absolute():
        raise ValueError(f"absolute_path_not_allowed: {rel_path}")
    if any(part == ".." for part in p.parts):
        raise ValueError(f"path_traversal_not_allowed: {rel_path}")
    resolved = (root / p).resolve()
    resolved.relative_to(root.resolve())
    return resolved


def resolve_existing_under_repo(repo: Path, rel_path: str, *, alt_rel_path: str | None = None) -> Path:
    p = safe_resolve_under(repo, rel_path)
    if p.exists():
        return p
    if rel_path.startswith("autonomous-pipeline-v2/"):
        alt = rel_path.removeprefix("autonomous-pipeline-v2/")
        alt_p = safe_resolve_under(repo, alt)
        if alt_p.exists():
            return alt_p
    if alt_rel_path:
        alt_p = safe_resolve_under(repo, alt_rel_path)
        if alt_p.exists():
            return alt_p
    return p


def derive_risk_score(request: dict[str, Any]) -> float:
    base = 0.1
    sep = request.get("side_effect_policy") or {}
    effects = (sep.get("effects") or {}) if isinstance(sep, dict) else {}
    file_mode = effects.get("file_write")
    if file_mode == "commit":
        base += 0.4
    elif file_mode == "draft":
        base += 0.1

    inputs = request.get("inputs") or {}
    output_path = inputs.get("output_path")
    if isinstance(output_path, str) and output_path and not output_path.startswith(".autopilot-tmp/"):
        base += 0.3

    return max(0.0, min(1.0, float(base)))


def parse_intent(intent: str) -> tuple[str, str]:
    s = intent.strip()
    if not s:
        raise ValueError("empty_intent")
    if "." not in s:
        raise ValueError(f"invalid_intent: {intent}")
    wf_id, wf_ver = s.split(".", 1)
    if not wf_id.startswith("WF-"):
        raise ValueError(f"invalid_workflow_id: {wf_id}")
    if not wf_ver.startswith("v"):
        raise ValueError(f"invalid_workflow_version: {wf_ver}")
    return wf_id, wf_ver


def apply_intent_to_request(request: dict[str, Any], intent: str) -> dict[str, Any]:
    wf_id, wf_ver = parse_intent(intent)
    out = dict(request)
    wf = out.get("workflow")
    wf = wf if isinstance(wf, dict) else {}
    existing_id = wf.get("id")
    existing_ver = wf.get("version")

    if existing_id and existing_id != wf_id:
        raise ValueError(f"intent_mismatch: request.workflow.id={existing_id} intent={wf_id}")
    if existing_ver and existing_ver != wf_ver:
        raise ValueError(f"intent_mismatch: request.workflow.version={existing_ver} intent={wf_ver}")

    wf["id"] = wf_id
    wf["version"] = wf_ver
    out["workflow"] = wf
    return out


def governor_plan(request: dict[str, Any], markdown_path: str, repo: Path) -> dict[str, Any]:
    budget = request.get("budget")
    budget = budget if isinstance(budget, dict) else {}

    md_size_bytes: int | None = None
    estimated_tokens: int | None = None
    try:
        md_abs = safe_resolve_under(repo, markdown_path)
        if md_abs.exists():
            md_size_bytes = md_abs.stat().st_size
            estimated_tokens = int(md_size_bytes / 4)
    except Exception:
        md_size_bytes = None
        estimated_tokens = None

    limits = {"max_headings": 20, "max_preview_lines": 30, "max_preview_chars": 4000}
    reasons: list[str] = []

    timeout_ms = budget.get("timeout_ms")
    if isinstance(timeout_ms, int) and timeout_ms > 0 and timeout_ms <= 100:
        limits = {"max_headings": 3, "max_preview_lines": 3, "max_preview_chars": 500}
        reasons.append("timeout_ms_low")

    max_cost_usd = budget.get("max_cost_usd")
    if isinstance(max_cost_usd, (int, float)) and float(max_cost_usd) <= 0:
        limits = {"max_headings": 3, "max_preview_lines": 3, "max_preview_chars": 500}
        reasons.append("max_cost_usd_zero")

    max_tokens = budget.get("max_tokens")
    if isinstance(max_tokens, int) and max_tokens > 0:
        if max_tokens <= 128:
            limits = {"max_headings": 3, "max_preview_lines": 3, "max_preview_chars": 500}
            reasons.append("max_tokens_very_low")
        elif max_tokens <= 256:
            limits = {"max_headings": 5, "max_preview_lines": 5, "max_preview_chars": 1200}
            reasons.append("max_tokens_low")
        elif max_tokens <= 512:
            limits = {"max_headings": 10, "max_preview_lines": 10, "max_preview_chars": 2000}
            reasons.append("max_tokens_medium")
        elif estimated_tokens is not None and estimated_tokens > max_tokens:
            limits = {"max_headings": 15, "max_preview_lines": 15, "max_preview_chars": 3000}
            reasons.append("estimated_tokens_exceed_budget")

    mode = "degraded" if reasons else "normal"
    return {
        "schema_version": "governor.plan.v1",
        "budget": budget,
        "inputs": {"markdown_path": markdown_path},
        "estimates": {"markdown_size_bytes": md_size_bytes, "estimated_tokens": estimated_tokens},
        "mode": mode,
        "reasons": reasons,
        "limits": limits,
    }


@dataclass(frozen=True)
class RunContext:
    run_id: str
    attempt: int
    started_at: str
    run_dir: Path
    config_root: Path
    repo_root: Path


def make_node_output_base(
    *,
    node_id: str,
    node_type: str,
    node_version: str | None,
    status: str,
    run: RunContext,
    started_at: float,
    outputs: dict[str, Any] | None = None,
    warnings: list[str] | None = None,
    errors: list[dict[str, Any]] | None = None,
    metrics: dict[str, Any] | None = None,
    side_effects: list[dict[str, Any]] | None = None,
    evidence: dict[str, Any] | None = None,
    quality: dict[str, Any] | None = None,
) -> dict[str, Any]:
    ended_at = time.time()
    duration_ms = int((ended_at - started_at) * 1000)

    out: dict[str, Any] = {
        "schema_version": "node.output.base.v1",
        "node": {"id": node_id, "type": node_type},
        "run": {
            "run_id": run.run_id,
            "attempt": run.attempt,
            "started_at": datetime.fromtimestamp(started_at, tz=timezone.utc).isoformat(),
            "ended_at": datetime.fromtimestamp(ended_at, tz=timezone.utc).isoformat(),
            "duration_ms": duration_ms,
        },
        "status": status,
    }

    if node_version:
        out["node"]["version"] = node_version
    if outputs is not None:
        out["outputs"] = outputs
    if warnings:
        out["warnings"] = warnings
    if errors:
        out["errors"] = errors
    if metrics is not None:
        out["metrics"] = metrics
    if side_effects:
        out["side_effects"] = side_effects
    if evidence is not None:
        out["evidence"] = evidence
    if quality is not None:
        out["quality"] = quality
    return out


def run_mod_a(run: RunContext, markdown_path: str) -> dict[str, Any]:
    t0 = time.time()
    node_id = "MOD-A"
    max_headings = 20
    max_preview_lines = 30
    max_preview_chars = 4000

    governor = load_json(run.run_dir / "governor.json") if (run.run_dir / "governor.json").exists() else {}
    limits = governor.get("limits") if isinstance(governor, dict) else None
    if isinstance(limits, dict):
        mh = limits.get("max_headings")
        mpl = limits.get("max_preview_lines")
        mpc = limits.get("max_preview_chars")
        if isinstance(mh, int) and mh > 0:
            max_headings = mh
        if isinstance(mpl, int) and mpl > 0:
            max_preview_lines = mpl
        if isinstance(mpc, int) and mpc > 0:
            max_preview_chars = mpc

    security_policy_path = run.run_dir / "policies" / "security_policy.json"
    security_policy = load_json(security_policy_path) if security_policy_path.exists() else {}
    cap_path = run.run_dir / "capabilities" / f"{node_id}.json"
    capabilities = parse_capabilities(load_json(cap_path) if cap_path.exists() else {})

    gw = ToolGateway(repo_root=run.repo_root, run_dir=run.run_dir, node_id=node_id, capabilities=capabilities, security_policy=security_policy)

    try:
        content, file_info = gw.read_text(markdown_path)
    except PermissionError as exc:
        return make_node_output_base(
            node_id=node_id,
            node_type="module",
            node_version="v1",
            status="failure",
            run=run,
            started_at=t0,
            errors=[{"code": "tool_denied", "message": str(exc), "details": {"tool": "fs.read_text", "path": markdown_path}}],
            evidence=format_gateway_evidence(gw),
        )
    except Exception as exc:
        return make_node_output_base(
            node_id=node_id,
            node_type="module",
            node_version="v1",
            status="failure",
            run=run,
            started_at=t0,
            errors=[{"code": "markdown_read_failed", "message": str(exc), "details": {"path": markdown_path}}],
            evidence=format_gateway_evidence(gw),
        )

    headings: list[str] = []
    for ln in content.splitlines():
        s = ln.strip()
        if s.startswith("#"):
            headings.append(s[:200])
        if len(headings) >= max_headings:
            break

    preview_lines = content.splitlines()[:max_preview_lines]
    preview = "\n".join(preview_lines)
    if len(preview) > max_preview_chars:
        preview = preview[:max_preview_chars].rstrip() + "\n...[truncated]"

    summary = {
        "markdown_path": markdown_path,
        "sha256": sha256_bytes(content.encode("utf-8", errors="ignore")),
        "stats": {
            "line_count": len(content.splitlines()),
            "word_count": len(content.split()),
            "char_count": len(content),
        },
        "headings": headings,
        "preview": preview,
        "governor": {
            "mode": governor.get("mode"),
            "reasons": governor.get("reasons"),
            "limits": governor.get("limits"),
        },
    }

    evidence = {
        "input_files": [{"path": file_info.get("path") or markdown_path, "sha256": file_info.get("sha256_file") or None}],
        **format_gateway_evidence(gw),
    }

    return make_node_output_base(
        node_id=node_id,
        node_type="module",
        node_version="v1",
        status="success",
        run=run,
        started_at=t0,
        outputs={"analysis_summary": summary},
        evidence=evidence,
    )


def run_approval(run: RunContext, risk_score: float, approval_policy: dict[str, Any]) -> dict[str, Any]:
    t0 = time.time()
    node_id = "APPROVAL"

    thresholds = (approval_policy.get("thresholds") or {}) if isinstance(approval_policy, dict) else {}
    auto_max = float(thresholds.get("auto_approve_max", 0.0))
    human_max = float(thresholds.get("human_review_max", 0.0))

    if risk_score <= auto_max:
        decision = "approved"
        approved = True
    elif risk_score <= human_max:
        decision = "human_review"
        approved = False
    else:
        decision = "rejected"
        approved = False

    outputs = {
        "approved": approved,
        "decision": decision,
        "reason": f"risk_score={risk_score:.3f} auto_max={auto_max:.3f} human_max={human_max:.3f}",
    }
    return make_node_output_base(
        node_id=node_id,
        node_type="approval",
        node_version="v1",
        status="success",
        run=run,
        started_at=t0,
        outputs=outputs,
        evidence={"risk_score": risk_score, "policy": approval_policy},
    )


def resolve_file_write_mode(request: dict[str, Any]) -> str:
    sep = request.get("side_effect_policy")
    if not isinstance(sep, dict):
        return "deny"
    default_mode = sep.get("default_mode") or "deny"
    effects = sep.get("effects") or {}
    if isinstance(effects, dict) and effects.get("file_write"):
        return str(effects.get("file_write"))
    return str(default_mode)


def allowed_write_targets(request: dict[str, Any]) -> list[str]:
    sep = request.get("side_effect_policy")
    if not isinstance(sep, dict):
        return []
    constraints = sep.get("constraints") or {}
    fw = constraints.get("file_write") if isinstance(constraints, dict) else None
    allow = (fw.get("allowed_paths") if isinstance(fw, dict) else None) or []
    return [str(x) for x in allow if isinstance(x, str) and x.strip()]


def run_mod_b(
    run: RunContext,
    analysis_summary: dict[str, Any] | None,
    output_path: str,
    request: dict[str, Any],
    security_policy: dict[str, Any],
    capabilities: CapabilitySpec,
) -> dict[str, Any]:
    t0 = time.time()
    node_id = "MOD-B"

    dry_run = bool(request.get("dry_run", False))
    mode = resolve_file_write_mode(request)
    allowed_prefixes = allowed_write_targets(request)

    gw = ToolGateway(repo_root=run.repo_root, run_dir=run.run_dir, node_id=node_id, capabilities=capabilities, security_policy=security_policy)

    try:
        side_effect, out_info = gw.file_write(
            output_path=output_path,
            content_bytes=json_bytes(analysis_summary or {}),
            mode=mode,
            dry_run=dry_run,
            allowed_commit_paths=allowed_prefixes,
        )
    except PermissionError as exc:
        return make_node_output_base(
            node_id=node_id,
            node_type="module",
            node_version="v1",
            status="failure",
            run=run,
            started_at=t0,
            side_effects=[{"type": "file_write", "mode": mode, "target": output_path, "result": "blocked", "metadata": {"reason": str(exc)}}],
            errors=[{"code": "tool_denied", "message": str(exc), "details": {"tool": "fs.write_file", "path": output_path}}],
            evidence=format_gateway_evidence(gw),
        )
    except Exception as exc:
        return make_node_output_base(
            node_id=node_id,
            node_type="module",
            node_version="v1",
            status="failure",
            run=run,
            started_at=t0,
            side_effects=[{"type": "file_write", "mode": mode, "target": output_path, "result": "blocked", "metadata": {"reason": str(exc)}}],
            errors=[{"code": "file_write_failed", "message": str(exc), "details": {"path": output_path}}],
            evidence=format_gateway_evidence(gw),
        )

    side_effects = [side_effect]
    if side_effect.get("result") == "success":
        return make_node_output_base(
            node_id=node_id,
            node_type="module",
            node_version="v1",
            status="success",
            run=run,
            started_at=t0,
            outputs=out_info or {"written_path": None, "dry_run": dry_run, "mode": mode},
            side_effects=side_effects,
            evidence=format_gateway_evidence(gw),
        )

    is_dry_run = bool(((side_effect.get("metadata") or {}) if isinstance(side_effect.get("metadata"), dict) else {}).get("dry_run", False))
    status = "success" if is_dry_run else "failure"
    errors = None if is_dry_run else [{"code": "side_effect_blocked", "message": "file_write blocked by gateway/policy", "details": side_effect}]

    return make_node_output_base(
        node_id=node_id,
        node_type="module",
        node_version="v1",
        status=status,
        run=run,
        started_at=t0,
        outputs=out_info or {"written_path": None, "dry_run": is_dry_run, "mode": mode},
        side_effects=side_effects,
        errors=errors,
        evidence=format_gateway_evidence(gw),
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="WF-CORE minimal runner (orchestrator v0)")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--request", required=True, help="Request envelope JSON path")
    ap.add_argument("--intent", default="", help="Discovery v0 intent, example: WF-CORE.v1")
    ap.add_argument("--executor-isolation", default="process", choices=["process", "docker"])
    ap.add_argument("--docker-image", default="python:3.11-slim")
    ap.add_argument("--out-root", default=".autopilot-tmp/autonomous-pipeline-v2/runs")
    ap.add_argument("--force", action="store_true", help="Ignore idempotency cache")
    args = ap.parse_args()

    repo = repo_root()
    registry_path = resolve_existing_under_repo(repo, str(args.registry), alt_rel_path="registry.v1.json")
    if not registry_path.exists():
        eprint(f"[runner] FAIL: registry not found: {args.registry}")
        return 2
    request_path = resolve_existing_under_repo(repo, str(args.request))
    if not request_path.exists():
        eprint(f"[runner] FAIL: request not found: {args.request}")
        return 2
    out_root = safe_resolve_under(repo, args.out_root)
    if args.executor_isolation == "docker":
        out_root_rel = out_root.relative_to(repo).as_posix()
        if not out_root_rel.startswith(".autopilot-tmp/") and out_root_rel != ".autopilot-tmp":
            eprint("[runner] FAIL: docker isolation requires --out-root under .autopilot-tmp/")
            return 2

    registry = load_json(registry_path)
    request = load_json(request_path)
    if args.intent:
        try:
            request = apply_intent_to_request(request, str(args.intent))
        except Exception as exc:
            eprint(f"[runner] FAIL: intent preprocess failed: {exc}")
            return 2

    workflow_id = (request.get("workflow") or {}).get("id") or "WF-CORE"
    workflow_version = (request.get("workflow") or {}).get("version") or "v1"
    wf_item_id = f"workflow:{workflow_id}@{workflow_version}"

    items = registry.get("items") or []
    wf_item = next((it for it in items if it.get("id") == wf_item_id), None)
    if not wf_item:
        eprint(f"[runner] FAIL: workflow not found in registry: {wf_item_id}")
        return 2

    config_root = registry_path.parent.resolve()
    try:
        verify_registry_item_digest(repo, config_root, wf_item)
    except Exception as exc:
        eprint(f"[runner] FAIL: workflow integrity digest check failed: {exc}")
        return 2
    wf_path = (config_root / str(wf_item.get("path"))).resolve()
    workflow = load_json(wf_path)

    pol_map: dict[str, dict[str, Any]] = {}
    pol_items: list[dict[str, Any]] = []
    for pref in workflow.get("policy_refs") or []:
        pol_item = next((it for it in items if it.get("id") == pref), None)
        if not pol_item:
            eprint(f"[runner] FAIL: policy not found in registry: {pref}")
            return 2
        try:
            verify_registry_item_digest(repo, config_root, pol_item)
        except Exception as exc:
            eprint(f"[runner] FAIL: policy integrity digest check failed: id={pref} error={exc}")
            return 2
        pol_path = (config_root / str(pol_item.get("path"))).resolve()
        pol_map[pref] = load_json(pol_path)
        pol_items.append(pol_item)

    security_policy = pol_map.get("policy.security@v1") or {}
    scope = deployment_scope_from_request(request)
    sign_cfg = ((security_policy.get("supply_chain") or {}) if isinstance(security_policy, dict) else {}).get("artifact_signing") or {}
    sign_required = bool((sign_cfg.get("required") if isinstance(sign_cfg, dict) else False) or False)
    sign_scopes = (sign_cfg.get("scopes") or []) if isinstance(sign_cfg, dict) else []
    sign_enforced = sign_required and scope in [str(x) for x in sign_scopes if isinstance(x, str)]

    if sign_enforced:
        pubkeys: list[Path] = []
        env_pub = os.environ.get("AUTONOMOUS_PIPELINE_PUBLIC_KEY") or ""
        if env_pub.strip():
            try:
                pubkeys.append(safe_resolve_under(repo, env_pub.strip()))
            except Exception:
                pubkeys = []
        km = sign_cfg.get("key_management") if isinstance(sign_cfg, dict) else None
        refs = (km.get("public_key_refs") if isinstance(km, dict) else None) or []
        for ref in refs:
            if isinstance(ref, str) and ref.strip():
                try:
                    pubkeys.append(safe_resolve_under(repo, ref.strip()))
                except Exception:
                    continue
        pubkeys = [p for p in pubkeys if p.exists()]
        if not pubkeys:
            eprint("[runner] FAIL: signing enforced but no public keys configured (AUTONOMOUS_PIPELINE_PUBLIC_KEY or policy.security key_management.public_key_refs)")
            return 2
        try:
            verify_registry_item_signature(repo, config_root, wf_item, pubkeys)
            for it in pol_items:
                verify_registry_item_signature(repo, config_root, it, pubkeys)
        except Exception as exc:
            eprint(f"[runner] FAIL: signature verification failed: {exc}")
            return 2

    tenant_id = str(request.get("tenant_id") or "tenant")
    idem_key = str(request.get("idempotency_key") or "")
    if idem_key:
        idem_dir = out_root.parent / "idempotency"
        idem_dir.mkdir(parents=True, exist_ok=True)
        safe_name = "".join(ch if ch.isalnum() or ch in {"_", "-", "."} else "_" for ch in f"{tenant_id}__{idem_key}")[:180]
        idem_path = idem_dir / f"{safe_name}.json"
        if idem_path.exists() and not args.force:
            cached = load_json(idem_path)
            run_dir = cached.get("run_dir")
            print(f"[runner] idempotency_hit: tenant_id={tenant_id} idempotency_key={idem_key} run_dir={run_dir}")
            return 0
    else:
        idem_path = None

    run_id = str(uuid.uuid4())
    started_at = utc_now_iso()
    run_dir = (out_root / run_id).resolve()
    run_dir.mkdir(parents=True, exist_ok=True)

    trace_lines: list[str] = []

    def trace(msg: str) -> None:
        line = f"{utc_now_iso()} {msg}"
        trace_lines.append(line)

    def docker_exec_node(node_id: str, *, attempt: int) -> int:
        try:
            uid = os.getuid()
            gid = os.getgid()
            user_arg = f"{uid}:{gid}"
        except Exception:
            user_arg = ""

        repo_abs = str(repo.resolve())
        autopilot_abs = str((repo / ".autopilot-tmp").resolve())
        Path(autopilot_abs).mkdir(parents=True, exist_ok=True)
        run_dir_rel = run_dir.relative_to(repo).as_posix()
        exec_node_rel = posix_relpath(repo, Path(__file__).resolve().parent / "execute_node.py")

        cmd = [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            "--read-only",
            "--tmpfs",
            "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "-v",
            f"{repo_abs}:/repo:ro",
            "-v",
            f"{autopilot_abs}:/repo/.autopilot-tmp:rw",
            "-w",
            "/repo",
        ]
        if user_arg:
            cmd.extend(["--user", user_arg])
        cmd.extend(
            [
                str(args.docker_image),
                "python3",
                exec_node_rel,
                "--run-dir",
                run_dir_rel,
                "--node",
                node_id,
                "--attempt",
                str(attempt),
            ]
        )
        trace(f"docker_exec node={node_id} image={args.docker_image}")
        p = subprocess.run(cmd)
        return int(p.returncode)

    trace(f"run_started run_id={run_id} workflow={workflow_id}@{workflow_version}")
    write_json(run_dir / "request.json", request)

    # Executor inputs (snapshot): policies + per-node capabilities.
    write_json(run_dir / "policies" / "security_policy.json", security_policy)
    for node in workflow.get("nodes") or []:
        if not isinstance(node, dict):
            continue
        node_id = str(node.get("id") or "")
        if not node_id:
            continue
        node_type = str(node.get("type") or "")
        cap_raw = node.get("capabilities") or {}
        cap = parse_capabilities(cap_raw)
        if node_type == "module" and not cap.allowed_tools:
            eprint(f"[runner] FAIL: capabilities.allowed_tools missing for node={node_id}")
            return 2
        write_json(run_dir / "capabilities" / f"{node_id}.json", cap_raw)

    provenance: dict[str, Any] = {
        "schema_version": "provenance.v1",
        "run_id": run_id,
        "started_at": started_at,
        "workflow": {"id": workflow_id, "version": workflow_version},
        "digests": {
            "registry": {"path": str(registry_path.relative_to(repo).as_posix()), "sha256": sha256_file(registry_path)},
            "workflow": {"path": str(wf_path.relative_to(repo).as_posix()), "sha256": sha256_file(wf_path)},
            "policies": [],
        },
        "git": {
            "branch": os.popen("git branch --show-current 2>/dev/null").read().strip() or None,
            "sha": os.popen("git rev-parse --short HEAD 2>/dev/null").read().strip() or None,
        },
    }

    for pref, pol in pol_map.items():
        pol_item = next((it for it in items if it.get("id") == pref), None)
        if pol_item:
            pol_path = (config_root / str(pol_item.get("path"))).resolve()
            provenance["digests"]["policies"].append(
                {"id": pref, "path": str(pol_path.relative_to(repo).as_posix()), "sha256": sha256_file(pol_path)}
            )

    risk_score = request.get("risk_score")
    if risk_score is None:
        risk_score = derive_risk_score(request)
    risk_score = float(risk_score)

    inputs = request.get("inputs") or {}
    markdown_path = str(inputs.get("markdown_path") or "")
    output_path = str(inputs.get("output_path") or ".autopilot-tmp/autonomous-pipeline-v2/out/analysis_summary.json")

    governor = governor_plan(request, markdown_path, repo)
    write_json(run_dir / "governor.json", governor)
    trace(f"governor mode={governor.get('mode')} reasons={','.join(governor.get('reasons') or [])}")

    run_ctx = RunContext(
        run_id=run_id,
        attempt=1,
        started_at=started_at,
        run_dir=run_dir,
        config_root=config_root,
        repo_root=repo,
    )

    trace("node_start MOD-A")
    if args.executor_isolation == "docker":
        code = docker_exec_node("MOD-A", attempt=1)
        if code not in {0, 1}:
            trace(f"node_end MOD-A executor_error code={code}")
            eprint(f"[runner] FAIL: docker exec failed for node=MOD-A code={code}")
            return 2
        mod_a_out_path = run_dir / "node_outputs" / "MOD-A.json"
        if not mod_a_out_path.exists():
            eprint("[runner] FAIL: MOD-A output missing after docker exec")
            return 2
        mod_a_out = load_json(mod_a_out_path)
    else:
        mod_a_out = run_mod_a(run_ctx, markdown_path)
        write_json(run_dir / "node_outputs" / "MOD-A.json", mod_a_out)
    trace(f"node_end MOD-A status={mod_a_out.get('status')}")

    if mod_a_out.get("status") != "success":
        trace("run_failed reason=MOD-A_failed")
        write_json(run_dir / "provenance.json", provenance)
        (run_dir / "trace.log").write_text("\n".join(trace_lines) + "\n", encoding="utf-8")
        return 1

    analysis_summary = (mod_a_out.get("outputs") or {}).get("analysis_summary")

    trace("node_start APPROVAL")
    approval_node = next((n for n in workflow.get("nodes") or [] if n.get("id") == "APPROVAL"), {}) or {}
    approval_policy = approval_node.get("policy") or {}
    approval_out = run_approval(run_ctx, risk_score, approval_policy)
    write_json(run_dir / "node_outputs" / "APPROVAL.json", approval_out)
    trace(f"node_end APPROVAL approved={(approval_out.get('outputs') or {}).get('approved')}")

    approval_outputs = approval_out.get("outputs") or {}
    approved = bool(approval_outputs.get("approved", False))
    decision = str(approval_outputs.get("decision") or "unknown")

    if approved:
        trace("node_start MOD-B")
        mod_b_caps = parse_capabilities((next((n for n in workflow.get("nodes") or [] if n.get("id") == "MOD-B"), {}) or {}).get("capabilities"))
        if args.executor_isolation == "docker":
            code = docker_exec_node("MOD-B", attempt=1)
            if code not in {0, 1}:
                trace(f"node_end MOD-B executor_error code={code}")
                eprint(f"[runner] FAIL: docker exec failed for node=MOD-B code={code}")
                return 2
            mod_b_out_path = run_dir / "node_outputs" / "MOD-B.json"
            if not mod_b_out_path.exists():
                eprint("[runner] FAIL: MOD-B output missing after docker exec")
                return 2
            mod_b_out = load_json(mod_b_out_path)
        else:
            mod_b_out = run_mod_b(run_ctx, analysis_summary, output_path, request, security_policy, mod_b_caps)
            write_json(run_dir / "node_outputs" / "MOD-B.json", mod_b_out)
        trace(f"node_end MOD-B status={mod_b_out.get('status')}")
    else:
        mod_b_out = make_node_output_base(
            node_id="MOD-B",
            node_type="module",
            node_version="v1",
            status="skipped",
            run=run_ctx,
            started_at=time.time(),
            outputs={"skipped_reason": decision},
        )
        write_json(run_dir / "node_outputs" / "MOD-B.json", mod_b_out)
        trace(f"node_skip MOD-B reason={decision}")

    if decision == "human_review":
        approval_token = secrets.token_urlsafe(24)
        approval_token_sha256 = sha256_bytes(approval_token.encode("utf-8"))
        (run_dir / "approval_token.txt").write_text(approval_token + "\n", encoding="utf-8")
        write_json(
            run_dir / "suspend.json",
            {
                "schema_version": "suspend.v1",
                "run_id": run_id,
                "node": "APPROVAL",
                "reason": approval_outputs.get("reason"),
                "approval": {
                    "required": True,
                    "token_sha256": approval_token_sha256,
                    "token_file": str((run_dir / "approval_token.txt").relative_to(repo).as_posix()),
                },
                "created_at": utc_now_iso(),
            },
        )
        trace("run_suspended reason=human_review")

    evidence = {
        "schema_version": "evidence.pack.v1",
        "run_id": run_id,
        "workflow": {"id": workflow_id, "version": workflow_version},
        "request_ref": str((run_dir / "request.json").relative_to(repo).as_posix()),
        "governor_ref": str((run_dir / "governor.json").relative_to(repo).as_posix()),
        "node_outputs": {
            "MOD-A": str((run_dir / "node_outputs" / "MOD-A.json").relative_to(repo).as_posix()),
            "APPROVAL": str((run_dir / "node_outputs" / "APPROVAL.json").relative_to(repo).as_posix()),
            "MOD-B": str((run_dir / "node_outputs" / "MOD-B.json").relative_to(repo).as_posix()),
        },
        "side_effects": (mod_b_out.get("side_effects") or []),
    }

    final_status = "unknown"
    if mod_a_out.get("status") != "success":
        final_status = "failed"
    elif decision == "human_review":
        final_status = "suspended"
    elif decision == "rejected":
        final_status = "rejected"
    elif approved and mod_b_out.get("status") == "success":
        final_status = "completed"
    elif approved and mod_b_out.get("status") != "success":
        final_status = "failed"
    else:
        final_status = "completed"

    write_json(
        run_dir / "run_status.json",
        {
            "schema_version": "run.status.v1",
            "run_id": run_id,
            "workflow": {"id": workflow_id, "version": workflow_version},
            "risk_score": risk_score,
            "approval": {"approved": approved, "decision": decision},
            "status": final_status,
            "created_at": utc_now_iso(),
        },
    )

    write_json(run_dir / "evidence.json", evidence)
    write_json(run_dir / "provenance.json", provenance)
    (run_dir / "trace.log").write_text("\n".join(trace_lines) + "\n", encoding="utf-8")

    if idem_path is not None:
        write_json(
            idem_path,
            {
                "tenant_id": tenant_id,
                "idempotency_key": idem_key,
                "run_id": run_id,
                "run_dir": str(run_dir.relative_to(repo).as_posix()),
                "created_at": utc_now_iso(),
            },
        )

    run_dir_rel = run_dir.relative_to(repo).as_posix()
    if final_status == "completed":
        print(f"[runner] PASS run_dir={run_dir_rel}")
        return 0
    if final_status == "suspended":
        print(f"[runner] SUSPEND run_dir={run_dir_rel}")
        return 10
    if final_status == "rejected":
        print(f"[runner] REJECT run_dir={run_dir_rel}")
        return 11
    print(f"[runner] FAIL run_dir={run_dir_rel}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
