#!/usr/bin/env python3
"""
Web MFE (apps/*) klasör yapısı kontrolü.

Amaç:
- `docs/00-handbook/WEB-PROJECT-LAYOUT.md` içinde tarif edilen MFE yapılarını
  otomatik gate haline getirmek.
- Yeni MFE'lerin farklı/dağınık yapılarla oluşmasını engellemek.

Kural seti (özet):
- Her MFE: `web/apps/<mfe>/package.json` ve `web/apps/<mfe>/src/` içermelidir.
- "Modern" MFE: `src/app` + (`src/features` veya `src/pages`) mevcutsa kabul edilir.
  - Zorunlu: `src/app`, `src/features`, `src/pages`
  - Önerilen: `src/entities`, `src/widgets`, `src/shared`
  - Legacy klasörleri (`src/components`, `src/hooks`, ...) modern MFE'de yasaktır.
- "Legacy/minimal" MFE'ler sadece allowlist içinde kabul edilir.

Kullanım:
  python3 scripts/check_web_mfe_layout.py
  python3 scripts/check_web_mfe_layout.py --mfe mfe-users
  python3 scripts/check_web_mfe_layout.py --allow-legacy
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Set


ROOT = Path(__file__).resolve().parents[1]
WEB_ROOT = ROOT / "web"
APPS_ROOT = WEB_ROOT / "apps"


# Mevcut repoda legacy olan MFE'ler: yeni geliştirmelerde bu listeyi küçültmek hedeflenir.
LEGACY_ALLOWED_MFES: Set[str] = {
    "mfe-audit",
    "mfe-reporting",
    "mfe-ethic",
    "mfe-suggestions",
    "mfe-schema-explorer",
}


MODERN_REQUIRED_DIRS = [
    Path("src/app"),
    Path("src/features"),
    Path("src/pages"),
]

MODERN_RECOMMENDED_DIRS = [
    Path("src/entities"),
    Path("src/widgets"),
    Path("src/shared"),
]

LEGACY_ROOT_MARKERS = [
    Path("src/components"),
    Path("src/hooks"),
    Path("src/services"),
    Path("src/utils"),
]

LEGACY_APP_MARKERS = [
    Path("src/app/components"),
    Path("src/app/hooks"),
    Path("src/app/services"),
    Path("src/app/utils"),
]

ENTRYPOINT_CANDIDATES = [
    Path("src/main.tsx"),
    Path("src/index.tsx"),
    Path("src/app/main.tsx"),
    Path("src/app/index.tsx"),
    Path("src/bootstrap.tsx"),
]


@dataclass
class MfeCheck:
    name: str
    path: Path
    style: str  # modern | legacy | minimal | unknown


def iter_mfes() -> List[Path]:
    if not APPS_ROOT.exists():
        return []
    mfes: List[Path] = []
    for p in sorted(APPS_ROOT.iterdir()):
        if not p.is_dir():
            continue
        if (p / "package.json").exists():
            mfes.append(p)
    return mfes


def detect_style(mfe_dir: Path) -> str:
    src = mfe_dir / "src"
    if not src.exists():
        return "unknown"

    has_app = (src / "app").exists()
    has_modern_markers = any((src / n).exists() for n in ["features", "pages", "entities", "widgets", "shared"])
    has_legacy_markers = any((mfe_dir / p).exists() for p in (LEGACY_ROOT_MARKERS + LEGACY_APP_MARKERS))

    if has_app and ((src / "features").exists() or (src / "pages").exists()):
        return "modern"
    if has_legacy_markers:
        return "legacy"

    # Minimal (tek dosya ile bootstrap eden MFE'ler)
    if any((mfe_dir / p).exists() for p in ENTRYPOINT_CANDIDATES) and any(
        (src / p).exists() for p in [Path("App.tsx"), Path("bootstrap.tsx"), Path("index.tsx"), Path("main.tsx")]
    ):
        return "minimal"

    if has_app and has_modern_markers:
        # features/pages olmayabilir ama app + modern marker varsa modern say.
        return "modern"

    return "unknown"


def has_entrypoint(mfe_dir: Path) -> bool:
    return any((mfe_dir / p).exists() for p in ENTRYPOINT_CANDIDATES)


def check_modern(mfe_dir: Path, errors: List[str], warnings: List[str]) -> None:
    for rel in MODERN_REQUIRED_DIRS:
        if not (mfe_dir / rel).exists():
            errors.append(f"{mfe_dir.name}: eksik klasör: {rel}")

    for rel in MODERN_RECOMMENDED_DIRS:
        if not (mfe_dir / rel).exists():
            warnings.append(f"{mfe_dir.name}: önerilen klasör eksik: {rel}")

    # Modern MFE'de legacy root klasörleri istemiyoruz.
    for rel in LEGACY_ROOT_MARKERS:
        if (mfe_dir / rel).exists():
            errors.append(f"{mfe_dir.name}: modern yapıda yasak legacy klasör: {rel}")

    if not has_entrypoint(mfe_dir):
        errors.append(f"{mfe_dir.name}: entrypoint bulunamadı (beklenen: {', '.join(str(p) for p in ENTRYPOINT_CANDIDATES)})")


def check_legacy_or_minimal(mfe_dir: Path, errors: List[str]) -> None:
    # Legacy/minimal için en azından src ve bir entrypoint bekliyoruz.
    if not (mfe_dir / "src").exists():
        errors.append(f"{mfe_dir.name}: src/ klasörü yok.")
    if not has_entrypoint(mfe_dir):
        errors.append(f"{mfe_dir.name}: entrypoint bulunamadı (legacy/minimal).")


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mfe", help="Sadece tek bir MFE kontrol et (örn. mfe-users).")
    parser.add_argument(
        "--allow-legacy",
        action="store_true",
        help="Allowlist dışında legacy/minimal MFE'lere izin ver (varsayılan: sadece allowlist).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Önerilen klasör eksiklerini de hata say (modern MFE'ler için).",
    )
    args = parser.parse_args(argv[1:])

    mfes = iter_mfes()
    if args.mfe:
        mfes = [p for p in mfes if p.name == args.mfe]
        if not mfes:
            print(f"[check_web_mfe_layout] MFE bulunamadı: {args.mfe}")
            return 2

    if not mfes:
        print("[check_web_mfe_layout] web/apps altında MFE bulunamadı (skip).")
        return 0

    errors: List[str] = []
    warnings: List[str] = []

    print("Web MFE layout kontrolleri:\n")
    for mfe_dir in mfes:
        style = detect_style(mfe_dir)
        print(f"- {mfe_dir.name} ({style})")

        if not (mfe_dir / "package.json").exists():
            errors.append(f"{mfe_dir.name}: package.json bulunamadı.")
        if not (mfe_dir / "src").exists():
            errors.append(f"{mfe_dir.name}: src/ klasörü bulunamadı.")

        if style == "modern":
            check_modern(mfe_dir, errors, warnings)
        elif style in ("legacy", "minimal"):
            allowed = args.allow_legacy or (mfe_dir.name in LEGACY_ALLOWED_MFES)
            if not allowed:
                errors.append(
                    f"{mfe_dir.name}: legacy/minimal yapı allowlist dışında (modern yapıya taşınmalı)."
                )
            else:
                warnings.append(f"{mfe_dir.name}: legacy/minimal MFE (geçiş/migration adayı).")
            check_legacy_or_minimal(mfe_dir, errors)
        else:
            errors.append(f"{mfe_dir.name}: yapı tanımlanamıyor (modern/legacy/minimal değil).")

        print()

    if args.strict and warnings:
        errors.extend([f"STRICT: {w}" for w in warnings])
        warnings = []

    if warnings:
        print("Uyarılar:")
        for w in warnings:
            print(f"- {w}")
        print()

    if errors:
        print("[check_web_mfe_layout] HATA: web MFE layout sorunları var ❌")
        for e in errors:
            print(f"- {e}")
        return 1

    print("[check_web_mfe_layout] OK: web MFE layout tutarlı ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

