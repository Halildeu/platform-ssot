#!/usr/bin/env python3
"""
Backend ve Web security kontrollerini tek komutla çalıştıran orchestrator.

Kullanım (repo kökünden):
  python3 scripts/check_security_all.py

Davranış:
- ./scripts/check_security_backend.sh
- ./scripts/check_security_web.sh
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
    print(f"[check_security_all] Çalıştırılıyor: {' '.join(cmd)}")
    subprocess.run(cmd, check=True, cwd=str(ROOT))


def main() -> int:
    try:
        run(["bash", "scripts/check_security_backend.sh"])
        run(["bash", "scripts/check_security_web.sh"])
    except subprocess.CalledProcessError as exc:
        print(f"[check_security_all] HATA: komut başarısız: {exc}", file=sys.stderr)
        return 1

    print("[check_security_all] Backend + Web security kontrolleri başarıyla tamamlandı ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

