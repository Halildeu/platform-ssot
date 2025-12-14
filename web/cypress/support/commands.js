/// <reference types="cypress" />
/* global Cypress, cy */

const JWT_HEADER = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';
const JWT_SIGNATURE = 'shell';
const AUTH_CHANNEL_NAME = 'shell-auth';

const buildTestSession = (win, permissions = []) => {
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
    token: `${JWT_HEADER}.${encodedPayload}.${JWT_SIGNATURE}`,
    profile: {
      id: 'cypress-user',
      fullName: 'Cypress Test User',
      email: 'cypress@test.local',
      permissions,
      role: 'ADMIN',
    },
  };
};

Cypress.Commands.add('setShellAuthState', (permissions = []) => {
  cy.window().then((win) => {
    const session = buildTestSession(win, permissions);
    const payload = { token: session.token, profile: session.profile, expiresAt: Date.now() + 60 * 60 * 1000 };
    if (typeof win.BroadcastChannel === 'function') {
      const channel = new win.BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage(payload);
    } else {
      win.dispatchEvent(new win.CustomEvent('shell:set-auth-state', { detail: payload }));
    }
  });
});
