#!/usr/bin/env python3
"""
Agent ↔ doküman kontrat kontrolü.

Kullanım:
  python3 scripts/check_agent_docs_contract.py

Kontroller:
- ~/.codex/config.toml içindeki `project_doc_fallback_filenames` listesinde
  adı geçen tüm dosyaların repo içinde gerçekten var olup olmadığını kontrol eder.
- AGENT-CODEX.docs.md ve CODEX-CONTEXT-TEST-GUIDE.md içinde, desteklenen
  doğal komut tiplerinin ("Bu projeye başla", "Bu projeyi test et",
  "Sadece Doc QA çalıştır") geçtiğini doğrular.

Not:
- Bu script içerik kalitesini değil yalnızca referans ve kontrat uyumunu
  denetler; STORY-0030 / AC-0030 / TP-0029 kapsamındadır.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import List, Set


ROOT = Path(__file__).resolve().parents[1]
HOME = Path.home()
CONFIG_PATH = HOME / ".codex" / "config.toml"

AGENT_DOCS = [
    ROOT / "AGENT-CODEX.core.md",
    ROOT / "AGENT-CODEX.docs.md",
]

CONTEXT_GUIDE = ROOT / "docs/03-delivery/guides/CODEX-CONTEXT-TEST-GUIDE.md"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_fallback_filenames(config_text: str) -> List[str]:
    """
    config.toml içinden project_doc_fallback_filenames dizisindeki string
    değerleri basitçe regex ile toplar.
    """
    m = re.search(r"project_doc_fallback_filenames\s*=\s*\[(.*?)\]", config_text, re.S)
    if not m:
        return []
    block = m.group(1)
    return re.findall(r'"([^"]+)"', block)


def find_file_in_repo(name: str) -> List[Path]:
    return list(ROOT.rglob(name))


def check_config_files() -> List[str]:
    issues: List[str] = []
    if not CONFIG_PATH.exists():
        issues.append(f"Config dosyası bulunamadı: {CONFIG_PATH}")
        return issues

    cfg_text = read_text(CONFIG_PATH)
    names = parse_fallback_filenames(cfg_text)
    if not names:
        issues.append("config.toml içinde project_doc_fallback_filenames bulunamadı.")
        return issues

    for name in names:
        matches = find_file_in_repo(name)
        if not matches:
            issues.append(f"config'te listelenen dosya repo içinde bulunamadı: {name}")
    return issues


def check_supported_commands() -> List[str]:
    issues: List[str] = []
    expected_phrases = [
        "Bu projeye başla",
        "Bu projeyi test et",
        "Sadece Doc QA çalıştır",
    ]

    texts: List[str] = []
    for path in AGENT_DOCS + [CONTEXT_GUIDE]:
        if path.exists():
            texts.append(read_text(path))

    if not texts:
        issues.append("Agent dokümanları (AGENT-CODEX.* / CODEX-CONTEXT-TEST-GUIDE) okunamadı.")
        return issues

    joined = "\n".join(texts)
    for phrase in expected_phrases:
        if phrase not in joined:
            issues.append(f"Beklenen komut ifadesi dokümanlarda bulunamadı: '{phrase}'")

    return issues


def main() -> int:
    issues: List[str] = []

    issues.extend(check_config_files())
    issues.extend(check_supported_commands())

    if not issues:
        print("Agent ↔ doküman kontrat kontrolleri başarılı ✅")
        return 0

    print("Agent docs contract uyum sorunları:")
    for issue in issues:
        print(f"- {issue}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

