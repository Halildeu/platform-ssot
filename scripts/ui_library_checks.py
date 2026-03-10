#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def path_in_repo(relative_path: str) -> Path:
    return ROOT / relative_path


def load_json(relative_path: str) -> Any:
    return json.loads(path_in_repo(relative_path).read_text(encoding="utf-8"))


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
