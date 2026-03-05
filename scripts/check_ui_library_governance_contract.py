#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
CONTRACT = ROOT / "docs/02-architecture/context/ui-library-governance.contract.v1.json"

REQUIRED_TOP_KEYS = [
    "version",
    "contract_id",
    "subject_id",
    "benchmark_references",
    "north_star",
    "architecture_contract",
    "ux_catalog_alignment",
    "component_operating_model",
    "quality_attribute_contract",
    "delivery_gates",
    "ai_execution_contract",
    "decision_policy",
]

REQUIRED_ATTRIBUTE_IDS = [
    "kalite_dogruluk",
    "deterministiklik_tekrarlanabilirlik",
    "gozlemlenebilirlik_izleme_olcme",
    "entegrasyon_birlikte_calisabilirlik",
    "uygunluk_risk_guvence_kontrol",
    "sureklilik_dayaniklilik",
    "olceklenebilirlik",
    "maliyet_verimlilik_kaynak",
    "ai_otomasyon",
    "baglam_uyum",
    "paydas_memnuniyeti_deger",
    "surdurulebilirlik_esg_isg_etik",
    "surec_etkinligi_olgunluk",
    "zaman_hiz_ceviklik",
    "guvenlik",
    "gizlilik",
]


def main() -> int:
    if not CONTRACT.exists():
        print("[check_ui_library_governance_contract] FAIL: missing contract")
        return 1

    data = json.loads(CONTRACT.read_text(encoding="utf-8"))
    problems: list[str] = []

    for key in REQUIRED_TOP_KEYS:
        if key not in data:
            problems.append(f"missing-key:{key}")

    seen_ids = {item.get("attribute_id") for item in data.get("quality_attribute_contract", [])}
    for attribute_id in REQUIRED_ATTRIBUTE_IDS:
        if attribute_id not in seen_ids:
            problems.append(f"missing-attribute:{attribute_id}")

    for ref in data.get("benchmark_references", []):
        if not ref.get("source_url", "").startswith("https://"):
            problems.append(f"invalid-benchmark-url:{ref.get('id', 'unknown')}")

    ai_contract = data.get("ai_execution_contract", {})
    if not ai_contract.get("must_read_before_code"):
        problems.append("missing-ai-must-read")

    gates = data.get("delivery_gates", {})
    if "npm -C web run designlab:index" not in gates.get("mandatory_checks", []):
        problems.append("missing-gate:designlab:index")
    if "npm -C web run lint:tailwind" not in gates.get("mandatory_checks", []):
        problems.append("missing-gate:lint:tailwind")
    if "python3 scripts/check_ui_library_ux_alignment.py" not in gates.get("mandatory_checks", []):
        problems.append("missing-gate:check_ui_library_ux_alignment")

    if problems:
        print("[check_ui_library_governance_contract] FAIL")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print(
        "[check_ui_library_governance_contract] OK attributes=%d benchmarks=%d"
        % (
            len(data.get("quality_attribute_contract", [])),
            len(data.get("benchmark_references", [])),
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
