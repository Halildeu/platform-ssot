#!/usr/bin/env python3
"""
Backend mikroservis klasör yapısı kontrolü.

Amaç:
- `docs/00-handbook/BACKEND-PROJECT-LAYOUT.md` içindeki “her servis aynı iç yapı”
  prensibini otomatik gate haline getirmek.
- Yeni servis eklenirken yanlış/eksik iskelet oluşmasını erken yakalamak.

Kapsam:
- `backend/<module>/` altında Maven modülleri (pom.xml olanlar) taranır.
- Modül “mikroservis” olarak kabul edilir:
  - `src/main/java/**/**/*Application.java` dosyası varsa.
  - Bu durumda Dockerfile ve standart src yapısı zorunlu olur.
- Modül “kütüphane” (library) ise:
  - Dockerfile zorunlu değildir; temel Java kaynak yapısı kontrol edilir.

Kullanım:
  python3 scripts/check_backend_service_layout.py
  python3 scripts/check_backend_service_layout.py --module user-service
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = ROOT / "backend"


SERVICE_REQUIRED_DIRS = [
    Path("src/main/java"),
    Path("src/main/resources"),
    Path("src/test/java"),
]

LIB_REQUIRED_DIRS = [
    Path("src/main/java"),
]

SERVICE_REQUIRED_FILES = [
    Path("pom.xml"),
    Path("Dockerfile"),
]

LIB_REQUIRED_FILES = [
    Path("pom.xml"),
]

# BACKEND-PROJECT-LAYOUT örneğine göre “domain service” paketleri (yalnız -service modüllerinde zorunlu).
DOMAIN_REQUIRED_PACKAGES = [
    "config",
    "controller",
    "dto",
    "model",
    "repository",
    "security",
    "service",
]


@dataclass
class ModuleCheck:
    name: str
    path: Path
    is_microservice: bool
    application_classes: List[Path]


def iter_maven_modules() -> List[Path]:
    if not BACKEND_ROOT.exists():
        return []
    modules: List[Path] = []
    for p in sorted(BACKEND_ROOT.iterdir()):
        if not p.is_dir():
            continue
        if (p / "pom.xml").exists():
            modules.append(p)
    return modules


def find_application_classes(module_dir: Path) -> List[Path]:
    java_root = module_dir / "src" / "main" / "java"
    if not java_root.exists():
        return []
    return sorted(java_root.rglob("*Application.java"))


def detect_module(module_dir: Path) -> ModuleCheck:
    apps = find_application_classes(module_dir)
    return ModuleCheck(
        name=module_dir.name,
        path=module_dir,
        is_microservice=len(apps) > 0,
        application_classes=apps,
    )


def any_java_sources(java_root: Path) -> bool:
    return any(java_root.rglob("*.java"))


def has_application_config(resources_root: Path) -> bool:
    if not resources_root.exists():
        return False
    patterns = [
        "application.yml",
        "application.yaml",
        "application.properties",
        "application-*.yml",
        "application-*.yaml",
        "application-*.properties",
    ]
    for pat in patterns:
        if any(resources_root.glob(pat)):
            return True
    return False


def find_base_package_dir(app_class: Path) -> Path:
    # app_class: backend/<module>/src/main/java/.../<X>Application.java
    return app_class.parent


def check_required_paths(
    module: ModuleCheck,
    required_files: List[Path],
    required_dirs: List[Path],
    errors: List[str],
) -> None:
    for rel in required_files:
        if not (module.path / rel).exists():
            errors.append(f"{module.name}: eksik dosya: {rel}")
    for rel in required_dirs:
        if not (module.path / rel).exists():
            errors.append(f"{module.name}: eksik klasör: {rel}")


def check_domain_packages(module: ModuleCheck, errors: List[str]) -> None:
    if not module.name.endswith("-service"):
        return
    if not module.application_classes:
        return

    base = find_base_package_dir(module.application_classes[0])
    for pkg in DOMAIN_REQUIRED_PACKAGES:
        if not (base / pkg).exists():
            errors.append(
                f"{module.name}: eksik paket klasörü: {pkg} (beklenen: {base.relative_to(module.path / 'src/main/java')}/{pkg})"
            )


def check_microservice(module: ModuleCheck) -> List[str]:
    errors: List[str] = []

    check_required_paths(module, SERVICE_REQUIRED_FILES, SERVICE_REQUIRED_DIRS, errors)

    java_root = module.path / "src" / "main" / "java"
    if java_root.exists() and not any_java_sources(java_root):
        errors.append(f"{module.name}: src/main/java altında .java bulunamadı.")

    if len(module.application_classes) == 0:
        errors.append(f"{module.name}: Application main class bulunamadı (*Application.java).")
    elif len(module.application_classes) > 1:
        # Çoklu main class genelde yanlış yapı; açık olsun diye hata yapıyoruz.
        apps = ", ".join(str(p.relative_to(module.path)) for p in module.application_classes[:5])
        errors.append(f"{module.name}: birden fazla *Application.java bulundu: {apps}")

    resources_root = module.path / "src" / "main" / "resources"
    if resources_root.exists() and not has_application_config(resources_root):
        errors.append(f"{module.name}: src/main/resources altında application.* config bulunamadı.")

    # Domain-service paket iskeleti
    check_domain_packages(module, errors)

    return errors


def check_library(module: ModuleCheck) -> List[str]:
    errors: List[str] = []
    check_required_paths(module, LIB_REQUIRED_FILES, LIB_REQUIRED_DIRS, errors)

    java_root = module.path / "src" / "main" / "java"
    if java_root.exists() and not any_java_sources(java_root):
        errors.append(f"{module.name}: src/main/java altında .java bulunamadı.")
    return errors


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--module", help="Sadece belirli bir backend modülünü kontrol et (örn. user-service).")
    args = parser.parse_args(argv[1:])

    if not BACKEND_ROOT.exists():
        print("[check_backend_service_layout] backend/ klasörü bulunamadı (skip).")
        return 0

    modules = iter_maven_modules()
    if args.module:
        modules = [p for p in modules if p.name == args.module]
        if not modules:
            print(f"[check_backend_service_layout] modül bulunamadı: {args.module}")
            return 2

    if not modules:
        print("[check_backend_service_layout] backend altında Maven modülü bulunamadı (skip).")
        return 0

    all_errors: List[str] = []
    print("Backend servis layout kontrolleri:\n")
    for module_dir in modules:
        module = detect_module(module_dir)
        if module.is_microservice:
            errs = check_microservice(module)
            kind = "microservice"
        else:
            errs = check_library(module)
            kind = "library"

        print(f"- {module.name} ({kind})")
        if errs:
            for e in errs:
                print(f"  • {e}")
            all_errors.extend(errs)
        else:
            print("  OK")
        print()

    if all_errors:
        print("[check_backend_service_layout] HATA: backend servis layout sorunları var ❌")
        return 1

    print("[check_backend_service_layout] OK: backend servis layout tutarlı ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

