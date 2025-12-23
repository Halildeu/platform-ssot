#!/usr/bin/env python3
"""
Local Autopilot Queue (TSV) – v0.1

Amaç:
- Localde tek worker orchestrator için basit bir queue dosyası yönetmek.
- GitHub'a istek atmaz; sadece `.autopilot-tmp/queue/queue.tsv` dosyasını okur/yazar.

Kullanım:
  python3 scripts/autopilot_queue.py add --pr 59 --reason "ci-gate fail"
  python3 scripts/autopilot_queue.py list
  python3 scripts/autopilot_queue.py pop
  python3 scripts/autopilot_queue.py clear
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
from pathlib import Path
from typing import Dict, List, Sequence


ROOT = Path(__file__).resolve().parents[1]
QUEUE_DEFAULT = ROOT / ".autopilot-tmp/queue/queue.tsv"
COLS = ["PR", "STATE", "REASON", "LAST_UPDATE"]


def now() -> str:
    return dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def read_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        out: List[Dict[str, str]] = []
        for row in reader:
            if not row:
                continue
            pr = (row.get("PR") or "").strip()
            if not pr:
                continue
            out.append({k: (row.get(k) or "") for k in COLS})
        return out


def write_rows(path: Path, rows: List[Dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLS, delimiter="\t")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in COLS})


def cmd_add(args: argparse.Namespace) -> int:
    rows = read_rows(args.queue)
    pr = str(args.pr)
    reason = args.reason or ""
    for row in rows:
        if row.get("PR") == pr:
            row["STATE"] = "queued"
            row["REASON"] = reason or row.get("REASON", "")
            row["LAST_UPDATE"] = now()
            write_rows(args.queue, rows)
            print(f"[ok] updated PR #{pr} in queue")
            return 0
    rows.append({"PR": pr, "STATE": "queued", "REASON": reason, "LAST_UPDATE": now()})
    write_rows(args.queue, rows)
    print(f"[ok] added PR #{pr} to queue")
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    rows = read_rows(args.queue)
    if not rows:
        print("[info] queue empty")
        return 0
    for row in rows:
        print(f"{row.get('PR')}\t{row.get('STATE')}\t{row.get('REASON')}\t{row.get('LAST_UPDATE')}")
    return 0


def cmd_pop(args: argparse.Namespace) -> int:
    rows = read_rows(args.queue)
    if not rows:
        print("")
        return 0
    first = rows.pop(0)
    write_rows(args.queue, rows)
    print(first.get("PR", ""))
    return 0


def cmd_clear(args: argparse.Namespace) -> int:
    write_rows(args.queue, [])
    print("[ok] queue cleared")
    return 0


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="autopilot_queue.py")
    ap.add_argument("--queue", type=Path, default=QUEUE_DEFAULT)
    sub = ap.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add")
    a.add_argument("--pr", type=int, required=True)
    a.add_argument("--reason", default="")
    a.set_defaults(fn=cmd_add)

    l = sub.add_parser("list")
    l.set_defaults(fn=cmd_list)

    p = sub.add_parser("pop")
    p.set_defaults(fn=cmd_pop)

    c = sub.add_parser("clear")
    c.set_defaults(fn=cmd_clear)

    args = ap.parse_args(list(argv))
    return args


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    return int(args.fn(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
