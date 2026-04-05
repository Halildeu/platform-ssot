const REMOTE_ENTRY_PATTERN = /^\/remotes\/[^/]+\/remoteEntry\.js$/;
const ASSET_FILE_PATTERN = /\/[^/]+\.[a-zA-Z0-9]+$/;

function withSecurityHeaders(response, pathname) {
  const headers = new Headers(response.headers);

  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (pathname === '/' || pathname.endsWith('.html')) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  if (pathname === '/remoteEntry.js' || REMOTE_ENTRY_PATTERN.test(pathname)) {
    headers.set('Cache-Control', 'no-store');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function shouldServeShellIndex(request, pathname) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return false;
  }
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return false;
  }
  if (pathname === '/actuator' || pathname.startsWith('/actuator/')) {
    return false;
  }
  if (pathname.startsWith('/remotes/')) {
    return false;
  }
  if (ASSET_FILE_PATTERN.test(pathname)) {
    return false;
  }
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html') || accept.includes('*/*');
}

async function proxyToBackend(request, env, url) {
  if (!env.BACKEND_ORIGIN) {
    return new Response('BACKEND_ORIGIN is not configured.', { status: 500 });
  }

  const target = new URL(`${url.pathname}${url.search}`, env.BACKEND_ORIGIN);
  const headers = new Headers(request.headers);
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  };

  return fetch(new Request(target.toString(), init));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname === '/api'
      || url.pathname.startsWith('/api/')
      || url.pathname === '/actuator'
      || url.pathname.startsWith('/actuator/')
    ) {
      return proxyToBackend(request, env, url);
    }

    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && shouldServeShellIndex(request, url.pathname)) {
      const shellIndexUrl = new URL('/index.html', url);
      response = await env.ASSETS.fetch(new Request(shellIndexUrl, request));
    }

    return withSecurityHeaders(response, url.pathname);
  },
};
