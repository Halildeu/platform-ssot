#!/usr/bin/env python3
"""
DATA katmanı için SQL + pipeline kalite kontrollerini birlikte çalıştıran
orchestrator script.

Kullanım (repo kökünden):
  python3 scripts/check_data_all.py
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
    print(f"[check_data_all] Çalıştırılıyor: {' '.join(cmd)}")
    subprocess.run(cmd, check=True, cwd=str(ROOT))


def main() -> int:
    try:
        run(["python3", "scripts/check_data_sql_style.py"])
        run(["python3", "scripts/check_data_pipelines.py"])
    except subprocess.CalledProcessError as exc:
        print(f"[check_data_all] HATA: komut başarısız: {exc}", file=sys.stderr)
        return 1

    print("[check_data_all] SQL + pipeline kalite kontrolleri başarıyla tamamlandı ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

