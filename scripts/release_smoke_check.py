#!/usr/bin/env python3
"""
Basit release smoke test script'i iskeleti.

Kullanım:
  python3 scripts/release_smoke_check.py           # varsayılan servis seti
  python3 scripts/release_smoke_check.py access   # yalnız access servisi

Amaç:
- Deploy veya büyük bir değişiklik sonrasında kritik HTTP uçlarına kısa bir
  "smoke test" yapmak.
- Başarılı istek sayısı, hata kodları ve gecikmeleri özetlemek.

Not:
- Bu script yalnız iskelet niteliğindedir; gerçek endpoint listeleri ve
  base URL'ler projeye göre SERVİS_KONFİG içinde güncellenmelidir.
"""

from __future__ import annotations

import os
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Dict, List


@dataclass
class Endpoint:
    path: str
    expect_status: int = 200


@dataclass
class ServiceConfig:
    name: str
    base_url: str
    endpoints: List[Endpoint]


# Örnek servis ve endpoint tanımları.
# Not:
# - base_url değerleri ortam değişkenleri ile override edilebilir.
# - Varsayılan URL'ler lokal geliştirme için örnek olarak verilmiştir;
#   kendi ortamına göre güncellemen beklenir.
SERVIS_KONFIG: Dict[str, ServiceConfig] = {
    # Backend servisleri
    "user-service": ServiceConfig(
        name="user-service",
        base_url=os.environ.get("USER_SERVICE_BASE_URL", "http://localhost:8081"),
        endpoints=[
            # Spring Boot actuator health (varsayılan)
            Endpoint(path="/actuator/health", expect_status=200),
            # Users API v1 – listeleme
            Endpoint(path="/api/v1/users", expect_status=200),
        ],
    ),
    "auth-service": ServiceConfig(
        name="auth-service",
        base_url=os.environ.get("AUTH_SERVICE_BASE_URL", "http://localhost:8082"),
        endpoints=[
            Endpoint(path="/actuator/health", expect_status=200),
            # Auth API v1 – login
            Endpoint(path="/api/v1/auth/sessions", expect_status=200),
        ],
    ),
    "permission-service": ServiceConfig(
        name="permission-service",
        base_url=os.environ.get(
            "PERMISSION_SERVICE_BASE_URL", "http://localhost:8083"
        ),
        endpoints=[
            Endpoint(path="/actuator/health", expect_status=200),
            # Permission API v1 – izin kontrolü
            Endpoint(path="/api/v1/permissions/check", expect_status=200),
        ],
    ),
    # FE / Access modülü (MFE)
    "mfe-access": ServiceConfig(
        name="mfe-access",
        base_url=os.environ.get(
            "MFE_ACCESS_BASE_URL", "https://shell.example.com/access"
        ),
        endpoints=[
            # Access ana ekranı – 200 dönmesi beklenir
            Endpoint(path="/", expect_status=200),
        ],
    ),
}


def http_get(url: str, timeout: float = 5.0) -> int:
    """
    Basit GET isteği; sadece status code döndürür.
    """
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.getcode()


def run_smoke_for_service(cfg: ServiceConfig) -> bool:
    print(f"\n== Release Smoke Test – Service: {cfg.name} ==")
    all_ok = True

    for ep in cfg.endpoints:
        url = cfg.base_url.rstrip("/") + ep.path
        start = time.time()
        try:
            status = http_get(url)
            elapsed_ms = int((time.time() - start) * 1000)
            ok = status == ep.expect_status
            all_ok = all_ok and ok
            mark = "OK" if ok else "FAIL"
            print(f"[{mark}] {url} -> {status} (beklenen: {ep.expect_status}), {elapsed_ms} ms")
        except urllib.error.URLError as e:
            all_ok = False
            print(f"[FAIL] {url} -> URLError: {e}")
        except Exception as e:  # pragma: no cover - beklenmeyen durumlar
            all_ok = False
            print(f"[FAIL] {url} -> Beklenmeyen hata: {e}")

    return all_ok


def main(argv: List[str]) -> int:
    if len(argv) == 2:
        target = argv[1]
        cfg = SERVIS_KONFIG.get(target)
        if not cfg:
            print(f"Bilinmeyen servis: {target}")
            print(f"Tanımlı servisler: {', '.join(SERVIS_KONFIG.keys())}")
            return 1
        ok = run_smoke_for_service(cfg)
        return 0 if ok else 1

    # Argüman verilmezse tüm tanımlı servisler için smoke çalıştır.
    overall_ok = True
    for cfg in SERVIS_KONFIG.values():
        if not run_smoke_for_service(cfg):
            overall_ok = False

    if overall_ok:
        print("\nRelease smoke testleri başarılı ✅")
        return 0

    print("\nRelease smoke testlerinde hatalar var ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
