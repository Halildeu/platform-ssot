#!/usr/bin/env python3
import argparse
import csv
import datetime as dt
import os
import sys

QUEUE_DEFAULT = ".autopilot-tmp/queue/queue.tsv"
COLS = ["PR", "STATE", "REASON", "LAST_UPDATE"]


def now() -> str:
    ts = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()
    return ts.replace("+00:00", "Z")


def read_rows(path: str) -> list[dict[str, str]]:
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        return [row for row in reader if row and row.get("PR")]


def write_rows(path: str, rows: list[dict[str, str]]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLS, delimiter="\t")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in COLS})


def cmd_add(args: argparse.Namespace) -> int:
    rows = read_rows(args.queue)
    pr = str(args.pr)

    for row in rows:
        if row.get("PR") == pr:
            row["STATE"] = "queued"
            row["REASON"] = args.reason or row.get("REASON", "")
            row["LAST_UPDATE"] = now()
            write_rows(args.queue, rows)
            print(f"[ok] updated PR #{pr} in queue")
            return 0

    rows.append({"PR": pr, "STATE": "queued", "REASON": args.reason or "", "LAST_UPDATE": now()})
    write_rows(args.queue, rows)
    print(f"[ok] added PR #{pr} to queue")
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    rows = read_rows(args.queue)
    if not rows:
        print("[info] queue empty")
        return 0
    for row in rows:
        print(
            f"{row.get('PR')}\t{row.get('STATE')}\t{row.get('REASON')}\t{row.get('LAST_UPDATE')}"
        )
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


def main() -> int:
    parser = argparse.ArgumentParser(prog="autopilot_queue.py")
    parser.add_argument("--queue", default=QUEUE_DEFAULT)
    sub = parser.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add")
    add.add_argument("--pr", type=int, required=True)
    add.add_argument("--reason", default="")
    add.set_defaults(fn=cmd_add)

    list_ = sub.add_parser("list")
    list_.set_defaults(fn=cmd_list)

    pop = sub.add_parser("pop")
    pop.set_defaults(fn=cmd_pop)

    clear = sub.add_parser("clear")
    clear.set_defaults(fn=cmd_clear)

    args = parser.parse_args()
    return args.fn(args)


if __name__ == "__main__":
    raise SystemExit(main())
