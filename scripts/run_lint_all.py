#!/usr/bin/env python3
"""
Backend ve Web lint / style kontrollerini tek komutla çalıştıran
yardımcı orchestrator script.

Kullanım (repo kökünden):
  python3 scripts/run_lint_all.py

Çalıştırdığı adımlar:
- scripts/run_lint_backend.sh
- scripts/run_lint_web.sh
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
  print(f"[run_lint_all] Çalıştırılıyor: {' '.join(cmd)}")
  subprocess.run(cmd, check=True, cwd=str(ROOT))


def main() -> int:
  try:
    run(["bash", "scripts/run_lint_backend.sh"])
    run(["bash", "scripts/run_lint_web.sh"])
  except subprocess.CalledProcessError as exc:
    print(f"[run_lint_all] HATA: komut başarısız: {exc}", file=sys.stderr)
    return 1

  print("[run_lint_all] Tüm lint adımları başarıyla tamamlandı ✅")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())

