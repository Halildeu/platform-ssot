/// <reference types="cypress" />
/* global Cypress, cy */

const JWT_HEADER = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';
const JWT_SIGNATURE = 'shell';
const AUTH_CHANNEL_NAME = 'shell-auth';

const buildTestSession = (win, permissions = [], options = {}) => {
  const signature = options.tokenSignature ?? JWT_SIGNATURE;
  const tokenPayload = {
    permissions,
    sessionTimeoutMinutes: 60,
  };
  const encodedPayload = win
    .btoa(JSON.stringify(tokenPayload))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return {
    token: `${JWT_HEADER}.${encodedPayload}.${signature}`,
    profile: {
      id: options.id ?? 'cypress-user',
      fullName: options.fullName ?? 'Cypress Test User',
      email: options.email ?? 'cypress@test.local',
      permissions,
      role: options.role ?? 'ADMIN',
    },
  };
};

const applyShellAuthState = (win, permissions = [], options = {}) => {
  const session = buildTestSession(win, permissions, options);
  const payload = { token: session.token, profile: session.profile, expiresAt: Date.now() + 60 * 60 * 1000 };

  try {
    win.localStorage.setItem('token', session.token);
    win.localStorage.setItem('user', JSON.stringify(session.profile));
    win.localStorage.setItem('tokenExpiresAt', String(payload.expiresAt));
    if (options.localStorage && typeof options.localStorage === 'object') {
      Object.entries(options.localStorage).forEach(([key, value]) => {
        win.localStorage.setItem(key, value);
      });
    }
  } catch {
    // ignore storage write failures in test runtime
  }

  if (options.runtimeEnv && typeof options.runtimeEnv === 'object') {
    const nextEnv = { ...(win.__env__ ?? {}), ...options.runtimeEnv };
    win.__env__ = nextEnv;
    win.__ENV__ = nextEnv;
  }

  const store = win.__shellStore;
  if (store?.dispatch) {
    store.dispatch({
      type: 'auth/setKeycloakSession',
      payload: {
        token: session.token,
        profile: session.profile,
        expiresAt: payload.expiresAt,
      },
    });
    store.dispatch({ type: 'auth/setAuthInitialized', payload: true });
  }

  if (typeof win.BroadcastChannel === 'function') {
    const channel = new win.BroadcastChannel(AUTH_CHANNEL_NAME);
    channel.postMessage(payload);
  } else {
    win.dispatchEvent(new win.CustomEvent('shell:set-auth-state', { detail: payload }));
  }
};

Cypress.Commands.add('setShellAuthState', (permissions = [], options = {}) => {
  cy.window().then((win) => {
    applyShellAuthState(win, permissions, options);
  });
});

Cypress.Commands.add('visitWithShellAuth', (path, permissions = [], options = {}) => {
  cy.visit(path, {
    failOnStatusCode: false,
    onBeforeLoad(win) {
      applyShellAuthState(win, permissions, options);
    },
  });

  cy.window().then((win) => {
    applyShellAuthState(win, permissions, options);
  });
});
