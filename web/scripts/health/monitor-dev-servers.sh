#!/usr/bin/env python3
"""
Dev Server Health Monitor — Live Dashboard
───────────────────────────────────────────
Canlı terminal dashboard + daemon modu.

Kullanım:
  python3 scripts/health/monitor-dev-servers.sh              # canlı dashboard
  python3 scripts/health/monitor-dev-servers.sh --daemon      # arka plan (log)
  python3 scripts/health/monitor-dev-servers.sh --interval 3  # 3sn arası
  python3 scripts/health/monitor-dev-servers.sh --once        # tek seferlik rapor
"""
import json
import os
import signal
import socket
import subprocess
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = ROOT_DIR / "logs"
MONITOR_LOG = Path(os.environ.get("MONITOR_LOG", str(LOG_DIR / "monitor.log")))
INTERVAL = int(os.environ.get("MONITOR_INTERVAL", "5"))

# ── Service definitions ──
FRONTEND_SERVICES = [
    {"name": "shell",       "port": 3000, "type": "vite"},
    {"name": "suggestions", "port": 3001, "type": "vite"},
    {"name": "ethic",       "port": 3002, "type": "vite"},
    {"name": "users",       "port": 3004, "type": "vite"},
    {"name": "access",      "port": 3005, "type": "vite"},
    {"name": "audit",       "port": 3006, "type": "vite"},
    {"name": "reporting",   "port": 3007, "type": "vite"},
]

BACKEND_SERVICES = [
    {"name": "api-gateway",        "port": 8080, "type": "docker"},
    {"name": "keycloak",           "port": 8081, "type": "docker"},
    {"name": "auth-service",       "port": 8088, "type": "docker"},
    {"name": "user-service",       "port": 8089, "type": "docker"},
    {"name": "permission-service", "port": 8090, "type": "docker"},
    {"name": "variant-service",    "port": 8091, "type": "docker"},
    {"name": "core-data-service",  "port": 8092, "type": "docker"},
    {"name": "report-service",     "port": 8095, "type": "docker"},
]

INFRA_SERVICES = [
    {"name": "postgres",    "port": 5432,  "type": "docker"},
    {"name": "eureka",      "port": 8761,  "type": "docker"},
    {"name": "vault",       "port": 8200,  "type": "docker"},
    {"name": "grafana",     "port": 3010,  "type": "docker"},
    {"name": "prometheus",  "port": 9090,  "type": "docker"},
]

ALL_SERVICES = FRONTEND_SERVICES + BACKEND_SERVICES + INFRA_SERVICES

# ── ANSI colors ──
C_RESET   = "\033[0m"
C_BOLD    = "\033[1m"
C_DIM     = "\033[2m"
C_RED     = "\033[31m"
C_GREEN   = "\033[32m"
C_YELLOW  = "\033[33m"
C_BLUE    = "\033[34m"
C_CYAN    = "\033[36m"
C_WHITE   = "\033[37m"
C_BG_RED  = "\033[41m"
C_BG_GRN  = "\033[42m"

# ── Helpers ──
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
            stderr=subprocess.DEVNULL, text=True,
        ).strip()
        return out.split("\n")[0] if out else None
    except subprocess.CalledProcessError:
        return None

def get_process_stats(pid: str) -> dict:
    """RSS, CPU%, uptime for a PID (macOS compatible)."""
    try:
        out = subprocess.check_output(
            ["ps", "-o", "rss=,pcpu=,etime=", "-p", pid],
            stderr=subprocess.DEVNULL, text=True,
        ).strip()
        if not out:
            return {}
        parts = out.split()
        rss_kb = int(parts[0]) if parts else 0
        cpu = float(parts[1]) if len(parts) > 1 else 0.0
        etime = parts[2] if len(parts) > 2 else "?"
        return {
            "rss_mb": rss_kb // 1024,
            "cpu": cpu,
            "uptime": etime,
        }
    except (subprocess.CalledProcessError, ValueError, IndexError):
        return {}

