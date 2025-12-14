#!/usr/bin/env python3
"""
API dokümanları için temel STYLE-API-001 uyum kontrolü.

Kullanım:
  python3 scripts/check_api_docs.py
  python3 scripts/check_api_docs.py docs/03-delivery/api/users.api.md

Kontroller (hafif ama faydalı tutulmuştur):
- Her .api.md dosyasında:
  - Üst kısımda "Amaç" bölümü var mı?
  - En az bir numaralı bölüm (1), 2), 3) ...) tanımlı mı?
  - Hata modeli için "Hata" veya "ErrorResponse" ifadeleri geçiyor mu?
  - Güvenlik için "Güvenlik" veya "Security" bölümü var mı?
  - En altta "Bağlantılar" bölümü ve içinde en az bir .md linki var mı?

Bu script, STYLE-API-001 md içindeki madde 9'da tarif edilen yapı ile
uyumu kontrol etmek için hafif bir otomasyon sağlar. İçerik kalitesini
değil yalnız yapısal alanların varlığını denetler.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict


ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / "docs/03-delivery/api"


@dataclass
class ApiDocResult:
    path: Path
    issues: List[str]


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def detect_amaç(lines: List[str]) -> bool:
    head = "\n".join(lines[:40]).lower()
    return "amaç" in head


def detect_numbered_sections(lines: List[str]) -> bool:
    return any(line.strip().startswith(tuple(f"{i})" for i in range(1, 10))) for line in lines)


def detect_error_section(lines: List[str]) -> bool:
    text = "\n".join(lines).lower()
    return ("hata" in text) or ("errorresponse" in text) or ("error response" in text)


def detect_security_section(lines: List[str]) -> bool:
    text = "\n".join(lines).lower()
    return ("güvenlik" in text) or ("guvenlik" in text) or ("security" in text)


def detect_links_section(lines: List[str]) -> bool:
    found_header = False
    has_md_link = False
    for line in lines:
        low = line.lower()
        if "bağlantılar" in low or "baglantilar" in low or "linkler" in low:
            found_header = True
        if ".md" in line:
            has_md_link = True
    return found_header and has_md_link


def check_api_doc(path: Path) -> ApiDocResult:
    issues: List[str] = []
    lines = read_lines(path)

    if not detect_amaç(lines):
        issues.append("Üst kısımda 'Amaç' bölümü bulunamadı.")
    if not detect_numbered_sections(lines):
        issues.append("Numaralı bölümler (1), 2), 3) ...) bulunamadı.")
    if not detect_error_section(lines):
        issues.append("Hata modeli (ErrorResponse) ile ilgili bölüm/ifade bulunamadı.")
    if not detect_security_section(lines):
        issues.append("Güvenlik/Security bölümü bulunamadı.")
    if not detect_links_section(lines):
        issues.append("En altta '.md' içeren bir 'Bağlantılar' / 'Linkler' bölümü bulunamadı.")

    return ApiDocResult(path=path, issues=issues)


def iter_targets(argv: List[str]) -> List[Path]:
    # Tek bir dosya verilmişse onu kontrol et.
    if len(argv) == 2:
        target = ROOT / argv[1]
        if target.is_file():
            return [target]
        raise SystemExit(f"API dokümanı bulunamadı: {target}")

    # Aksi halde tüm .api.md dosyalarını tara.
    if not API_DIR.exists():
        raise SystemExit(f"API klasörü bulunamadı: {API_DIR}")
    return sorted(API_DIR.glob("*.api.md"))


def main(argv: List[str]) -> int:
    targets = iter_targets(argv)
    if not targets:
        print("Kontrol edilecek .api.md dosyası bulunamadı.")
        return 0

    total_issues = 0
    results: Dict[Path, ApiDocResult] = {}

    for path in targets:
        res = check_api_doc(path)
        results[path] = res
        if res.issues:
            total_issues += len(res.issues)
            print(f"FAIL: {path.relative_to(ROOT)}")
            for issue in res.issues:
                print(f"   • {issue}")
        else:
            print(f"OK:   {path.relative_to(ROOT)}")

    if total_issues == 0:
        print("\nAPI dokümanları için temel STYLE-API-001 kontrolleri başarılı ✅")
        return 0

    print(f"\nTOPLAM {total_issues} API DOKÜMANI UYUM SORUNU VAR ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

