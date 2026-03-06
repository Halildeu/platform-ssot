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
  res.end(JSON.stringify(responseBody, null, 2));
});

const runFetch = async (pathName, headers = {}) => {
  const response = await fetch(`http://127.0.0.1:${PORT}${pathName}`, {
    method: 'GET',
    headers,
  });
  const body = await response.text();
  const headerLines = [...response.headers.entries()]
    .filter(([key]) => key.toLowerCase() !== 'date')
    .map(([key, value]) => `${key}: ${value}`);
  return [
    `HTTP/1.1 ${response.status} ${response.statusText}`,
    ...headerLines,
    '',
    body,
  ].join('\n');
};

server.listen(PORT, '127.0.0.1', async () => {
  const req401 = 'GET /api/v1/users (no token)';
  const req200 = 'GET /api/v1/users (demo token)';
  const output = [];
  try {
    const res401 = await runFetch('/api/v1/users', { 'X-Trace-Id': 'smoke-401' });
    const res200 = await runFetch('/api/v1/users', {
      Authorization: 'Bearer demo-token',
      'X-Trace-Id': 'smoke-200',
    });
    output.push(`$ ${req401}\n${res401}`);
    output.push(`$ ${req200}\n${res200}`);
  } catch (error) {
    output.push(`gateway-smoke error: ${error instanceof Error ? error.message : String(error)}`);
  }

  const artifactDir = join(dirname(fileURLToPath(import.meta.url)), 'artifacts');
  mkdirSync(artifactDir, { recursive: true });
  const artifactPath = join(artifactDir, 'gateway-smoke.log');
  writeFileSync(artifactPath, output.join('\n\n'));
  server.close(() => {
    console.log(`Gateway smoke log written to ${artifactPath}`);
  });
});