def get_connections_count(port: int) -> int:
    """Count ESTABLISHED connections to a port."""
    try:
        out = subprocess.check_output(
            ["lsof", "-iTCP:%d" % port, "-sTCP:ESTABLISHED", "-Pn"],
            stderr=subprocess.DEVNULL, text=True,
        )
        return max(0, len(out.strip().split("\n")) - 1)  # minus header
    except subprocess.CalledProcessError:
        return 0

def get_docker_containers() -> dict[str, dict]:
    """Get docker container status map: name -> {status, health}."""
    try:
        out = subprocess.check_output(
            ["docker", "compose", "ps", "--format", "json"],
            stderr=subprocess.DEVNULL, text=True,
            cwd=str(Path.home() / "Documents/dev/backend"),
        ).strip()
        if not out:
            return {}
        result = {}
        for line in out.split("\n"):
            if not line.strip():
                continue
            try:
                c = json.loads(line)
                name = c.get("Name", c.get("Service", ""))
                result[name] = {
                    "status": c.get("Status", "?"),
                    "health": c.get("Health", ""),
                    "state": c.get("State", ""),
                }
            except json.JSONDecodeError:
                continue
        return result
    except (subprocess.CalledProcessError, FileNotFoundError):
        return {}

def get_log_size(name: str) -> str:
    """Log file size for a service."""
    log_file = LOG_DIR / f"{name}.log"
    if log_file.exists():
        size = log_file.stat().st_size
        if size >= 1_000_000:
            return f"{size / 1_000_000:.1f}MB"
        if size >= 1_000:
            return f"{size // 1_000}KB"
        return f"{size}B"
    return "—"

def get_system_stats() -> dict:
    """System-wide memory and load."""
    stats = {}
    try:
        out = subprocess.check_output(["sysctl", "-n", "hw.memsize"],
                                       stderr=subprocess.DEVNULL, text=True).strip()
        stats["total_ram_gb"] = int(out) / (1024**3)
    except Exception:
        stats["total_ram_gb"] = 0

    try:
        out = subprocess.check_output(["vm_stat"], stderr=subprocess.DEVNULL, text=True)
        page_size = 16384  # Apple Silicon
        free = active = inactive = wired = 0
        for line in out.split("\n"):
            if "page size" in line:
                try:
                    page_size = int(line.split()[-2])
                except (ValueError, IndexError):
                    pass
            if "Pages free" in line:
                free = int(line.split(":")[1].strip().rstrip("."))
            elif "Pages active" in line:
                active = int(line.split(":")[1].strip().rstrip("."))
            elif "Pages inactive" in line:
                inactive = int(line.split(":")[1].strip().rstrip("."))
            elif "Pages wired" in line:
                wired = int(line.split(":")[1].strip().rstrip("."))
        used_gb = (active + wired) * page_size / (1024**3)
        free_gb = (free + inactive) * page_size / (1024**3)
        stats["used_ram_gb"] = used_gb
        stats["free_ram_gb"] = free_gb
    except Exception:
        pass

    try:
        load = os.getloadavg()
        stats["load"] = f"{load[0]:.1f} {load[1]:.1f} {load[2]:.1f}"
    except Exception:
        stats["load"] = "?"

    return stats

def format_uptime(etime: str) -> str:
    """Format ps etime (DD-HH:MM:SS or HH:MM:SS or MM:SS) to human readable."""
    if not etime or etime == "?":
        return "—"
    return etime

def ram_bar(mb: int, max_mb: int = 1500) -> str:
    """Visual bar for RAM usage."""
    width = 15
    filled = min(width, int((mb / max_mb) * width))
    if mb > 1000:
        color = C_RED
    elif mb > 500:
        color = C_YELLOW
    else:
        color = C_GREEN
    return f"{color}{'█' * filled}{C_DIM}{'░' * (width - filled)}{C_RESET}"

def status_badge(up: bool) -> str:
    if up:
        return f"{C_BG_GRN}{C_WHITE} UP {C_RESET}"
    return f"{C_BG_RED}{C_WHITE} DOWN {C_RESET}"

