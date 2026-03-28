#!/usr/bin/env python3
"""
TECH-DESIGN / service dizinleri ile backend kod yapısının temel tutarlılığını
kontrol eden basit script.

Kullanım (repo kökünden):
  python3 scripts/check_arch_vs_code.py

Kontroller:
- docs/02-architecture/services/<servis>/ klasöründeki her servis için:
  - backend/<servis>/ dizini var mı?
  - backend/<servis>/src/main/java altında en az bir Java dosyası var mı?

Amaç:
- TECH-DESIGN dokümanı yazılmış bir servis için en azından temel backend
  modülünün fiziksel olarak var olup olmadığını otomatik kontrol etmek.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]
SERVICES_DOC_DIR = ROOT / "docs" / "02-architecture" / "services"
BACKEND_ROOT = ROOT / "backend"
SERVICE_STATUS_PATH = SERVICES_DOC_DIR / "service-doc-status.v1.json"


@dataclass
class ServiceCheck:
    name: str
    has_doc: bool
    has_backend_dir: bool
    has_java_sources: bool
    status: str
    runtime_expected: bool


def read_service_status_map() -> dict[str, dict]:
    if not SERVICE_STATUS_PATH.exists():
        return {}
    data = json.loads(SERVICE_STATUS_PATH.read_text(encoding="utf-8"))
    rows = data.get("services") or []
    out: dict[str, dict] = {}
    for row in rows:
        name = str(row.get("name") or "").strip()
        if name:
            out[name] = row
    return out


def iter_service_names() -> List[str]:
    if not SERVICES_DOC_DIR.exists():
        return []
    status_map = read_service_status_map()
    # backend-docs gibi "sadece doc" servislerini hariç tutmak için basit filtre.
    names = []
    for p in SERVICES_DOC_DIR.iterdir():
        if not p.is_dir():
            continue
        if p.name == "backend-docs":
            continue
        status_row = status_map.get(p.name) or {}
        if not bool(status_row.get("runtime_expected", True)):
            continue
        names.append(p.name)
    return sorted(names)


def check_service(name: str) -> ServiceCheck:
    status_map = read_service_status_map()
    status_row = status_map.get(name) or {}
    doc_dir = SERVICES_DOC_DIR / name
    has_doc = doc_dir.exists()

    backend_dir = BACKEND_ROOT / name
    has_backend = backend_dir.exists()

    java_dir = backend_dir / "src" / "main" / "java"
    has_java = any(java_dir.rglob("*.java")) if java_dir.exists() else False

    return ServiceCheck(
        name=name,
        has_doc=has_doc,
        has_backend_dir=has_backend,
        has_java_sources=has_java,
        status=str(status_row.get("status", "active")),
        runtime_expected=bool(status_row.get("runtime_expected", True)),
    )


def main() -> int:
    status_map = read_service_status_map()
    service_names = iter_service_names()
    if not service_names:
        print("[check_arch_vs_code] docs/02-architecture/services altında servis bulunamadı (skip).")
        return 0

    checks = [check_service(name) for name in service_names]

    all_ok = True
    print("TECH-DESIGN ↔ backend kod yapısı kontrolleri:\n")
    for c in checks:
        print(f"- Servis: {c.name}")
        print(f"  Status              : {c.status}")
        print(f"  Doküman klasörü     : {'OK' if c.has_doc else 'MISSING'}")
        print(f"  backend/{c.name}/   : {'OK' if c.has_backend_dir else 'MISSING'}")
        print(f"  Java kaynakları     : {'OK' if c.has_java_sources else 'MISSING'}\n")
        if not (c.has_doc and c.has_backend_dir and c.has_java_sources):
            all_ok = False

    skipped = sorted(
        name
        for name, row in status_map.items()
        if not bool(row.get("runtime_expected", True))
    )
    if skipped:
        print(f"Plan-only / archive olarak skip edilen servisler: {skipped}\n")

    if all_ok:
        print("Tüm servisler için TECH-DESIGN ve backend modül yapısı tutarlı görünüyor ✅")
        return 0

    print("Bazı servisler için TECH-DESIGN ↔ backend modül yapısında eksikler var ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
