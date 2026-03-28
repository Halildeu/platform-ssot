#!/usr/bin/env python3
"""
Dev Server Health Monitor
─────────────────────────
Sürekli çalışır, port durumlarını izler, crash anında neden yakalanır.

Kullanım:
  python3 scripts/health/monitor-dev-servers.sh                # foreground
  python3 scripts/health/monitor-dev-servers.sh --daemon       # background
  python3 scripts/health/monitor-dev-servers.sh --interval 5   # 5sn arası

Env:
  MONITOR_INTERVAL=10          saniye (default: 10)
  MONITOR_LOG=logs/monitor.log log dosyası
"""
import json
import os
import signal
import socket
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = ROOT_DIR / "logs"
MONITOR_LOG = Path(os.environ.get("MONITOR_LOG", str(LOG_DIR / "monitor.log")))
INTERVAL = int(os.environ.get("MONITOR_INTERVAL", "10"))
HEARTBEAT_CYCLES = 30  # her 30 cycle'da memory raporu

SERVICES = [
    ("shell", 3000),
    ("suggestions", 3001),
    ("ethic", 3002),
    ("users", 3004),
    ("access", 3005),
    ("audit", 3006),
    ("reporting", 3007),
]


def ts() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def is_listening(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.3)
        return s.connect_ex(("127.0.0.1", port)) == 0


def get_pid_for_port(port: int) -> str | None:
    try:
        out = subprocess.check_output(
            ["lsof", "-iTCP:%d" % port, "-sTCP:LISTEN", "-Pn", "-t"],
            stderr=subprocess.DEVNULL,
            text=True,
        ).strip()
        return out.split("\n")[0] if out else None
    except subprocess.CalledProcessError:
        return None


def get_rss_mb(pid: str) -> int:
    try:
        out = subprocess.check_output(
            ["ps", "-o", "rss=", "-p", pid],
            stderr=subprocess.DEVNULL,
            text=True,
        ).strip()
        return int(out) // 1024 if out else 0
    except (subprocess.CalledProcessError, ValueError):
        return 0


def capture_crash_context(name: str, port: int, prev_pid: str | None) -> list[str]:
    lines: list[str] = []
    lines.append(f"  [crash] service={name} port={port} prev_pid={prev_pid or '?'}")

    # Son log satırları
    log_file = LOG_DIR / f"{name}.log"
    if log_file.exists():
        try:
            tail = log_file.read_text(errors="replace").rstrip().split("\n")[-15:]
            lines.append(f"  [crash] son {len(tail)} satir ({log_file.name}):")
            for l in tail:
                lines.append(f"    {l}")
        except Exception:
            pass

    # macOS system log — exit/signal/kill
    if prev_pid:
        try:
            out = subprocess.check_output(
                [
                    "log", "show", "--last", "2m",
                    "--predicate", f"processID == {prev_pid}",
                    "--style", "compact",
                ],
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=5,
            )
            hits = [l for l in out.split("\n") if any(k in l.lower() for k in ("exit", "signal", "kill", "term", "abort"))]
            if hits:
                lines.append("  [crash] system log:")
                for h in hits[-3:]:
                    lines.append(f"    {h}")
        except Exception:
            pass

    # Aktif node process snapshot
    try:
        out = subprocess.check_output(
            ["ps", "-eo", "pid,rss,command"],
            stderr=subprocess.DEVNULL,
            text=True,
        )
        node_lines = [l for l in out.split("\n") if "vite" in l and "grep" not in l]
        if node_lines:
            lines.append("  [crash] aktif vite processleri:")
            for nl in node_lines[:10]:
                parts = nl.split()
                if len(parts) >= 2:
                    lines.append(f"    pid={parts[0]} rss={int(parts[1])//1024}MB")
    except Exception:
        pass

    return lines


def log(*args: object) -> None:
    msg = " ".join(str(a) for a in args)
    print(msg, flush=True)


def main() -> None:
    # ── Parse args ──
    interval = INTERVAL
    daemon = False
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--daemon":
            daemon = True
        elif args[i] == "--interval" and i + 1 < len(args):
            interval = int(args[i + 1])
            i += 1
        i += 1

    # ── Daemon mode ──
    if daemon:
        MONITOR_LOG.parent.mkdir(parents=True, exist_ok=True)
        log_fh = open(MONITOR_LOG, "a", buffering=1)
        pid = os.fork()
        if pid > 0:
            print(f"[monitor] daemon baslatildi (pid={pid}, log={MONITOR_LOG})")
            sys.exit(0)
        # child
        os.setsid()
        sys.stdout = log_fh
        sys.stderr = log_fh
        signal.signal(signal.SIGHUP, signal.SIG_IGN)

    # ── State ──
    prev_state: dict[str, str] = {}     # name -> "up"|"down"
    prev_pid: dict[str, str | None] = {}
    down_since: dict[str, str] = {}

    # İlk durum
    log(f"{ts()} [monitor] baslatildi (interval={interval}s, pid={os.getpid()})")
    log(f"{ts()} [monitor] ilk durum:")
    for name, port in SERVICES:
        pid = get_pid_for_port(port)
        if pid:
            rss = get_rss_mb(pid)
            log(f"  {name} :{port} ✓ pid={pid} {rss}MB")
            prev_state[name] = "up"
            prev_pid[name] = pid
        else:
            log(f"  {name} :{port} ✗ kapali")
            prev_state[name] = "down"
            prev_pid[name] = None

    # ── Main loop ──
    cycle = 0
    while True:
        time.sleep(interval)
        cycle += 1

        for name, port in SERVICES:
            pid = get_pid_for_port(port)
            was = prev_state.get(name, "down")

            if pid:
                if was != "up":
                    log(f"{ts()} [monitor] ↑ {name} :{port} AYAGA KALKTI (pid={pid})")
                    if name in down_since:
                        log(f"  kapali kalma: {down_since[name]} → {ts()}")
                        del down_since[name]
                elif prev_pid.get(name) != pid:
                    log(f"{ts()} [monitor] ↻ {name} :{port} PID DEGISTI ({prev_pid.get(name, '?')} → {pid}) — restart")
                prev_state[name] = "up"
                prev_pid[name] = pid
            else:
                if was == "up":
                    log(f"{ts()} [monitor] ✗ {name} :{port} DUSTU! (onceki pid={prev_pid.get(name, '?')})")
                    for line in capture_crash_context(name, port, prev_pid.get(name)):
                        log(line)
                    down_since[name] = ts()
                prev_state[name] = "down"
                prev_pid[name] = None

        # Heartbeat
        if cycle % HEARTBEAT_CYCLES == 0:
            parts = []
            total = 0
            for name, port in SERVICES:
                if prev_state.get(name) == "up" and prev_pid.get(name):
                    rss = get_rss_mb(prev_pid[name])
                    total += rss
                    parts.append(f"{name}:{rss}MB")
                else:
                    parts.append(f"{name}:✗")
            log(f"{ts()} [heartbeat] {' '.join(parts)} | toplam={total}MB")

    # ── Crash report summary (JSON) ──
    # Bu kısım sadece monitor durdurulursa çalışır


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log(f"\n{ts()} [monitor] durduruldu (Ctrl+C)")
