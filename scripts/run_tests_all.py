#!/usr/bin/env python3
"""
Backend ve Web testlerini tek komutla çalıştıran yardımcı orchestrator script.

Kullanım (repo kökünden):
  python3 scripts/run_tests_all.py

Davranış:
- Önce backend testleri:
  - ./scripts/run_tests_backend.sh
- Ardından web unit testleri:
  - ./scripts/run_tests_web.sh unit

Gerektiğinde, web e2e veya quality testleri ayrıca run_tests_web.sh ile
manuel olarak tetiklenebilir.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
    print(f"[run_tests_all] Çalıştırılıyor: {' '.join(cmd)}")
    subprocess.run(cmd, check=True, cwd=str(ROOT))


def main() -> int:
    try:
        run(["bash", "scripts/run_tests_backend.sh"])
        run(["bash", "scripts/run_tests_web.sh", "unit"])
    except subprocess.CalledProcessError as exc:
        print(f"[run_tests_all] HATA: komut başarısız: {exc}", file=sys.stderr)
        return 1

    print("[run_tests_all] Backend + Web unit testleri başarıyla tamamlandı ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

