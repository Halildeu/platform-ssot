/**
 * Vite plugin: /api/services endpoint — live health checks
 * Port scan + docker compose status + process info
 * Backend API (port 8795) olmadan çalışır.
 */
import type { Plugin, ViteDevServer } from 'vite';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import * as net from 'net';

// ── Service registry ──
interface ServiceDef {
  name: string;
  port: number;
  category: 'core' | 'auth' | 'business' | 'data' | 'observability' | 'frontend';
  type: 'docker' | 'process';
  dockerName?: string; // partial match in docker compose ps
}

const SERVICES: ServiceDef[] = [
  // Frontend (Vite dev servers)
  { name: 'mfe-shell',        port: 3000, category: 'frontend',      type: 'process' },
  { name: 'mfe-suggestions',  port: 3001, category: 'frontend',      type: 'process' },
  { name: 'mfe-ethic',        port: 3002, category: 'frontend',      type: 'process' },
  { name: 'mfe-users',        port: 3004, category: 'frontend',      type: 'process' },
  { name: 'mfe-access',       port: 3005, category: 'frontend',      type: 'process' },
  { name: 'mfe-audit',        port: 3006, category: 'frontend',      type: 'process' },
  { name: 'mfe-reporting',    port: 3007, category: 'frontend',      type: 'process' },

  // Backend (Docker)
  { name: 'api-gateway',        port: 8080, category: 'core',         type: 'docker', dockerName: 'api-gateway' },
  { name: 'keycloak',           port: 8081, category: 'auth',         type: 'docker', dockerName: 'keycloak' },
  { name: 'auth-service',       port: 8088, category: 'auth',         type: 'docker', dockerName: 'auth-service' },
  { name: 'user-service',       port: 8089, category: 'business',     type: 'docker', dockerName: 'user-service' },
  { name: 'permission-service', port: 8090, category: 'auth',         type: 'docker', dockerName: 'permission-service' },
  { name: 'variant-service',    port: 8091, category: 'business',     type: 'docker', dockerName: 'variant-service' },
  { name: 'core-data-service',  port: 8092, category: 'data',         type: 'docker', dockerName: 'core-data-service' },
  { name: 'report-service',     port: 8095, category: 'data',         type: 'docker', dockerName: 'report-service' },

  // Infrastructure (Docker)
  { name: 'postgres',           port: 5432, category: 'data',         type: 'docker', dockerName: 'postgres' },
  { name: 'discovery-server',   port: 8761, category: 'core',         type: 'docker', dockerName: 'discovery' },
  { name: 'vault',              port: 8200, category: 'core',         type: 'docker', dockerName: 'vault' },
  { name: 'grafana',            port: 3010, category: 'observability', type: 'docker', dockerName: 'grafana' },
  { name: 'prometheus',         port: 9090, category: 'observability', type: 'docker', dockerName: 'prometheus' },
];

const BACKEND_DIR = join(process.env.HOME || '', 'Documents/dev/backend');
const WEB_LOG_DIR = join(process.env.HOME || '', 'Documents/dev/web/logs');

// ── Port check ──
function checkPort(port: number, timeout = 500): Promise<{ open: boolean; responseTime: number }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const sock = new net.Socket();
    sock.setTimeout(timeout);
    sock.on('connect', () => {
      const elapsed = Date.now() - start;
      sock.destroy();
      resolve({ open: true, responseTime: elapsed });
    });
    sock.on('timeout', () => {
      sock.destroy();
      resolve({ open: false, responseTime: timeout });
    });
    sock.on('error', () => {
      sock.destroy();
      resolve({ open: false, responseTime: Date.now() - start });
    });
    sock.connect(port, '127.0.0.1');
  });
}

// ── PID for port (macOS/Linux) ──
function getPidForPort(port: number): string | null {
  try {
    const out = execSync(`lsof -iTCP:${port} -sTCP:LISTEN -Pn -t 2>/dev/null`, { encoding: 'utf-8' }).trim();
    return out.split('\n')[0] || null;
  } catch {
    return null;
  }
}

// ── Process stats ──
function getProcessStats(pid: string): { rssMb: number; cpu: number; uptime: string } | null {
  try {
    const out = execSync(`ps -o rss=,pcpu=,etime= -p ${pid} 2>/dev/null`, { encoding: 'utf-8' }).trim();
    if (!out) return null;
    const parts = out.split(/\s+/);
    return {
      rssMb: Math.round(parseInt(parts[0] || '0') / 1024),
      cpu: parseFloat(parts[1] || '0'),
      uptime: parts[2] || '?',
    };
  } catch {
    return null;
  }
}

