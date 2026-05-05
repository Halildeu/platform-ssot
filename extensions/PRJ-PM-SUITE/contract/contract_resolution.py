#!/usr/bin/env python3
"""Shared contract-path resolver for the feature-execution governance plane.

This module exists because the bridge policy supports four ways of declaring
which feature contracts are in scope, and **both** the checker
(`check_feature_execution_contract.py`) and the delivery-session packet
builder (`build_delivery_session_packet.py`) must agree on which contracts
are active. Duplicating the resolution logic in two places lets DRAFT /
INACTIVE / stale contracts leak through one gate while being blocked by
another (Codex iter-6 REVISE blocker).

Resolution priority (highest first):

    1. policy.contract_paths      -- CLI / policy explicit list
    2. policy.active_features_path -- governance source-of-truth index
    3. policy.contract_glob        -- migration fallback only
    4. policy.contract_path        -- single-feature legacy backward-compat

The `active_features_path` index is the canonical governance source-of-truth
once available: only entries with `status == "ACTIVE"` are returned, so
DRAFT / INACTIVE / ARCHIVED contracts that still live under
`extensions/PRJ-PM-SUITE/contract/features/` are not silently picked up by
the glob fallback.

The index is validated fail-closed: a missing index file when
`active_features_path` is set is a hard error, as are structural
violations (root not an object, duplicate `feature_id`, unknown `status`,
path traversal in `contract_path`, missing target file for an `ACTIVE`
entry, ...). A `DRAFT` or `INACTIVE` entry whose contract is missing is
tolerated -- the index is still authoritative, the entry is just skipped.
"""

from __future__ import annotations

import glob
import json
from pathlib import Path
from typing import Any, Iterable

ALLOWED_STATUSES: tuple[str, ...] = ("ACTIVE", "DRAFT", "INACTIVE", "ARCHIVED")


class GovernanceError(Exception):
    """Raised when the contract-resolution input is structurally invalid.

    The error message is a short machine-friendly token (e.g.
    `active_features:duplicate_feature_id:foo`) so callers can surface it
    inside their JSON report's `errors` list verbatim.
    """


def _normalize_rel(path: str) -> str:
    """Normalize a relative path: strip whitespace, fold ``\\`` to ``/`` and
    drop leading ``./`` segments. Mirrors the helper in the checker."""
    norm = str(path or "").strip().replace("\\", "/")
    while norm.startswith("./"):
        norm = norm[2:]
    return norm


def _path_is_traversal(rel: str) -> bool:
    """True if `rel` looks like an attempt to escape the repo root.

    We treat absolute paths and any path containing a ``..`` component as
    traversal. The check is intentionally string-based: by the time the
    path is resolved on disk it is already too late to refuse.
    """
    norm = _normalize_rel(rel)
    if not norm:
        return False
    if norm.startswith("/"):
        return True
    parts = norm.split("/")
    return ".." in parts


def _str_value(obj: Any, key: str) -> str:
    return str(obj.get(key) or "").strip() if isinstance(obj, dict) else ""


