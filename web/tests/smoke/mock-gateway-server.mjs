#!/usr/bin/env node
import { createServer } from 'http';

const PORT = process.env.MOCK_GATEWAY_PORT ? Number(process.env.MOCK_GATEWAY_PORT) : 4815;

const server = createServer((req, res) => {
  const traceId = req.headers['x-trace-id'] || 'n/a';
  const authHeader = req.headers.authorization || '';
  const body = {
    path: req.url,
    traceId,
    authHeader,
    hasAuth: Boolean(authHeader),
  };
  if (authHeader === 'Bearer demo-token') {
    res.statusCode = 200;
    body.message = 'gateway-ok';
  } else {
    res.statusCode = 401;
    body.error = 'auth_required';
  }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`mock gateway listening on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
