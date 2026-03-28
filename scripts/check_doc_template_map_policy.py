#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


POLICY_PATH = Path("docs-ssot/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")


def fail(msg: str) -> int:
    print(f"[check_doc_template_map_policy] FAIL: {msg}")
    return 1


def main() -> int:
    if not POLICY_PATH.exists():
        return fail(f"missing policy: {POLICY_PATH}")

    try:
        data = json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return fail(f"invalid json: {exc}")

    version = data.get("version")
    if not isinstance(version, str) or not version.strip():
        return fail("missing/invalid: version")

    templates_dir = data.get("templates_dir")
    if not isinstance(templates_dir, str) or not templates_dir.strip():
        return fail("missing/invalid: templates_dir")

    if not Path(templates_dir).exists():
        return fail(f"templates_dir does not exist: {templates_dir}")

    numbered_heading_style = data.get("numbered_heading_style")
    if not isinstance(numbered_heading_style, bool):
        return fail("missing/invalid: numbered_heading_style (must be bool)")

    mapping = data.get("map")
    if not isinstance(mapping, dict) or not mapping:
        return fail("missing/invalid: map (must be non-empty object)")

    for doc_type, cfg in mapping.items():
        if not isinstance(doc_type, str) or not doc_type.strip():
            return fail("map contains empty doc_type key")
        if not isinstance(cfg, dict):
            return fail(f"map.{doc_type} must be object")

        tmpl = cfg.get("template")
        if not isinstance(tmpl, str) or not tmpl.strip():
            return fail(f"map.{doc_type}.template missing/invalid")
        if not tmpl.endswith(".template.md"):
            return fail(f"map.{doc_type}.template must end with .template.md (got: {tmpl})")

        doc_glob = cfg.get("doc_glob")
        if not isinstance(doc_glob, str) or not doc_glob.strip():
            return fail(f"map.{doc_type}.doc_glob missing/invalid")

        optional = cfg.get("optional", False)
        if not isinstance(optional, bool):
            return fail(f"map.{doc_type}.optional must be bool (got: {type(optional).__name__})")

        required_headings = cfg.get("required_headings")
        if required_headings is not None:
            if not isinstance(required_headings, list) or not required_headings:
                return fail(f"map.{doc_type}.required_headings must be non-empty list")
            for i, h in enumerate(required_headings):
                if not isinstance(h, str) or not h.strip():
                    return fail(f"map.{doc_type}.required_headings[{i}] must be non-empty string")

        heading_contract_mode = cfg.get("heading_contract_mode")
        if heading_contract_mode is not None:
            if not isinstance(heading_contract_mode, str) or not heading_contract_mode.strip():
                return fail(f"map.{doc_type}.heading_contract_mode must be non-empty string")
            allowed = {"subset", "disabled", "template_as_contract"}
            if heading_contract_mode not in allowed:
                return fail(
                    f"map.{doc_type}.heading_contract_mode must be one of {sorted(allowed)} (got: {heading_contract_mode!r})"
                )
            if heading_contract_mode == "subset" and required_headings is None:
                return fail(f"map.{doc_type}: heading_contract_mode=subset requires required_headings")

    print(f"[check_doc_template_map_policy] PASS: {POLICY_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
