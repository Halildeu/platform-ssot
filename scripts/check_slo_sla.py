#!/usr/bin/env python3
"""
SLO/SLA hedeflerini basit bir metrik anlık görüntüsü üzerinden kontrol eden
script iskeleti.

Kullanım:
  python3 scripts/check_slo_sla.py metrics.json

metrics.json örneği:
{
  "user_service_latency_p95_ms": 420,
  "user_service_5xx_error_rate": 0.3,
  "permission_service_latency_p95_ms": 650,
  "permission_service_5xx_error_rate": 0.5,
  "keycloak_login_success_rate": 99.5,
  "vault_health_status": 0,
  "vault_request_error_rate": 0.2,
  "fe_access_ttfa_p95_s": 5.5,
  "fe_access_grid_fetch_latency_p95_s": 1.8,
  "fe_access_client_error_rate": 1.2
}

Amaç:
- docs/04-operations/SLO-SLA.md içinde tanımlanan bazı SLO hedeflerini
  (ör. P95 latency, error rate) basit bir metrik dosyası üzerinden
  PASS/FAIL olarak raporlamak.

Not:
- Gerçek sistemde bu script, Prometheus veya benzeri bir metrik kaynağından
  veri okumaya genişletilebilir; burada yalnız JSON dosyası üzerinden
  temel iskelet sunulmuştur.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Literal


ROOT = Path(__file__).resolve().parents[1]


Comparator = Literal["lte", "gte"]


@dataclass
class SLO:
    name: str
    metric_key: str
    comparator: Comparator
    threshold: float
    unit: str


# Örnek SLO tanımları (docs/04-operations/SLO-SLA.md ile hizalı).
SLOS: List[SLO] = [
    SLO(
        name="User Service P95 latency",
        metric_key="user_service_latency_p95_ms",
        comparator="lte",
        threshold=500.0,
        unit="ms",
    ),
    SLO(
        name="User Service 5xx error rate",
        metric_key="user_service_5xx_error_rate",
        comparator="lte",
        threshold=1.0,
        unit="%",
    ),
    SLO(
        name="Permission Service P95 latency",
        metric_key="permission_service_latency_p95_ms",
        comparator="lte",
        threshold=700.0,
        unit="ms",
    ),
    SLO(
        name="Permission Service 5xx error rate",
        metric_key="permission_service_5xx_error_rate",
        comparator="lte",
        threshold=1.0,
        unit="%",
    ),
    SLO(
        name="Keycloak login success rate",
        metric_key="keycloak_login_success_rate",
        comparator="gte",
        threshold=99.0,
        unit="%",
    ),
    SLO(
        name="Vault health status",
        metric_key="vault_health_status",
        comparator="lte",
        threshold=0.0,
        unit="code",
    ),
    SLO(
        name="Vault request error rate",
        metric_key="vault_request_error_rate",
        comparator="lte",
        threshold=1.0,
        unit="%",
    ),
    SLO(
        name="MFE Access TTFA P95",
        metric_key="fe_access_ttfa_p95_s",
        comparator="lte",
        threshold=8.0,
        unit="s",
    ),
    SLO(
        name="MFE Access grid fetch latency P95",
        metric_key="fe_access_grid_fetch_latency_p95_s",
        comparator="lte",
        threshold=2.5,
        unit="s",
    ),
    SLO(
        name="MFE Access client error rate",
        metric_key="fe_access_client_error_rate",
        comparator="lte",
        threshold=2.0,
        unit="%",
    ),
]


def load_metrics(path: Path) -> Dict[str, float]:
    if not path.exists():
        raise SystemExit(f"Metrik dosyası bulunamadı: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit("Metrik dosyası JSON object formatında olmalıdır.")
    # Tüm değerleri float'a çevirmeye çalış.
    out: Dict[str, float] = {}
    for k, v in data.items():
        try:
            out[k] = float(v)
        except (TypeError, ValueError):
            print(f"Uyarı: metrik değeri sayısal değil, atlandı: {k}={v!r}")
    return out


def check_slo(slo: SLO, metrics: Dict[str, float]) -> bool:
    if slo.metric_key not in metrics:
        print(f"- {slo.name}: metrik bulunamadı ({slo.metric_key}) ❓")
        return False

    value = metrics[slo.metric_key]
    if slo.comparator == "lte":
        ok = value <= slo.threshold
        cmp_str = "<="
    else:
        ok = value >= slo.threshold
        cmp_str = ">="

    mark = "OK" if ok else "FAIL"
    print(
        f"- {mark}: {slo.name} – {value:.2f}{slo.unit} "
        f"(hedef {cmp_str} {slo.threshold:.2f}{slo.unit})"
    )
    return ok


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Kullanım: python3 scripts/check_slo_sla.py metrics.json")
        return 1

    metrics_path = ROOT / argv[1]
    metrics = load_metrics(metrics_path)

    print(f"SLO/SLA kontrolü – kaynak: {metrics_path}\n")
    all_ok = True
    for slo in SLOS:
        if not check_slo(slo, metrics):
            all_ok = False

    if all_ok:
        print("\nTüm SLO kontrolleri başarılı ✅")
        return 0

    print("\nBazı SLO kontrolleri başarısız ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
