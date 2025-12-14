#!/usr/bin/env python3
"""
Acceptance içindeki "Kanıt/Evidence" bloklarında geçen path/komut referanslarını doğrular.

Amaç:
- Kod içine STORY-ID gömmeden, Acceptance kriterlerini "modül bazlı + kanıtlı" takip etmek.
- AC dosyalarında verilen kanıt referansları (dosya yolu / script) bozulduğunda erken yakalamak.

Varsayılan davranış:
- Kanıt/Evidence bloğu olmayan AC dosyalarını hata saymaz (opsiyonel).
- Kanıt/Evidence bloğu varsa, içindeki inline-code (`...`) referanslarını tarar:
  - Repo içi dosya yolları gerçekten var mı?
  - `scripts/...` dosyaları gerçekten var mı?

Kullanım:
  python3 scripts/check_acceptance_evidence.py
  python3 scripts/check_acceptance_evidence.py --story STORY-0007
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
ACCEPTANCE_GLOB = "docs/03-delivery/ACCEPTANCE/AC-*.md"

INLINE_CODE_RE = re.compile(r"`([^`]+)`")


def iter_lines_without_fences(text: str) -> Iterable[Tuple[int, str]]:
    in_fence = False
    for idx, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        yield idx, line


def extract_story_meta(text: str) -> Optional[str]:
    for _, line in iter_lines_without_fences(text):
        if line.startswith("Story:"):
            return line.split(":", 1)[1].strip()
    return None


def is_placeholder(value: str) -> bool:
    # Template örnekleri veya wildcard/pattern'leri skip edelim.
    tokens = ("...", "<", ">", "*", "{", "}", "|")
    return any(t in value for t in tokens)


def candidate_paths_from_inline_code(code: str) -> List[str]:
    # Komut veya tek bir path olabilir. En basit şekilde token'lara bölelim.
    parts = code.split()
    if len(parts) == 1:
        return [code]

    candidates: List[str] = []
    for p in parts:
        if "/" in p or p.endswith((".py", ".sh", ".md", ".yaml", ".yml", ".json")):
            candidates.append(p.strip())
    return candidates


def normalize_path(token: str) -> str:
    # Noktalama/virgül gibi uçları temizle.
    return token.strip().rstrip(",;.:")


def exists_repo_path(token: str) -> bool:
    token = normalize_path(token)
    if not token:
        return True

    # Absolute path varsa olduğu gibi kontrol et.
    path = Path(token)
    if path.is_absolute():
        return path.exists()

    # Repo-relative
    return (ROOT / token).exists()


def is_path_like(token: str) -> bool:
    if "/" in token:
        return True
    if token.startswith("."):
        return True
    if token.endswith((".py", ".sh", ".md", ".yaml", ".yml", ".json")):
        return True
    return False


def extract_evidence_blocks(lines: List[Tuple[int, str]]) -> List[Tuple[int, List[Tuple[int, str]]]]:
    """
    'Kanıt/Evidence' geçen satırı ve onu takip eden (kısa) bloğu döndürür.
    """
    blocks: List[Tuple[int, List[Tuple[int, str]]]] = []
    i = 0
    while i < len(lines):
        line_no, line = lines[i]
        if "kanıt/evidence" in line.lower():
            block: List[Tuple[int, str]] = []
            # Sonraki ~12 satırı veya bir sonraki başlığa kadar al.
            j = i + 1
            while j < len(lines) and (j - i) <= 12:
                ln, l = lines[j]
                stripped = l.strip()
                if not stripped:
                    break
                if stripped.startswith(("### ", "## ")):
                    break
                if stripped.startswith("-------------------------------------------------------------------------------"):
                    break
                if stripped and stripped[0].isdigit() and "." in stripped[:4]:
                    break
                block.append((ln, l))
                j += 1
            blocks.append((line_no, block))
        i += 1
    return blocks


def check_file(path: Path, story_filter: Optional[str]) -> List[str]:
    text = path.read_text(encoding="utf-8")
    story_meta = extract_story_meta(text)
    if story_filter:
        if not story_meta or not story_meta.startswith(story_filter):
            return []

    lines = list(iter_lines_without_fences(text))
    blocks = extract_evidence_blocks(lines)
    errors: List[str] = []

    for evidence_line_no, block in blocks:
        for ln, l in block:
            for code in INLINE_CODE_RE.findall(l):
                for token in candidate_paths_from_inline_code(code):
                    token = normalize_path(token)
                    if not token or is_placeholder(token):
                        continue
                    if not is_path_like(token):
                        continue
                    if not exists_repo_path(token):
                        errors.append(
                            f"{path}:{ln}: Kanıt referansı bulunamadı: `{token}` (evidence @ line {evidence_line_no})"
                        )
    return errors


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--story", help="Sadece verilen STORY-ID için kontrol et (örn. STORY-0007).")
    args = parser.parse_args(argv[1:])

    story_filter = args.story
    if story_filter and not story_filter.startswith("STORY-"):
        print("--story STORY-XXXX olmalı.")
        return 2

    files = sorted((ROOT).glob(ACCEPTANCE_GLOB))
    if not files:
        print(f"[check_acceptance_evidence] Uyarı: {ACCEPTANCE_GLOB} için dosya bulunamadı.")
        return 0

    all_errors: List[str] = []
    for path in files:
        all_errors.extend(check_file(path, story_filter))

    if all_errors:
        print("[check_acceptance_evidence] HATA: geçersiz kanıt/evidence referansları bulundu:")
        for e in all_errors:
            print(f"- {e}")
        return 1

    print("[check_acceptance_evidence] OK: kanıt/evidence referansları geçerli ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