def health_badge(health: str) -> str:
    h = health.lower()
    if "healthy" in h:
        return f"{C_GREEN}healthy{C_RESET}"
    if "starting" in h:
        return f"{C_YELLOW}starting{C_RESET}"
    if "unhealthy" in h:
        return f"{C_RED}unhealthy{C_RESET}"
    return f"{C_DIM}{health or '—'}{C_RESET}"


# ── Crash tracking (for daemon mode) ──
class CrashTracker:
    def __init__(self):
        self.prev_state: dict[str, str] = {}
        self.prev_pid: dict[str, str | None] = {}
        self.down_since: dict[str, str] = {}
        self.crash_log: list[dict] = []

    def check(self, name: str, port: int, pid: str | None) -> list[str]:
        msgs = []
        was = self.prev_state.get(name, "unknown")

        if pid:
            if was == "down":
                msgs.append(f"{ts()} [monitor] ↑ {name} :{port} AYAGA KALKTI (pid={pid})")
                if name in self.down_since:
                    msgs.append(f"  kapali kalma: {self.down_since[name]} → {ts()}")
                    del self.down_since[name]
            elif was == "up" and self.prev_pid.get(name) != pid:
                msgs.append(f"{ts()} [monitor] ↻ {name} :{port} PID DEGISTI ({self.prev_pid.get(name, '?')} → {pid}) — restart")
            self.prev_state[name] = "up"
            self.prev_pid[name] = pid
        else:
            if was == "up":
                msgs.append(f"{ts()} [monitor] ✗ {name} :{port} DUSTU! (onceki pid={self.prev_pid.get(name, '?')})")
                msgs.extend(self._crash_context(name, port, self.prev_pid.get(name)))
                self.down_since[name] = ts()
                self.crash_log.append({"time": ts(), "service": name, "port": port, "prev_pid": self.prev_pid.get(name)})
            self.prev_state[name] = "down"
            self.prev_pid[name] = None

        return msgs

    def _crash_context(self, name: str, port: int, prev_pid: str | None) -> list[str]:
        lines = []
        log_file = LOG_DIR / f"{name}.log"
        if log_file.exists():
            try:
                tail = log_file.read_text(errors="replace").rstrip().split("\n")[-10:]
                lines.append(f"  [crash] son {len(tail)} satir ({log_file.name}):")
                for l in tail:
                    lines.append(f"    {l}")
            except Exception:
                pass

        if prev_pid:
            try:
                out = subprocess.check_output(
                    ["log", "show", "--last", "2m",
                     "--predicate", f"processID == {prev_pid}",
                     "--style", "compact"],
                    stderr=subprocess.DEVNULL, text=True, timeout=5,
                )
                hits = [l for l in out.split("\n")
                        if any(k in l.lower() for k in ("exit", "signal", "kill", "term", "abort"))]
                if hits:
                    lines.append("  [crash] system log:")
                    for h in hits[-3:]:
                        lines.append(f"    {h}")
            except Exception:
                pass

        return lines