// ── Docker compose status (cached) ──
let dockerCache: Map<string, { status: string; health: string; state: string }> = new Map();
let dockerStatsCache: Map<string, { rssMb: number; cpu: number }> = new Map();
let dockerCacheTime = 0;
const DOCKER_CACHE_TTL = 5000;

function refreshDockerCache(): void {
  const now = Date.now();
  if (now - dockerCacheTime < DOCKER_CACHE_TTL) return;
  dockerCacheTime = now;
  dockerCache = new Map();
  dockerStatsCache = new Map();

  // docker compose ps
  try {
    const out = execSync('docker compose ps --format json 2>/dev/null', {
      encoding: 'utf-8',
      cwd: BACKEND_DIR,
      timeout: 5000,
    }).trim();
    if (out) {
      for (const line of out.split('\n')) {
        if (!line.trim()) continue;
        try {
          const c = JSON.parse(line);
          const name = c.Name || c.Service || '';
          dockerCache.set(name, {
            status: c.Status || '?',
            health: c.Health || '',
            state: c.State || '',
          });
        } catch { /* skip bad line */ }
      }
    }
  } catch { /* docker not available */ }

  // docker stats (RAM + CPU for all containers)
  try {
    const statsOut = execSync(
      'docker stats --no-stream --format "{{.Name}}\\t{{.MemUsage}}\\t{{.CPUPerc}}" 2>/dev/null',
      { encoding: 'utf-8', timeout: 8000 },
    ).trim();
    if (statsOut) {
      for (const line of statsOut.split('\n')) {
        const parts = line.split('\t');
        if (parts.length < 3) continue;
        const name = parts[0].trim();
        const memStr = parts[1].trim().split('/')[0].trim(); // "448.5MiB" or "1.2GiB"
        const cpuStr = parts[2].trim().replace('%', '');

        let rssMb = 0;
        if (memStr.includes('GiB')) {
          rssMb = Math.round(parseFloat(memStr) * 1024);
        } else if (memStr.includes('MiB')) {
          rssMb = Math.round(parseFloat(memStr));
        } else if (memStr.includes('KiB')) {
          rssMb = Math.round(parseFloat(memStr) / 1024);
        }

        dockerStatsCache.set(name, {
          rssMb,
          cpu: parseFloat(cpuStr) || 0,
        });
      }
    }
  } catch { /* docker stats not available */ }
}

function findDockerInfo(dockerName?: string): { status: string; health: string; containerId: string } | null {
  if (!dockerName) return null;
  for (const [name, info] of dockerCache.entries()) {
    if (name.toLowerCase().includes(dockerName.toLowerCase())) {
      return {
        status: info.status,
        health: info.health,
        containerId: name,
      };
    }
  }
  return null;
}

function findDockerStats(dockerName?: string): { rssMb: number; cpu: number } | null {
  if (!dockerName) return null;
  for (const [name, stats] of dockerStatsCache.entries()) {
    if (name.toLowerCase().includes(dockerName.toLowerCase())) {
      return stats;
    }
  }
  return null;
}

// ── Log file info ──
function getLogTail(serviceName: string, tail: number): string {
  // Try frontend log
  const feLog = join(WEB_LOG_DIR, `${serviceName.replace('mfe-', '')}.log`);
  if (existsSync(feLog)) {
    try {
      return execSync(`tail -${tail} "${feLog}" 2>/dev/null`, { encoding: 'utf-8' });
    } catch { /* */ }
  }

  // Try docker logs
  for (const [name] of dockerCache.entries()) {
    if (name.toLowerCase().includes(serviceName.replace(/-/g, '').toLowerCase())) {
      try {
        return execSync(`docker logs --tail ${tail} "${name}" 2>&1`, {
          encoding: 'utf-8',
          cwd: BACKEND_DIR,
          timeout: 5000,
        });
      } catch (e: any) {
        return e.message || 'Log alinamadi';
      }
    }
  }

  return 'Log bulunamadi';
}

