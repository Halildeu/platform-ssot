#!/usr/bin/env python3
"""
Agent ↔ doküman kontrat kontrolü.

Kullanım:
  python3 scripts/check_agent_docs_contract.py

Kontroller:
- ~/.codex/config.toml içindeki `project_doc_fallback_filenames` listesini
  ordered fallback olarak yorumlar ve bu listedeki adlardan en az birinin
  repo içinde gerçekten var olup olmadığını kontrol eder.
- transition doc rehberi ve GUIDE-0002-codex-context-test-guide.md içinde, desteklenen
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

TRANSITION_AGENT_DOC_NAMES = [
    "AGENT" + "-CODEX.core.md",
    "AGENT" + "-CODEX.docs.md",
]

AGENT_DOCS = [ROOT / name for name in TRANSITION_AGENT_DOC_NAMES]

CONTEXT_GUIDE = ROOT / "docs/03-delivery/guides/GUIDE-0002-codex-context-test-guide.md"


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

    matched_names = [name for name in names if find_file_in_repo(name)]
    if not matched_names:
        issues.append(
            "config'teki fallback adlarından hicbiri repo icinde bulunamadi: "
            + ", ".join(names)
        )
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
        issues.append("Transition agent dokümanları / context guide okunamadı.")
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