# ── Dashboard renderer ──
def render_dashboard(cycle: int, start_time: datetime) -> str:
    lines: list[str] = []
    now = datetime.now()
    elapsed = now - start_time

    # Header
    lines.append("")
    lines.append(f"  {C_BOLD}{C_CYAN}╔══════════════════════════════════════════════════════════════════════════╗{C_RESET}")
    lines.append(f"  {C_BOLD}{C_CYAN}║{C_RESET}  {C_BOLD}DEV SERVER HEALTH DASHBOARD{C_RESET}                    {C_DIM}{now.strftime('%H:%M:%S')} │ #{cycle}{C_RESET}  {C_BOLD}{C_CYAN}║{C_RESET}")
    lines.append(f"  {C_BOLD}{C_CYAN}╚══════════════════════════════════════════════════════════════════════════╝{C_RESET}")

    # System stats
    sys_stats = get_system_stats()
    total = sys_stats.get("total_ram_gb", 0)
    used = sys_stats.get("used_ram_gb", 0)
    free = sys_stats.get("free_ram_gb", 0)
    load = sys_stats.get("load", "?")
    lines.append("")
    lines.append(f"  {C_BOLD}System{C_RESET}  RAM: {C_BOLD}{used:.1f}{C_RESET}/{total:.0f}GB kullanımda  "
                 f"Boş: {C_GREEN}{free:.1f}GB{C_RESET}  "
                 f"Load: {load}")

    # Docker containers
    docker_map = get_docker_containers()

    # ── Frontend section ──
    lines.append("")
    lines.append(f"  {C_BOLD}{C_BLUE}┌─ FRONTEND (Vite Dev Servers) ─────────────────────────────────────────┐{C_RESET}")
    lines.append(f"  {C_DIM}  {'Servis':<14} {'Durum':>6}  {'PID':>7}  {'RAM':>7}  {'':15}  {'CPU':>5}  {'Uptime':>10}  {'Conn':>4}  {'Log':>7}{C_RESET}")
    lines.append(f"  {C_DIM}  {'─'*14} {'─'*6}  {'─'*7}  {'─'*7}  {'─'*15}  {'─'*5}  {'─'*10}  {'─'*4}  {'─'*7}{C_RESET}")

    fe_total_ram = 0
    for svc in FRONTEND_SERVICES:
        name, port = svc["name"], svc["port"]
        pid = get_pid_for_port(port)
        if pid:
            stats = get_process_stats(pid)
            rss = stats.get("rss_mb", 0)
            cpu = stats.get("cpu", 0)
            uptime = format_uptime(stats.get("uptime", "?"))
            conns = get_connections_count(port)
            log_sz = get_log_size(name)
            bar = ram_bar(rss)
            fe_total_ram += rss
            lines.append(
                f"    {C_BOLD}{name:<14}{C_RESET} {status_badge(True)}  {C_DIM}{pid:>7}{C_RESET}  "
                f"{rss:>5}MB  {bar}  {cpu:>4.1f}%  {uptime:>10}  {conns:>4}  {log_sz:>7}"
            )
        else:
            lines.append(f"    {C_BOLD}{name:<14}{C_RESET} {status_badge(False)}")

    lines.append(f"  {C_DIM}  {'':14} {'':6}  {'':7}  {C_BOLD}{fe_total_ram:>5}MB{C_RESET}  {C_DIM}toplam{C_RESET}")
    lines.append(f"  {C_BOLD}{C_BLUE}└───────────────────────────────────────────────────────────────────────┘{C_RESET}")

    # ── Backend section ──
    lines.append("")
    lines.append(f"  {C_BOLD}{C_GREEN}┌─ BACKEND (Docker Services) ───────────────────────────────────────────┐{C_RESET}")
    lines.append(f"  {C_DIM}  {'Servis':<22} {'Durum':>6}  {'Health':>10}  {'Port':>5}  {'Conn':>4}  {'Container Status':<30}{C_RESET}")
    lines.append(f"  {C_DIM}  {'─'*22} {'─'*6}  {'─'*10}  {'─'*5}  {'─'*4}  {'─'*30}{C_RESET}")

    for svc in BACKEND_SERVICES:
        name, port = svc["name"], svc["port"]
        up = is_listening(port)
        conns = get_connections_count(port) if up else 0

        # Match docker container
        docker_info = None
        for dk, dv in docker_map.items():
            if name.replace("-", "") in dk.replace("-", "").replace("_", "").lower():
                docker_info = dv
                break

        health = health_badge(docker_info["health"] if docker_info else ("" if not up else ""))
        cstatus = docker_info["status"] if docker_info else "—"
        if len(cstatus) > 30:
            cstatus = cstatus[:28] + ".."

        lines.append(
            f"    {C_BOLD}{name:<22}{C_RESET} {status_badge(up)}  {health:>20}  {port:>5}  {conns:>4}  {C_DIM}{cstatus}{C_RESET}"
        )

    lines.append(f"  {C_BOLD}{C_GREEN}└───────────────────────────────────────────────────────────────────────┘{C_RESET}")

    # ── Infrastructure section ──
    lines.append("")
    lines.append(f"  {C_BOLD}{C_YELLOW}┌─ ALTYAPI (Infrastructure) ────────────────────────────────────────────┐{C_RESET}")

    for svc in INFRA_SERVICES:
        name, port = svc["name"], svc["port"]
        up = is_listening(port)
        docker_info = None
        for dk, dv in docker_map.items():
            if name in dk.lower():
                docker_info = dv
                break
        health = health_badge(docker_info["health"] if docker_info else "")
        cstatus = docker_info["status"][:28] if docker_info else "—"
        lines.append(
            f"    {name:<16} {status_badge(up)}  {health:>20}  :{port}  {C_DIM}{cstatus}{C_RESET}"
        )

    lines.append(f"  {C_BOLD}{C_YELLOW}└───────────────────────────────────────────────────────────────────────┘{C_RESET}")

    # ── Footer ──
    up_count = sum(1 for s in ALL_SERVICES if is_listening(s["port"]))
    total_count = len(ALL_SERVICES)
    pct = (up_count / total_count * 100) if total_count else 0
    color = C_GREEN if pct == 100 else C_YELLOW if pct >= 70 else C_RED

    lines.append("")
    lines.append(f"  {color}{C_BOLD}{up_count}/{total_count} servis ayakta ({pct:.0f}%){C_RESET}  "
                 f"{C_DIM}│ izleme suresi: {str(elapsed).split('.')[0]} │ interval: {INTERVAL}s │ Ctrl+C ile çık{C_RESET}")
    lines.append("")

    return "\n".join(lines)


