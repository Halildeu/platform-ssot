#!/usr/bin/env node
import { createServer } from 'http';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const PORT = 4815;

const server = createServer((req, res) => {
  const traceId = req.headers['x-trace-id'] || 'n/a';
  const authHeader = req.headers.authorization || '';
  const responseBody = {
    path: req.url,
    traceId,
    hasAuth: Boolean(authHeader),
    authHeader,
  };
  if (authHeader === 'Bearer demo-token') {
    res.statusCode = 200;
    responseBody.message = 'gateway-ok';
  } else {
    res.statusCode = 401;
    responseBody.error = 'auth_required';
  }
  res.setHeader('content-type', 'application/json');
  res.setHeader('connection', 'close');
  res.end(JSON.stringify(responseBody, null, 2));
});

server.keepAliveTimeout = 0;
server.headersTimeout = 5_000;

const runRequest = async ({ label, path, headers = {} }) => {
  const url = `http://127.0.0.1:${PORT}${path}`;
  const response = await fetch(url, {
    headers,
  });
  const body = await response.text();
  const headerLines = Array.from(response.headers.entries()).map(
    ([key, value]) => `${key}: ${value}`,
  );
  return [
    `$ ${label}`,
    `HTTP ${response.status}`,
    ...headerLines,
    '',
    body,
  ].join('\n');
};

server.listen(PORT, '127.0.0.1', async () => {
  try {
    const artifactDir = join(dirname(fileURLToPath(import.meta.url)), 'artifacts');
    mkdirSync(artifactDir, { recursive: true });
    const artifactPath = join(artifactDir, 'gateway-smoke.log');
    const output = await Promise.all([
      runRequest({
        label: `GET /api/v1/users [trace=smoke-401]`,
        path: '/api/v1/users',
        headers: { 'X-Trace-Id': 'smoke-401' },
      }),
      runRequest({
        label: `GET /api/v1/users [trace=smoke-200 auth=bearer]`,
        path: '/api/v1/users',
        headers: {
          Authorization: 'Bearer demo-token',
          'X-Trace-Id': 'smoke-200',
        },
      }),
    ]);
    writeFileSync(artifactPath, output.join('\n\n'), 'utf8');
    server.closeAllConnections?.();
    server.close(() => {
      console.log(`Gateway smoke log written to ${artifactPath}`);
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    server.closeAllConnections?.();
    server.close();
  }
});
