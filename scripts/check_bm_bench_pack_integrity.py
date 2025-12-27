#!/usr/bin/env python3
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(".")
BM_RE = re.compile(r"^BM-(\d{4})-.*\.md$")
BENCH_RE = re.compile(r"^BENCH-(\d{4})-.*\.md$")


def main() -> int:
    bm: dict[str, list[Path]] = defaultdict(list)
    bench: dict[str, list[Path]] = defaultdict(list)

    for p in ROOT.rglob("docs/01-product/BUSINESS-MASTERS/**/*.md"):
        m = BM_RE.match(p.name)
        if m:
            bm[m.group(1)].append(p)

    for p in ROOT.rglob("docs/01-product/BENCHMARKS/**/*.md"):
        m = BENCH_RE.match(p.name)
        if m:
            bench[m.group(1)].append(p)

    bad: list[str] = []

    # BM: core/controls/metrics beklenir (paket yaklaşımı)
    for num, files in bm.items():
        names = [f.name.lower() for f in files]
        need = ["core", "controls", "metrics"]
        missing = [k for k in need if not any(k in n for n in names)]
        if missing:
            bad.append(f"BM-{num}: missing pack parts {missing} (found {len(files)} files)")

    # BENCH: matrix + gaps beklenir
    for num, files in bench.items():
        names = [f.name.lower() for f in files]
        need = ["matrix", "gaps"]
        missing = [k for k in need if not any(k in n for n in names)]
        if missing:
            bad.append(f"BENCH-{num}: missing pack parts {missing} (found {len(files)} files)")

    if bad:
        print("[check_bm_bench_pack_integrity] FAIL:")
        for x in bad:
            print("- " + x)
        return 1

    print("[check_bm_bench_pack_integrity] PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())

