#!/usr/bin/env node
import { createServer } from 'http';
import { execSync } from 'child_process';
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

const runCurl = (command) => {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    const stdout = error.stdout?.toString();
    const stderr = error.stderr?.toString();
    return `${stdout ?? ''}${stderr ?? ''}`;
  }
};

server.listen(PORT, '127.0.0.1', () => {
  const curl401 = `curl -i -s -H "X-Trace-Id: smoke-401" http://127.0.0.1:${PORT}/api/v1/users`;
  const curl200 = `curl -i -s -H "Authorization: Bearer demo-token" -H "X-Trace-Id: smoke-200" http://127.0.0.1:${PORT}/api/v1/users`;
  const output = [];
  output.push(`$ ${curl401}\n${runCurl(curl401)}`);
  output.push(`$ ${curl200}\n${runCurl(curl200)}`);

  const artifactDir = join(dirname(fileURLToPath(import.meta.url)), 'artifacts');
  mkdirSync(artifactDir, { recursive: true });
  const artifactPath = join(artifactDir, 'gateway-smoke.log');
  writeFileSync(artifactPath, output.join('\n\n'));
  server.close(() => {
    console.log(`Gateway smoke log written to ${artifactPath}`);
  });
});