// ── Build service info ──
async function buildServiceInfo(def: ServiceDef): Promise<Record<string, unknown>> {
  const { open, responseTime } = await checkPort(def.port);
  const pid = def.type === 'process' ? getPidForPort(def.port) : null;
  const stats = pid ? getProcessStats(pid) : null;
  const docker = def.type === 'docker' ? findDockerInfo(def.dockerName) : null;
  const dStats = def.type === 'docker' ? findDockerStats(def.dockerName) : null;

  let health = 'UNKNOWN';
  if (open) {
    health = 'UP';
  } else if (def.type === 'docker' && docker) {
    health = docker.health === 'healthy' ? 'UP' : 'DOWN';
  } else {
    health = 'DOWN';
  }

  return {
    name: def.name,
    port: def.port,
    category: def.category,
    type: def.type,
    running: open,
    health,
    container: docker?.containerId || null,
    containerId: pid || docker?.containerId || null,
    containerStatus: docker?.status || (open ? 'running' : 'stopped'),
    startedAt: null,
    uptime: stats?.uptime || (docker?.status ? extractUptime(docker.status) : null),
    dockerHealth: docker?.health || null,
    responseTime: open ? responseTime : null,
    rssMb: stats?.rssMb || dStats?.rssMb || null,
    cpu: stats?.cpu ?? dStats?.cpu ?? null,
  };
}

function extractUptime(status: string): string | null {
  // "Up 5 minutes (healthy)" -> "5 minutes"
  const m = status.match(/Up\s+(.+?)(?:\s*\(|$)/);
  return m ? m[1].trim() : null;
}

// ── Docker actions ──
function dockerAction(containerName: string, action: 'start' | 'stop' | 'restart'): { ok: boolean; error?: string } {
  try {
    execSync(`docker compose ${action} ${containerName} 2>&1`, {
      cwd: BACKEND_DIR,
      timeout: 30000,
      encoding: 'utf-8',
    });
    dockerCacheTime = 0; // invalidate cache
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

function findDockerServiceName(serviceName: string): string | null {
  const def = SERVICES.find(s => s.name === serviceName);
  if (!def?.dockerName) return null;
  for (const [name] of dockerCache.entries()) {
    if (name.toLowerCase().includes(def.dockerName.toLowerCase())) {
      return def.dockerName;
    }
  }
  return def.dockerName;
}

// ── Plugin ──
export function serviceHealthApi(): Plugin {
  return {
    name: 'service-health-api',
    configureServer(server: ViteDevServer) {
      // GET /api/services
      server.middlewares.use('/api/services', async (req, res, next) => {
        // Only handle our routes, not proxy
        if (req.method === 'GET' && (req.url === '/' || req.url === '' || !req.url)) {
          refreshDockerCache();
          const results = await Promise.all(SERVICES.map(buildServiceInfo));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            services: results,
            timestamp: new Date().toISOString(),
          }));
          return;
        }

        // GET /api/services/{name}/logs?tail=N
        const logsMatch = req.url?.match(/^\/([^/]+)\/logs/);
        if (req.method === 'GET' && logsMatch) {
          refreshDockerCache();
          const name = logsMatch[1];
          const url = new URL(req.url!, `http://localhost`);
          const tail = parseInt(url.searchParams.get('tail') || '100');
          const logs = getLogTail(name, tail);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ logs }));
          return;
        }

        // POST /api/services/{name}/(start|stop|restart)
        const actionMatch = req.url?.match(/^\/([^/]+)\/(start|stop|restart)$/);
        if (req.method === 'POST' && actionMatch) {
          refreshDockerCache();
          const [, name, action] = actionMatch;
          const dockerSvcName = findDockerServiceName(name);

          if (!dockerSvcName) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              ok: false,
              action,
              name,
              error: 'Process tipi servisler icin npm scripts kullanin',
            }));
            return;
          }

          const result = dockerAction(dockerSvcName, action as 'start' | 'stop' | 'restart');
          res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ...result, action, name }));
          return;
        }

        // POST /api/services/bulk-action
        if (req.method === 'POST' && req.url === '/bulk-action') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { action, services: names } = JSON.parse(body);
              refreshDockerCache();
              const targets = names
                ? SERVICES.filter(s => names.includes(s.name) && s.type === 'docker')
                : SERVICES.filter(s => s.type === 'docker');

              const results = targets.map(s => {
                const dockerSvc = findDockerServiceName(s.name);
                if (!dockerSvc) return { name: s.name, ok: false, error: 'not docker' };
                return { name: s.name, ...dockerAction(dockerSvc, action) };
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ action, results }));
            } catch (e: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
