#!/usr/bin/env python3
import json
import sys
from pathlib import Path


REG = Path("docs/04-operations/ROBOTS-REGISTRY.v0.1.json")
POL = Path("docs/03-delivery/SPECS/robots-policy.v1.json")

ALLOWED_MODES = {"observe", "plan", "apply"}
ALLOWED_KINDS = {"script", "workflow"}


def die(msg: str) -> int:
    print(f"[check_robots_policy] FAIL: {msg}")
    return 1


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    if not REG.exists():
        return die(f"missing registry: {REG}")
    if not POL.exists():
        return die(f"missing policy: {POL}")

    try:
        reg = read_json(REG)
    except Exception as e:
        return die(f"registry json parse error: {e}")
    try:
        pol = read_json(POL)
    except Exception as e:
        return die(f"policy json parse error: {e}")

    if not isinstance(reg.get("version"), str) or not reg["version"]:
        return die("registry missing/invalid: version")
    if not isinstance(reg.get("robots"), list) or not reg["robots"]:
        return die("registry missing/empty: robots")

    if not isinstance(pol.get("version"), str) or not pol["version"]:
        return die("policy missing/invalid: version")
    if "enabled" not in pol or not isinstance(pol["enabled"], bool):
        return die("policy missing/invalid: enabled (bool)")
    if pol.get("default_mode") not in ALLOWED_MODES:
        return die(f"policy invalid default_mode: {pol.get('default_mode')}")

    apply_requires_confirm = bool(pol.get("apply_requires_confirm", False))

    seen_ids: set[str] = set()
    for r in reg["robots"]:
        if not isinstance(r, dict):
            return die("registry robots[] must be objects")

        for k in ["id", "name", "kind", "path", "default_mode", "allowed_modes", "side_effects", "inputs", "outputs"]:
            if k not in r:
                return die(f"robot missing key {k}: {r}")

        rid = r["id"]
        if not isinstance(rid, str) or not rid:
            return die("robot id must be non-empty string")
        if rid in seen_ids:
            return die(f"duplicate robot id: {rid}")
        seen_ids.add(rid)

        if not isinstance(r["name"], str) or not r["name"]:
            return die(f"{rid}: name must be non-empty string")
        if r["kind"] not in ALLOWED_KINDS:
            return die(f"{rid}: kind must be one of {sorted(ALLOWED_KINDS)}")
        if not isinstance(r["path"], str) or not r["path"]:
            return die(f"{rid}: path must be non-empty string")

        default_mode = r["default_mode"]
        if default_mode not in ALLOWED_MODES:
            return die(f"{rid}: invalid default_mode: {default_mode}")

        allowed_modes = r["allowed_modes"]
        if not isinstance(allowed_modes, list) or not allowed_modes:
            return die(f"{rid}: allowed_modes must be non-empty list")
        for m in allowed_modes:
            if m not in ALLOWED_MODES:
                return die(f"{rid}: invalid allowed_mode: {m}")
        if default_mode not in allowed_modes:
            return die(f"{rid}: default_mode must be in allowed_modes")

        if not isinstance(r["side_effects"], list):
            return die(f"{rid}: side_effects must be list")
        if not isinstance(r["inputs"], list):
            return die(f"{rid}: inputs must be list")
        if not isinstance(r["outputs"], list):
            return die(f"{rid}: outputs must be list")

        required_confirm = r.get("required_confirm")
        if required_confirm is not None and (not isinstance(required_confirm, str) or not required_confirm):
            return die(f"{rid}: required_confirm must be null or non-empty string")

        if apply_requires_confirm and ("apply" in allowed_modes) and (required_confirm is None):
            return die(f"{rid}: apply mode requires required_confirm (policy apply_requires_confirm=true)")

    print("[check_robots_policy] PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())

