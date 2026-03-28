#!/usr/bin/env node

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
};

const url = getArg('--url');
if (!url) {
  console.error('[http-check] --url zorunlu');
  process.exit(2);
}

const startedAt = new Date().toISOString();

try {
  const response = await fetch(url, { method: 'GET' });
  const payload = {
    ok: response.ok,
    status: response.status,
    url,
    startedAt,
    endedAt: new Date().toISOString(),
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(response.ok ? 0 : 1);
} catch (error) {
  const payload = {
    ok: false,
    status: null,
    url,
    startedAt,
    endedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(1);
}