# ── Main ──
def main() -> None:
    interval = INTERVAL
    daemon = False
    once = False

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--daemon":
            daemon = True
        elif args[i] == "--once":
            once = True
        elif args[i] == "--interval" and i + 1 < len(args):
            interval = int(args[i + 1])
            i += 1
        i += 1

    # ── Once mode: tek rapor bas ve çık ──
    if once:
        print(render_dashboard(1, datetime.now()))
        return

    # ── Daemon mode: log dosyasına yaz ──
    if daemon:
        MONITOR_LOG.parent.mkdir(parents=True, exist_ok=True)
        tracker = CrashTracker()
        log_fh = open(MONITOR_LOG, "a", buffering=1)
        pid = os.fork()
        if pid > 0:
            print(f"[monitor] daemon baslatildi (pid={pid}, log={MONITOR_LOG})")
            return
        os.setsid()
        sys.stdout = log_fh
        sys.stderr = log_fh
        signal.signal(signal.SIGHUP, signal.SIG_IGN)

        print(f"{ts()} [monitor] daemon baslatildi (interval={interval}s, pid={os.getpid()})")
        cycle = 0
        while True:
            time.sleep(interval)
            cycle += 1
            for svc in ALL_SERVICES:
                pid_str = get_pid_for_port(svc["port"])
                msgs = tracker.check(svc["name"], svc["port"], pid_str)
                for m in msgs:
                    print(m, flush=True)

            if cycle % 30 == 0:
                parts = []
                total = 0
                for svc in ALL_SERVICES:
                    pid_str = get_pid_for_port(svc["port"])
                    if pid_str:
                        stats = get_process_stats(pid_str)
                        rss = stats.get("rss_mb", 0)
                        total += rss
                        parts.append(f"{svc['name']}:{rss}MB")
                    else:
                        parts.append(f"{svc['name']}:✗")
                print(f"{ts()} [heartbeat] {' '.join(parts)} | toplam={total}MB", flush=True)
        return

    # ── Live dashboard mode ──
    start_time = datetime.now()
    cycle = 0

    # Hide cursor
    sys.stdout.write("\033[?25l")
    sys.stdout.flush()

    def restore_cursor(*_):
        sys.stdout.write("\033[?25h\n")
        sys.stdout.flush()
        sys.exit(0)

    signal.signal(signal.SIGINT, restore_cursor)
    signal.signal(signal.SIGTERM, restore_cursor)

    try:
        while True:
            cycle += 1
            output = render_dashboard(cycle, start_time)

            # Clear screen and render
            sys.stdout.write("\033[2J\033[H")
            sys.stdout.write(output)
            sys.stdout.flush()

            time.sleep(interval)
    finally:
        sys.stdout.write("\033[?25h\n")
        sys.stdout.flush()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.stdout.write("\033[?25h\n")
        sys.stdout.flush()