def _load_active_features_index(repo_root: Path, rel_path: str) -> dict[str, Any]:
    """Read + validate the active_features index file.

    Raises ``GovernanceError`` for any structural violation. Successful
    return guarantees that every entry has `feature_id`, `contract_path`
    and `status`, that `feature_id` is unique across the file, and that
    every `ACTIVE` entry's `contract_path` exists on disk.
    """
    rel = _normalize_rel(rel_path)
    full = (repo_root.resolve() / rel).resolve()
    if not full.exists():
        raise GovernanceError(f"active_features:index_missing:{rel}")

    try:
        obj = json.loads(full.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise GovernanceError(f"active_features:invalid_json:{rel}:{exc.msg}") from exc

    if not isinstance(obj, dict):
        raise GovernanceError("active_features:root_must_be_object")

    entries = obj.get("active_features")
    if not isinstance(entries, list):
        raise GovernanceError("active_features:array_field_missing")

    seen_ids: set[str] = set()
    for idx, entry in enumerate(entries):
        if not isinstance(entry, dict):
            raise GovernanceError(f"active_features:entry_must_be_object:{idx}")
        for field in ("feature_id", "contract_path", "status"):
            if field not in entry or not str(entry.get(field) or "").strip():
                raise GovernanceError(
                    f"active_features:entry_missing_{field}:{idx}"
                )

        fid = str(entry["feature_id"]).strip()
        if fid in seen_ids:
            raise GovernanceError(f"active_features:duplicate_feature_id:{fid}")
        seen_ids.add(fid)

        status = str(entry["status"]).strip()
        if status not in ALLOWED_STATUSES:
            raise GovernanceError(
                f"active_features:invalid_status:{status}:{fid}"
            )

        contract_path = str(entry["contract_path"]).strip()
        if _path_is_traversal(contract_path):
            raise GovernanceError(
                f"active_features:path_traversal:{contract_path}:{fid}"
            )

        # ACTIVE entries must point at a real file. DRAFT / INACTIVE /
        # ARCHIVED entries are allowed to be missing transiently (e.g. a
        # contract being introduced or retired across PRs).
        if status == "ACTIVE":
            full_cpath = (repo_root.resolve() / _normalize_rel(contract_path)).resolve()
            if not full_cpath.exists():
                raise GovernanceError(
                    f"active_features:active_contract_missing:{contract_path}:{fid}"
                )

    return obj


def _entries_to_paths(entries: Iterable[dict[str, Any]]) -> list[str]:
    paths: list[str] = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        if str(entry.get("status") or "").strip() != "ACTIVE":
            continue
        rel = _normalize_rel(str(entry.get("contract_path") or ""))
        if rel:
            paths.append(rel)
    # Stable sort: deterministic gate output even if the index is reordered.
    return sorted(set(paths))


def _expand_glob(repo_root: Path, pattern: str) -> list[str]:
    """Expand a glob relative to `repo_root` and return repo-relative paths.

    Both sides of the relative_to() call are `.resolve()`d so symlinked
    temp directories on macOS (`/var/folders` -> `/private/var/folders`)
    don't accidentally make every match look "outside" the repo root.
    """
    resolved_root = repo_root.resolve()
    matches = glob.glob(str(resolved_root / pattern))
    rels: set[str] = set()
    for m in sorted(matches):
        path = Path(m)
        if not path.is_file():
            continue
        try:
            rel = _normalize_rel(str(path.resolve().relative_to(resolved_root)))
        except ValueError:
            # Glob pattern matched a file outside the repo root -- skip.
            continue
        if rel:
            rels.add(rel)
    return sorted(rels)


def resolve_active_contracts(
    repo_root: Path, policy: dict[str, Any]
) -> tuple[list[str], str]:
    """Return ``(relative_contract_paths, source_label)`` for the policy.

    `source_label` is one of:
      * ``"contract_paths"``       -- explicit list (CLI override).
      * ``"active_features_path"`` -- governance source-of-truth index.
      * ``"contract_glob"``        -- migration fallback expansion.
      * ``"contract_path"``        -- legacy single-file backward-compat.
      * ``"none"``                 -- nothing matched; caller must fail.

    Raises ``GovernanceError`` if `active_features_path` is configured
    and the file is missing or structurally invalid.
    """
    if not isinstance(policy, dict):
        return [], "none"

    # 1. Explicit list -- CLI / policy author has spelled out the contracts.
    explicit_paths = policy.get("contract_paths")
    if isinstance(explicit_paths, list):
        rels = sorted(
            {
                _normalize_rel(str(p))
                for p in explicit_paths
                if isinstance(p, str) and str(p).strip()
            }
        )
        if rels:
            return rels, "contract_paths"

    # 2. active_features.v1.json governance index (source-of-truth).
    active_index_rel = str(policy.get("active_features_path") or "").strip()
    if active_index_rel:
        index = _load_active_features_index(repo_root, active_index_rel)
        active_paths = _entries_to_paths(index.get("active_features") or [])
        # Note: an empty ACTIVE list is intentional -- it means the gate
        # MUST refuse to fall through to the glob (otherwise DRAFT contracts
        # would leak in via the migration fallback). We return [] with the
        # index source label so callers can surface a clear error.
        return active_paths, "active_features_path"

    # 3. Migration glob fallback.
    glob_pattern = str(policy.get("contract_glob") or "").strip()
    if glob_pattern:
        rels = _expand_glob(repo_root, glob_pattern)
        if rels:
            return rels, "contract_glob"

    # 4. Legacy single-file backward-compat.
    single = str(policy.get("contract_path") or "").strip()
    if single:
        return [_normalize_rel(single)], "contract_path"

    return [], "none"


__all__ = [
    "ALLOWED_STATUSES",
    "GovernanceError",
    "resolve_active_contracts",
]
