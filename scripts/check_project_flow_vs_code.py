#!/usr/bin/env python3
"""
PROJECT-FLOW içindeki STORY ID'leri ile kod tabanı arasındaki temel
izlenebilirlik kontrolü.

Kullanım (repo kökünden):
  python3 scripts/check_project_flow_vs_code.py
  python3 scripts/check_project_flow_vs_code.py --report

Davranış:
- docs/03-delivery/PROJECT-FLOW.md içindeki tüm STORY satırlarını okur.
- Durumu "🟩 Done" olan Story ID'leri için:
  - backend/, web/, data/, mobile/ dizinlerinde ilgili STORY ID metni
    aranır (rg varsa rg ile, yoksa Python ile).
- Hiç referans bulunmayan Done Story'ler için uyarı üretir ve exit code 1
  döner.

Amaç:
- STORY dokümanları ile kod/test dosyaları arasında ID bazlı izlenebilirlik
  kurulduktan sonra, PROJECT-FLOW durumu ile gerçek kod ilişkisinin
  otomatik kontrolüne yardımcı olmak.

Not:
- Kod tabanı kontrolü, yanlış pozitifleri azaltmak için Markdown ve docs/
  altını taramaz; yalnızca kod/test dosyalarında STORY ID arar.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
PROJECT_FLOW_MD = ROOT / "docs" / "03-delivery" / "PROJECT-FLOW.md"
PROJECT_FLOW_TSV = ROOT / "docs" / "03-delivery" / "PROJECT-FLOW.tsv"

# Bazı 🟩 Done Story'ler yalnızca doküman/bridge/migration işidir veya bu repoda kodu yoktur.
# Bu Story'ler için kodda STORY-ID referansı beklemiyoruz.
EXEMPT_DONE_STORY_IDS = {
    "STORY-0301",  # Mobil repo dışı / burada kod yok
    "STORY-0001",  # Doküman refactor
    "STORY-0003",  # API docs refactor (doküman)
    "STORY-0004",  # OpenAPI docs refactor
    "STORY-0005",  # Monitoring docs refactor
    "STORY-0006",  # Release docs refactor
    "STORY-0026",  # Doc-QA otomasyon dokümanı (script işi)
    "STORY-0037",  # Theme docs migration
    "STORY-0038",  # Theme docs migration
    "STORY-0039",  # Theme docs migration
    "STORY-0041",  # FE docs refactor
}


@dataclass
class StoryStatus:
    story_id: str
    raw_line: str
    is_done: bool
    code_refs: int = 0


def parse_story_table_rows() -> List[StoryStatus]:
    """
    SSOT: PROJECT-FLOW.tsv (yoksa legacy MD fallback)
    """
    if PROJECT_FLOW_TSV.exists():
        lines = PROJECT_FLOW_TSV.read_text(encoding="utf-8").splitlines()
        if not lines:
            raise SystemExit(f"PROJECT-FLOW TSV boş: {PROJECT_FLOW_TSV}")

        header = [h.strip() for h in lines[0].split("\t")]
        idx: Dict[str, int] = {name: i for i, name in enumerate(header) if name}
        if "Story ID" not in idx or "Durum" not in idx:
            raise SystemExit("PROJECT-FLOW TSV kolonları eksik: Story ID, Durum")

        stories: List[StoryStatus] = []
        for line in lines[1:]:
            if not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) < len(header):
                parts += [""] * (len(header) - len(parts))

            story_id = (parts[idx["Story ID"]] or "").strip()
            if not story_id.startswith("STORY-"):
                continue
            status = (parts[idx["Durum"]] or "").strip()
            is_done = status.startswith("🟩") or "Done" in status
            stories.append(StoryStatus(story_id=story_id, raw_line=line, is_done=is_done))
        return stories

    if not PROJECT_FLOW_MD.exists():
        raise SystemExit(f"PROJECT-FLOW bulunamadı: {PROJECT_FLOW_MD}")

    in_story_table_section = False
    in_block = False
    stories: List[StoryStatus] = []

    for line in PROJECT_FLOW_MD.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("## 2. STORY DURUM TABLOSU"):
            in_story_table_section = True
            continue
        if not in_story_table_section:
            continue

        if stripped.startswith("```text"):
            in_block = True
            continue
        if in_block and stripped.startswith("```"):
            break
        if not in_block:
            continue
        if not stripped or not stripped.startswith("STORY-"):
            continue
        if "Story ID" in stripped:
            continue

        story_id = stripped.split()[0]
        is_done = "🟩 Done" in stripped
        stories.append(StoryStatus(story_id=story_id, raw_line=stripped, is_done=is_done))

    return stories


def parse_project_flow() -> List[StoryStatus]:
    if not PROJECT_FLOW_MD.exists():
        raise SystemExit(f"PROJECT-FLOW bulunamadı: {PROJECT_FLOW_MD}")

    stories: List[StoryStatus] = []
    for line in PROJECT_FLOW_MD.read_text(encoding="utf-8").splitlines():
        if not line.startswith("STORY-"):
            continue
        parts = line.split()
        if not parts:
            continue
        story_id = parts[0]
        is_done = "🟩 Done" in line
        stories.append(StoryStatus(story_id=story_id, raw_line=line, is_done=is_done))
    return stories


def find_code_refs_with_rg(story_id: str, targets: List[Path]) -> Optional[int]:
    cmd = [
        "rg",
        "-n",
        "--glob",
        "!**/*.md",
        "--glob",
        "!**/docs/**",
        story_id,
    ] + [str(t) for t in targets]
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except FileNotFoundError:
        return None
    if proc.returncode not in (0, 1):
        # Diğer hata kodlarını "rg yok" gibi ele alalım.
        return None
    if not proc.stdout.strip():
        return 0
    return len(proc.stdout.splitlines())


def find_code_refs_python(story_id: str, targets: List[Path]) -> int:
    count = 0
    for t in targets:
        if not t.exists():
            continue
        for path in t.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() == ".md":
                continue
            if "docs" in path.parts:
                continue
            # Binary dosyaları atla
            try:
                text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            if story_id in text:
                count += text.count(story_id)
    return count


def find_code_refs(story_id: str) -> int:
    targets = [p for p in (ROOT / "backend", ROOT / "web", ROOT / "data", ROOT / "mobile") if p.exists()]
    if not targets:
        return 0

    # Önce rg dene
    rg_result = find_code_refs_with_rg(story_id, targets)
    if rg_result is not None:
        return rg_result

    # rg yoksa Python fallback
    return find_code_refs_python(story_id, targets)


def find_story_refs_map(targets: List[Path]) -> Dict[str, int]:
    """
    targets altındaki kod/test dosyalarında geçen STORY-XXXX referanslarını sayar.
    """
    # Önce rg dene: tek seferde tüm STORY ID’leri topla.
    cmd = [
        "rg",
        "-n",
        "--glob",
        "!**/*.md",
        "--glob",
        "!**/docs/**",
        r"STORY-[0-9]{4}",
    ] + [str(t) for t in targets]
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        if proc.returncode not in (0, 1):
            raise FileNotFoundError
    except FileNotFoundError:
        # rg yoksa Python fallback: yavaş ama deterministik.
        refs: Dict[str, int] = {}
        for t in targets:
            if not t.exists():
                continue
            for path in t.rglob("*"):
                if not path.is_file():
                    continue
                if path.suffix.lower() == ".md":
                    continue
                if "docs" in path.parts:
                    continue
                try:
                    text = path.read_text(encoding="utf-8", errors="ignore")
                except OSError:
                    continue
                for sid in set(part for part in text.split() if part.startswith("STORY-")):
                    # Hızlı/kolay: regex yerine kaba filtre; gerçek sayım rg yokken kritik değil.
                    if len(sid) >= 10 and sid[:10].startswith("STORY-") and sid[6:10].isdigit():
                        refs[sid[:10]] = refs.get(sid[:10], 0) + 1
        return refs

    refs: Dict[str, int] = {}
    for line in proc.stdout.splitlines():
        # rg format: path:line:content
        parts = line.split(":", 2)
        if len(parts) != 3:
            continue
        content = parts[2]
        # Bir satırda birden fazla STORY olabilir.
        for token in content.split():
            if token.startswith("STORY-") and len(token) >= 10 and token[6:10].isdigit():
                sid = token[:10]
                refs[sid] = refs.get(sid, 0) + 1
    return refs


def report_all() -> int:
    stories = parse_story_table_rows()
    targets = [p for p in (ROOT / "backend", ROOT / "web", ROOT / "data", ROOT / "mobile") if p.exists()]
    refs_map = find_story_refs_map(targets) if targets else {}

    print("PROJECT-FLOW ↔ Kod STORY ID raporu (tüm Story tablosu):\n")
    for s in stories:
        refs = refs_map.get(s.story_id, 0)
        s.code_refs = refs
        note = ""
        if s.story_id in EXEMPT_DONE_STORY_IDS:
            note = " (EXEMPT)"
        print(f"- {s.story_id}: code_refs={refs}{note}")

    print("\nNot: code_refs yalnızca kod/test dosyalarında aranır (Markdown/docs hariç).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--report", action="store_true")
    args, _ = parser.parse_known_args()

    if args.report:
        return report_all()

    stories = parse_story_table_rows()
    done_stories = [s for s in stories if s.is_done]
    if not done_stories:
        print("[check_project_flow_vs_code] PROJECT-FLOW içinde 🟩 Done STORY satırı bulunamadı (skip).")
        return 0

    any_missing = False
    print("PROJECT-FLOW ↔ Kod STORY ID kontrolleri (yalnız 🟩 Done satırlar):\n")
    for s in done_stories:
        if s.story_id in EXEMPT_DONE_STORY_IDS:
            print(f"- {s.story_id}: EXEMPT (doküman/migration) -> SKIPPED")
            continue
        refs = find_code_refs(s.story_id)
        s.code_refs = refs
        status = "OK" if refs > 0 else "MISSING"
        print(f"- {s.story_id}: code_refs={refs} -> {status}")
        if refs == 0:
            any_missing = True

    if not any_missing:
        print("\nTüm 🟩 Done STORY ID'leri için kod/test tarafında en az bir referans bulundu ✅")
        return 0

    print("\nBazı 🟩 Done STORY ID'leri için kod/test tarafında referans bulunamadı ❌")
    print("Not: Bu script, STYLE-BE-001 / STYLE-WEB-001 içindeki STORY ID referans")
    print("kuralı benimsendikten sonra daha anlamlı hale gelir; mevcut kodlar")
    print("zamanla güncellendikçe çıktılar temizlenecektir.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
