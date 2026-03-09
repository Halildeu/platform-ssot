from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError


REQUIRED_LANES = ("unit", "database", "api", "contract", "integration", "e2e")
REQUIRED_EXECUTION_SEQUENCE = ("backend", "database", "api", "frontend", "integration", "e2e")
REQUIRED_SCOPE_LANE_MAP = {
    "backend": "unit",
    "database": "database",
    "api": "api",
    "frontend": "contract",
    "integration": "integration",
    "e2e_gate": "e2e",
}
WORKFLOW_SENTINELS = (
    "module-delivery-contract-check",
    "Script budget precheck",
    "module-lane-unit",
    "module-lane-database",
    "module-lane-api",
    "module-lane-contract",
    "module-lane-integration",
    "module-lane-e2e",
    "module-delivery-gate",
    "python3 ci/check_script_budget.py --out .cache/script_budget/report.json",
    "python3 ci/run_module_delivery_lane.py --lane unit",
    "python3 ci/run_module_delivery_lane.py --lane database",
    "python3 ci/run_module_delivery_lane.py --lane api",
    "python3 ci/run_module_delivery_lane.py --lane contract",
    "python3 ci/run_module_delivery_lane.py --lane integration",
    "python3 ci/run_module_delivery_lane.py --lane e2e",
    "Upload unit lane artifacts",
    "Upload database lane artifacts",
    "Upload api lane artifacts",
    "Upload contract lane artifacts",
    "Upload integration lane artifacts",
    "Upload e2e lane artifacts",
    "actions/upload-artifact@v4",
)
WORKFLOW_SEQUENCE_SENTINELS = (
    "module-lane-database:\n    runs-on: ubuntu-latest\n    needs: [module-lane-unit]",
    "module-lane-api:\n    runs-on: ubuntu-latest\n    needs: [module-lane-database]",
    "module-lane-contract:\n    runs-on: ubuntu-latest\n    needs: [module-lane-api]",
    "module-lane-integration:\n    runs-on: ubuntu-latest\n    needs: [module-lane-contract]",
    "module-lane-e2e:\n    runs-on: ubuntu-latest\n    needs: [module-lane-integration]",
)
PLACEHOLDER_TOKENS = (
    "TODO",
    "PLACEHOLDER",
    "<repo_root>",
    "<command>",
    "configure_me",
)


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _format_validation_error(exc: ValidationError) -> dict[str, Any]:
    path = list(exc.absolute_path)
    schema_path = list(exc.absolute_schema_path)
    return {
        "message": exc.message,
        "path": path,
        "schema_path": schema_path,
    }


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="ci/module_delivery_lanes.v1.json")
    parser.add_argument("--workflow", default=".github/workflows/module-delivery-lanes.yml")
    parser.add_argument("--schema", default="schemas/module-delivery-lanes.schema.v1.json")
    parser.add_argument("--strict", action="store_true")
    return parser.parse_args(argv)


def _fail(error_code: str, message: str, *, details: dict[str, Any] | None = None) -> int:
    payload: dict[str, Any] = {
        "status": "FAIL",
        "error_code": error_code,
        "message": message,
    }
    if isinstance(details, dict) and details:
        payload["details"] = details
    print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
    return 1


def _contains_placeholder(value: str) -> bool:
    raw = str(value or "")
    raw_upper = raw.upper()
    for token in PLACEHOLDER_TOKENS:
        if token.upper() in raw_upper:
            return True
    return False


def _resolve_input_paths(root: Path, args: argparse.Namespace) -> tuple[Path, Path, Path]:
    config_path = Path(str(args.config).strip())
    workflow_path = Path(str(args.workflow).strip())
    schema_path = Path(str(args.schema).strip())
    if not config_path.is_absolute():
        config_path = (root / config_path).resolve()
    else:
        config_path = config_path.resolve()
    if not workflow_path.is_absolute():
        workflow_path = (root / workflow_path).resolve()
    else:
        workflow_path = workflow_path.resolve()
    if not schema_path.is_absolute():
        schema_path = (root / schema_path).resolve()
    else:
        schema_path = schema_path.resolve()
    return config_path, workflow_path, schema_path


