#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def path_in_repo(relative_path: str) -> Path:
    return ROOT / relative_path


def resolve_authority_path(relative_path: str) -> Path:
    primary = path_in_repo(relative_path)
    if primary.exists():
        return primary
    web_scoped = ROOT / "web" / relative_path
    return web_scoped


def load_json(relative_path: str) -> Any:
    return json.loads(path_in_repo(relative_path).read_text(encoding="utf-8"))


def _merge_source(base: Any, extra: Any) -> dict[str, Any]:
    merged: dict[str, Any] = {}
    if isinstance(extra, dict):
        merged.update(extra)
    if isinstance(base, dict):
        merged.update(base)
    return merged


def _load_items_authority(authority_path: str) -> list[Any]:
    resolved_path = resolve_authority_path(authority_path)
    if not resolved_path.is_file():
        return []
    payload = json.loads(resolved_path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict) and isinstance(payload.get("items"), list):
        return payload["items"]
    return []


def load_json_with_authorities(relative_path: str) -> Any:
    payload = load_json(relative_path)
    if not isinstance(payload, dict):
        return payload

    source = payload.get("source")
    if not isinstance(source, dict):
        return payload

    generated_meta_authority = source.get("generatedMetaAuthority")
    if isinstance(generated_meta_authority, str) and generated_meta_authority.strip():
        authority_path = resolve_authority_path(generated_meta_authority.strip())
        if authority_path.is_file():
            generated_payload = json.loads(authority_path.read_text(encoding="utf-8"))
            if isinstance(generated_payload, dict):
                for key, value in generated_payload.items():
                    if key == "source":
                        payload["source"] = _merge_source(payload.get("source"), value)
                    elif key not in payload:
                        payload[key] = value

    items_authority = source.get("itemsAuthority")
    if "items" not in payload:
        resolved_items: list[Any] = []
        if isinstance(items_authority, str) and items_authority.strip():
            resolved_items = _load_items_authority(items_authority.strip())
        elif isinstance(items_authority, list):
            for authority_entry in items_authority:
                authority_path = str(authority_entry).strip()
                if not authority_path:
                    continue
                resolved_items.extend(_load_items_authority(authority_path))
        if resolved_items:
            payload["items"] = resolved_items

    return payload


def load_text(relative_path: str) -> str:
    return path_in_repo(relative_path).read_text(encoding="utf-8")


def ensure_exists(*relative_paths: str) -> list[str]:
    missing: list[str] = []
    for relative_path in relative_paths:
        if not path_in_repo(relative_path).exists():
            missing.append(relative_path)
    return missing


def read_web_scripts() -> dict[str, str]:
    package_json = load_json("web/package.json")
    scripts = package_json.get("scripts")
    if not isinstance(scripts, dict):
        return {}
    return {str(key): str(value) for key, value in scripts.items()}


def fail(script_name: str, problems: list[str]) -> int:
    print(f"[{script_name}] FAIL")
    for problem in problems:
        print(f"- {problem}")
    return 1


def ok(script_name: str, message: str) -> int:
    print(f"[{script_name}] OK {message}")
    return 0


def ensure_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def ensure_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def main_error(message: str) -> int:
    print(message, file=sys.stderr)
    return 2
