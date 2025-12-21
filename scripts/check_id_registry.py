#!/usr/bin/env python3
"""
ID Registry (SSOT) kontrolü.

Amaç:
- STORY/AC/TP numaralarının (XXXX) çakışmasını erken yakalamak.
- PR içinde yeni STORY/AC/TP dosyası eklenmişse, aynı NUM için registry rezervasyonu
  zorunlu olsun.

SSOT dosyası:
  docs/03-delivery/ID-REGISTRY.tsv

Kurallar (v0.1):
- Registry header zorunlu kolonları içermeli: TYPE, NUM, ID, BRANCH, OWNER, CREATED_AT, STATUS
- Registry içinde aynı TYPE+NUM birden fazla olamaz.
- PR diff'inde yeni STORY/AC/TP dokümanı eklenmişse:
  - Registry'de aynı TYPE+NUM satırı olmalı,
  - Registry satırındaki ID, dokümandaki `ID:` meta ile birebir aynı olmalı,
  - BRANCH/OWNER/CREATED_AT/STATUS boş olmamalı,
  - STATUS=abandoned ise bu NUM yeniden kullanılamaz (FAIL).

Kullanım:
  python3 scripts/check_id_registry.py
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY_PATH = ROOT / "docs/03-delivery/ID-REGISTRY.tsv"

REQUIRED_COLUMNS = ["TYPE", "NUM", "ID", "BRANCH", "OWNER", "CREATED_AT", "STATUS"]

DOC_PATTERNS: List[Tuple[str, re.Pattern[str]]] = [
    ("STORY", re.compile(r"^docs/03-delivery/STORIES/STORY-(\d{4})-.*\.md$")),
    ("AC", re.compile(r"^docs/03-delivery/ACCEPTANCE/AC-(\d{4})-.*\.md$")),
    ("TP", re.compile(r"^docs/03-delivery/TEST-PLANS/TP-(\d{4})-.*\.md$")),
]


@dataclass(frozen=True)
class RegistryEntry:
    type: str
    num: str
    id: str
    branch: str
    owner: str
    created_at: str
    status: str
    line_no: int


@dataclass(frozen=True)
class NewDoc:
    path: str
    type: str
    num: str
    id_meta: str


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def git_run(argv: Sequence[str]) -> str:
    proc = subprocess.run(
        ["git", *argv],
        cwd=str(ROOT),
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return proc.stdout


def try_git_run(argv: Sequence[str]) -> Tuple[bool, str, str]:
    proc = subprocess.run(
        ["git", *argv],
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return proc.returncode == 0, proc.stdout, proc.stderr


def read_github_event() -> Optional[dict]:
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    if not event_path:
        return None
    path = Path(event_path)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def compute_name_status(base_ref: str, head_ref: str) -> List[Tuple[str, List[str]]]:
    """
    Returns git diff --name-status output as parsed tuples:
      (status, [path, ...])  (e.g. A [path], R100 [old, new])
    """
    event = read_github_event()
    pr = (event or {}).get("pull_request")
    if isinstance(pr, dict):
        base_sha = ((pr.get("base") or {}) if isinstance(pr.get("base"), dict) else {}).get("sha")
        head_sha = ((pr.get("head") or {}) if isinstance(pr.get("head"), dict) else {}).get("sha")
        if isinstance(base_sha, str) and isinstance(head_sha, str):
            ok, out, _ = try_git_run(["diff", "--name-status", f"{base_sha}..{head_sha}"])
            if ok:
                return parse_name_status(out)

    out = git_run(["diff", "--name-status", f"{base_ref}...{head_ref}"])
    return parse_name_status(out)


def parse_name_status(text: str) -> List[Tuple[str, List[str]]]:
    rows: List[Tuple[str, List[str]]] = []
    for line in text.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        if not parts:
            continue
        status = parts[0].strip()
        paths = [p.strip() for p in parts[1:] if p.strip()]
        if not status or not paths:
            continue
        rows.append((status, paths))
    return rows


def extract_id_meta(path: Path) -> Optional[str]:
    lines = read_text(path).splitlines()
    for line in lines[:10]:
        if line.startswith("ID:"):
            value = line.split(":", 1)[1].strip()
            return value.split()[0] if value else None
    return None


def parse_id_components(id_value: str) -> Optional[Tuple[str, str]]:
    """
    Returns (TYPE, NUM) from an ID token.
    Accepts:
      STORY-0303
      STORY-0303-foo
      AC-0303
      TP-0303-bar
    """
    m = re.match(r"^(STORY|AC|TP)-(\d{4})(?:$|-)", id_value)
    if not m:
        return None
    return m.group(1), m.group(2)


def find_new_delivery_docs(name_status: List[Tuple[str, List[str]]]) -> List[NewDoc]:
    added_paths: List[str] = []
    for status, paths in name_status:
        # "Yeni dosya" için yalnız A* (added) kullanıyoruz.
        if not status.startswith("A"):
            continue
        if len(paths) >= 1:
            added_paths.append(paths[0])

    docs: List[NewDoc] = []
    for p in added_paths:
        matched_type = None
        matched_num = None
        for t, rx in DOC_PATTERNS:
            m = rx.match(p)
            if m:
                matched_type = t
                matched_num = m.group(1)
                break
        if not matched_type or not matched_num:
            continue

        file_path = ROOT / p
        if not file_path.exists():
            # PR diff A ama workspace'te yoksa (çok nadir) skip.
            continue
        id_meta = extract_id_meta(file_path)
        if not id_meta:
            # ID meta yoksa zaten check_doc_ids fail edecektir; burada da fail edelim.
            docs.append(NewDoc(path=p, type=matched_type, num=matched_num, id_meta=""))
            continue
        docs.append(NewDoc(path=p, type=matched_type, num=matched_num, id_meta=id_meta))
    return docs


def parse_registry(path: Path) -> Tuple[Dict[Tuple[str, str], RegistryEntry], List[str]]:
    errors: List[str] = []
    entries: Dict[Tuple[str, str], RegistryEntry] = {}

    if not path.exists():
        errors.append(f"Registry dosyası bulunamadı: {path}")
        return entries, errors

    raw_lines = read_text(path).splitlines()
    lines = []
    for ln in raw_lines:
        if not ln.strip():
            continue
        if ln.lstrip().startswith("#"):
            continue
        lines.append(ln)

    if not lines:
        errors.append(f"Registry dosyası boş: {path}")
        return entries, errors

    header = [h.strip() for h in lines[0].split("\t")]
    idx = {name: i for i, name in enumerate(header) if name}

    missing = [c for c in REQUIRED_COLUMNS if c not in idx]
    if missing:
        errors.append(f"Registry header eksik kolon(lar): {', '.join(missing)}")
        return entries, errors

    for i, line in enumerate(lines[1:], start=2):
        parts = line.split("\t")
        if len(parts) < len(header):
            errors.append(f"Registry satırı eksik kolon: line={i} ({line})")
            continue

        type_val = (parts[idx["TYPE"]] or "").strip()
        num_val = (parts[idx["NUM"]] or "").strip()
        id_val = (parts[idx["ID"]] or "").strip()
        branch_val = (parts[idx["BRANCH"]] or "").strip()
        owner_val = (parts[idx["OWNER"]] or "").strip()
        created_at_val = (parts[idx["CREATED_AT"]] or "").strip()
        status_val = (parts[idx["STATUS"]] or "").strip()

        if not type_val or not num_val or not id_val:
            errors.append(f"Registry satırı zorunlu alan boş: line={i} ({line})")
            continue

        if type_val not in {"STORY", "AC", "TP"}:
            errors.append(f"Registry TYPE geçersiz: line={i} TYPE={type_val!r}")
            continue

        if not re.fullmatch(r"\d{4}", num_val):
            errors.append(f"Registry NUM geçersiz: line={i} NUM={num_val!r}")
            continue

        parsed = parse_id_components(id_val)
        if not parsed:
            errors.append(f"Registry ID format geçersiz: line={i} ID={id_val!r}")
            continue
        id_type, id_num = parsed
        if id_type != type_val or id_num != num_val:
            errors.append(
                f"Registry ID/TYPE/NUM uyumsuz: line={i} TYPE={type_val} NUM={num_val} ID={id_val}"
            )
            continue

        key = (type_val, num_val)
        if key in entries:
            prev = entries[key]
            errors.append(
                f"Registry TYPE+NUM çakışması: {type_val}-{num_val} (line {prev.line_no} ve {i})"
            )
            continue

        entries[key] = RegistryEntry(
            type=type_val,
            num=num_val,
            id=id_val,
            branch=branch_val,
            owner=owner_val,
            created_at=created_at_val,
            status=status_val,
            line_no=i,
        )

    return entries, errors


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(prog="check_id_registry.py")
    parser.add_argument(
        "--registry-path",
        default=str(DEFAULT_REGISTRY_PATH),
        help="Registry TSV path (default: docs/03-delivery/ID-REGISTRY.tsv)",
    )
    parser.add_argument("--base-ref", default="origin/main", help="Diff base ref (fallback).")
    parser.add_argument("--head-ref", default="HEAD", help="Diff head ref (fallback).")
    args = parser.parse_args(argv[1:])

    registry_path = Path(args.registry_path)
    registry, parse_errors = parse_registry(registry_path)
    errors: List[str] = list(parse_errors)

    name_status = compute_name_status(base_ref=args.base_ref, head_ref=args.head_ref)
    new_docs = find_new_delivery_docs(name_status)

    if new_docs:
        print("[check_id_registry] new delivery docs detected:")
        for d in new_docs:
            print(f"- {d.type}-{d.num}: {d.path}")
    else:
        print("[check_id_registry] no new STORY/AC/TP docs detected in diff.")

    for d in new_docs:
        if not d.id_meta:
            errors.append(f"{d.path}: ID meta satırı bulunamadı (ilk 10 satır içinde 'ID:' yok).")
            continue

        parsed = parse_id_components(d.id_meta)
        if not parsed:
            errors.append(f"{d.path}: ID meta formatı geçersiz: {d.id_meta!r}")
            continue
        id_type, id_num = parsed
        if id_type != d.type or id_num != d.num:
            errors.append(
                f"{d.path}: ID meta ile dosya prefix numarası uyumsuz (file={d.type}-{d.num}, meta={id_type}-{id_num})."
            )
            continue

        key = (d.type, d.num)
        entry = registry.get(key)
        if not entry:
            errors.append(
                "\n".join(
                    [
                        f"{d.path}: ID registry rezervasyonu yok: {d.type}-{d.num}.",
                        f"- Beklenen: {registry_path} içinde TYPE={d.type} NUM={d.num} satırı",
                    ]
                )
            )
            continue

        if entry.id != d.id_meta:
            errors.append(
                f"{d.path}: Registry ID ile doküman ID uyuşmuyor (registry={entry.id!r}, doc={d.id_meta!r})."
            )

        if not entry.branch or not entry.owner or not entry.created_at or not entry.status:
            errors.append(
                f"{registry_path}: line {entry.line_no} rezervasyon meta eksik (BRANCH/OWNER/CREATED_AT/STATUS boş olamaz) for {entry.type}-{entry.num}."
            )

        if entry.status.strip().lower() == "abandoned":
            errors.append(
                f"{registry_path}: line {entry.line_no} STATUS=abandoned (v0.1: reuse yok) for {entry.type}-{entry.num}."
            )

    if errors:
        print("\n[check_id_registry] FAIL:")
        for e in errors:
            print(f"- {e}")
        return 1

    print("[check_id_registry] OK ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