def _validate_input_paths(config_path: Path, workflow_path: Path, schema_path: Path) -> tuple[str, str, dict[str, Any]] | None:
    if not config_path.exists():
        return (
            "LANE_CONFIG_MISSING",
            "module delivery lane config file is missing.",
            {"config_path": str(config_path)},
        )
    if not workflow_path.exists():
        return (
            "LANE_WORKFLOW_MISSING",
            "module delivery workflow template is missing.",
            {"workflow_path": str(workflow_path)},
        )
    if not schema_path.exists():
        return (
            "LANE_SCHEMA_MISSING",
            "module delivery lane schema file is missing.",
            {"schema_path": str(schema_path)},
        )
    return None


def _load_config_schema(config_path: Path, schema_path: Path) -> tuple[dict[str, Any], dict[str, Any]] | tuple[None, None]:
    try:
        config_obj = _load_json(config_path)
        schema_obj = _load_json(schema_path)
    except Exception:
        return None, None
    if not isinstance(config_obj, dict) or not isinstance(schema_obj, dict):
        return None, None
    return config_obj, schema_obj


def _validate_config_schema(
    *,
    config_obj: dict[str, Any],
    schema_obj: dict[str, Any],
    config_path: Path,
    schema_path: Path,
) -> tuple[str, str, dict[str, Any]] | None:
    validator = Draft202012Validator(schema_obj)
    validation_errors = [_format_validation_error(exc) for exc in validator.iter_errors(config_obj)]
    if not validation_errors:
        return None
    validation_errors.sort(key=lambda item: (item["path"], item["schema_path"], item["message"]))
    return (
        "LANE_SCHEMA_VALIDATION_FAILED",
        "module delivery lane config does not satisfy schema.",
        {
            "config_path": str(config_path),
            "schema_path": str(schema_path),
            "errors": validation_errors[:10],
        },
    )


def _validate_config_contract(config_obj: dict[str, Any]) -> tuple[str, str, dict[str, Any] | None] | None:
    if config_obj.get("version") != "v1":
        return "LANE_CONFIG_VERSION_INVALID", "module delivery lane config version must be v1.", None
    if config_obj.get("merge_requires_all_green") is not True:
        return "MERGE_GATE_NOT_STRICT", "merge_requires_all_green must be true in lane config.", None
    if config_obj.get("clean_stderr_default") is not True:
        return "CLEAN_STDERR_DEFAULT_NOT_STRICT", "clean_stderr_default must be true in lane config.", None

    scope_lane_map = config_obj.get("scope_lane_map")
    if not isinstance(scope_lane_map, dict):
        return "SCOPE_LANE_MAP_INVALID", "scope_lane_map must be an object.", None
    invalid_scope_map: dict[str, Any] = {}
    for scope, expected_lane in REQUIRED_SCOPE_LANE_MAP.items():
        actual_lane = scope_lane_map.get(scope)
        if actual_lane != expected_lane:
            invalid_scope_map[scope] = {"expected": expected_lane, "actual": actual_lane}
    if invalid_scope_map:
        return (
            "SCOPE_LANE_MAP_MISMATCH",
            "scope_lane_map must map backend/database/api/frontend/integration/e2e_gate to required lane ids.",
            {"mismatches": invalid_scope_map},
        )

    execution_sequence = config_obj.get("execution_sequence")
    if not isinstance(execution_sequence, list) or not execution_sequence:
        return "EXECUTION_SEQUENCE_INVALID", "execution_sequence must be a non-empty list.", None
    sequence_normalized = [str(item) for item in execution_sequence]
    if sequence_normalized != list(REQUIRED_EXECUTION_SEQUENCE):
        return (
            "EXECUTION_SEQUENCE_MISMATCH",
            "execution_sequence must match the required delivery order.",
            {
                "expected_sequence": list(REQUIRED_EXECUTION_SEQUENCE),
                "actual_sequence": sequence_normalized,
            },
        )
    return None


