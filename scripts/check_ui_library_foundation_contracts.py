#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")

CONTRACTS = {
    "typography": ROOT / "docs/02-architecture/context/ui-library-typography.contract.v1.json",
    "iconography": ROOT / "docs/02-architecture/context/ui-library-iconography.contract.v1.json",
    "motion": ROOT / "docs/02-architecture/context/ui-library-motion.contract.v1.json",
    "responsive_layout": ROOT / "docs/02-architecture/context/ui-library-responsive-layout.contract.v1.json",
}

REQUIRED_KEYS = {
    "typography": ["version", "contract_id", "subject_id", "foundation_id", "purpose", "canonical_sources", "semantic_scale", "rules", "evidence_requirements", "success_criteria"],
    "iconography": ["version", "contract_id", "subject_id", "foundation_id", "purpose", "runtime_icon_set", "size_tiers", "rules", "evidence_requirements", "success_criteria"],
    "motion": ["version", "contract_id", "subject_id", "foundation_id", "purpose", "canonical_sources", "timing_tokens", "rules", "evidence_requirements", "success_criteria"],
    "responsive_layout": ["version", "contract_id", "subject_id", "foundation_id", "purpose", "canonical_sources", "breakpoint_strategy", "rules", "evidence_requirements", "success_criteria"],
}


def main() -> int:
    problems: list[str] = []

    for contract_id, path in CONTRACTS.items():
        if not path.exists():
            problems.append(f"missing-contract:{contract_id}")
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for key in REQUIRED_KEYS[contract_id]:
            if key not in data:
                problems.append(f"missing-key:{contract_id}:{key}")
        for source in data.get("canonical_sources", []):
            if not (ROOT / source).exists():
                problems.append(f"missing-source:{contract_id}:{source}")

    motion = json.loads(CONTRACTS["motion"].read_text(encoding="utf-8"))
    responsive = json.loads(CONTRACTS["responsive_layout"].read_text(encoding="utf-8"))
    tailwind_path = ROOT / "web/tailwind.config.js"
    tailwind_text = tailwind_path.read_text(encoding="utf-8") if tailwind_path.exists() else ""
    for token in ("motion-duration-fast", "motion-duration-medium", "motion-duration-slow"):
        if token not in tailwind_text:
            problems.append(f"missing-tailwind-motion-token:{token}")
    for easing in ("motion-easing-standard", "motion-easing-enter", "motion-easing-exit"):
        if easing not in tailwind_text:
            problems.append(f"missing-tailwind-easing-token:{easing}")
    if responsive.get("breakpoint_strategy", {}).get("source") != "Tailwind default screens":
        problems.append("invalid-breakpoint-source")
    if motion.get("foundation_id") != "motion":
        problems.append("invalid-motion-foundation-id")

    if problems:
        print("[check_ui_library_foundation_contracts] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_foundation_contracts] OK contracts=%d"
        % len(CONTRACTS)
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