def _validate_lane_commands(config_obj: dict[str, Any], *, strict: bool) -> tuple[str, str, dict[str, Any] | None] | None:
    lanes = config_obj.get("lanes")
    if not isinstance(lanes, dict):
        return "LANES_SECTION_INVALID", "lanes section must be an object.", None

    missing_lanes: list[str] = []
    invalid_commands: list[str] = []
    placeholder_commands: list[str] = []
    missing_required_guards: list[str] = []
    for lane in REQUIRED_LANES:
        lane_obj = lanes.get(lane)
        if not isinstance(lane_obj, dict):
            missing_lanes.append(lane)
            continue
        command = lane_obj.get("command")
        if not isinstance(command, str) or not command.strip():
            invalid_commands.append(lane)
            continue
        if _contains_placeholder(command):
            placeholder_commands.append(lane)
        if lane == "contract" and "python3 ci/check_script_budget.py --out .cache/script_budget/report.json" not in command:
            missing_required_guards.append("contract:script_budget_guard")

    if missing_lanes:
        return "REQUIRED_LANES_MISSING", "required module delivery lanes are missing.", {"missing_lanes": missing_lanes}
    if invalid_commands:
        return "LANE_COMMANDS_INVALID", "lane commands must be non-empty strings.", {"invalid_lanes": invalid_commands}
    if missing_required_guards:
        return (
            "LANE_COMMANDS_MISSING_REQUIRED_GUARDS",
            "critical lane commands must include required guard commands.",
            {"missing_guards": missing_required_guards},
        )
    if placeholder_commands and strict:
        return (
            "LANE_COMMANDS_PLACEHOLDER",
            "strict mode does not allow placeholder lane commands.",
            {"placeholder_lanes": placeholder_commands},
        )
    return None


def _validate_workflow_template(workflow_text: str) -> tuple[str, str, dict[str, Any]] | None:
    missing_sentinels = [item for item in WORKFLOW_SENTINELS if item not in workflow_text]
    if missing_sentinels:
        return (
            "LANE_WORKFLOW_INVALID",
            "module delivery workflow does not include required jobs/commands.",
            {"missing_markers": missing_sentinels},
        )
    missing_sequence_markers = [item for item in WORKFLOW_SEQUENCE_SENTINELS if item not in workflow_text]
    if missing_sequence_markers:
        return (
            "LANE_WORKFLOW_SEQUENCE_INVALID",
            "module delivery workflow must enforce backend->database->api->frontend->integration->e2e order.",
            {"missing_markers": missing_sequence_markers},
        )
    return None


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    root = _repo_root()
    config_path, workflow_path, schema_path = _resolve_input_paths(root, args)

    path_error = _validate_input_paths(config_path, workflow_path, schema_path)
    if path_error:
        return _fail(path_error[0], path_error[1], details=path_error[2])

    config_obj, schema_obj = _load_config_schema(config_path, schema_path)
    if config_obj is None:
        return _fail(
            "LANE_CONFIG_INVALID_JSON",
            "module delivery lane config must be valid JSON.",
            details={"config_path": str(config_path)},
        )
    if schema_obj is None:
        return _fail(
            "LANE_SCHEMA_INVALID_JSON",
            "module delivery lane schema must be valid JSON.",
            details={"schema_path": str(schema_path)},
        )

    schema_error = _validate_config_schema(
        config_obj=config_obj,
        schema_obj=schema_obj,
        config_path=config_path,
        schema_path=schema_path,
    )
    if schema_error:
        return _fail(schema_error[0], schema_error[1], details=schema_error[2])

    config_error = _validate_config_contract(config_obj)
    if config_error:
        return _fail(config_error[0], config_error[1], details=config_error[2])

    lane_error = _validate_lane_commands(config_obj, strict=bool(args.strict))
    if lane_error:
        return _fail(lane_error[0], lane_error[1], details=lane_error[2])

    workflow_error = _validate_workflow_template(workflow_path.read_text(encoding="utf-8"))
    if workflow_error:
        return _fail(workflow_error[0], workflow_error[1], details=workflow_error[2])

    print(
        json.dumps(
            {
                "status": "OK",
                "checked_lanes": list(REQUIRED_LANES),
                "checked_sequence": list(REQUIRED_EXECUTION_SEQUENCE),
                "config_path": str(config_path),
                "schema_path": str(schema_path),
                "workflow_path": str(workflow_path),
                "strict": bool(args.strict),
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
