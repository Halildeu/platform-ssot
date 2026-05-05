import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Smoke test for the shell-services-wiring `getCurrentCompanyId()` resolver.
 *
 * Codex iter-19/20 review boundary: the reporting MFE reads the active
 * company id through this accessor, which falls back through:
 *   1. localStorage['reporting:currentCompanyId']
 *   2. store.auth.authzSnapshot.allowedScopes (single COMPANY scope)
 *   3. undefined → backend MissingCompanyHeaderException for super-admin /
 *      multi-company callers
 *
 * Field contract: AuthzMe's allowedScopes[].scopeRefId is canonical;
 * legacy refId path is tolerated so older slice serializations don't
 * silently produce undefined.
 */

const hoisted = vi.hoisted(() => ({
  authState: {
    token: null as string | null,
    user: null as unknown,
    authzSnapshot: null as
      | null
      | {
          allowedScopes?: Array<{
            scopeType?: string;
            scopeRefId?: string | number | null;
            refId?: string | number | null;
          }>;
        },
  },
}));

const setAuthzSnapshot = (snapshot: typeof hoisted.authState.authzSnapshot) => {
  hoisted.authState.authzSnapshot = snapshot;
};

// Replicate the resolver pure-logic for unit testing without booting the
// full Redux store + telemetry stack. Source-of-truth: shell-services-wiring.ts
// `sharedServices.getCurrentCompanyId`.
const resolveCurrentCompanyId = (
  storage: Storage,
  authzSnapshot: typeof hoisted.authState.authzSnapshot,
): string | undefined => {
  const stored = storage.getItem('reporting:currentCompanyId');
  if (stored && stored.trim() !== '') {
    return stored;
  }
  const companyScopes = (authzSnapshot?.allowedScopes ?? []).filter(
    (s) => s?.scopeType === 'COMPANY',
  );
  if (companyScopes.length === 1) {
    const scope = companyScopes[0];
    const id = scope.scopeRefId ?? scope.refId;
    if (id !== undefined && id !== null && String(id).trim() !== '') {
      return String(id);
    }
  }
  return undefined;
};

describe('shell-services getCurrentCompanyId resolver contract', () => {
  beforeEach(() => {
    setAuthzSnapshot(null);
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns localStorage value when set', () => {
    window.localStorage.setItem('reporting:currentCompanyId', '7');
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'COMPANY', scopeRefId: '99' }],
    });
    expect(resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot)).toBe(
      '7',
    );
  });

  it('falls back to single COMPANY scope (scopeRefId) when localStorage empty', () => {
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'COMPANY', scopeRefId: 35 }],
    });
    expect(resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot)).toBe(
      '35',
    );
  });

  it('tolerates legacy refId field name on COMPANY scope', () => {
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'COMPANY', refId: 12 }],
    });
    expect(resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot)).toBe(
      '12',
    );
  });

  it('returns undefined when multiple COMPANY scopes (selection required)', () => {
    setAuthzSnapshot({
      allowedScopes: [
        { scopeType: 'COMPANY', scopeRefId: 1 },
        { scopeType: 'COMPANY', scopeRefId: 2 },
      ],
    });
    expect(
      resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot),
    ).toBeUndefined();
  });

  it('returns undefined when no COMPANY scope (super-admin path)', () => {
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'WAREHOUSE', scopeRefId: 5 }],
    });
    expect(
      resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot),
    ).toBeUndefined();
  });

  it('returns undefined when authzSnapshot is null', () => {
    setAuthzSnapshot(null);
    expect(
      resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot),
    ).toBeUndefined();
  });

  it('ignores blank scopeRefId / refId and returns undefined', () => {
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'COMPANY', scopeRefId: '   ' }],
    });
    expect(
      resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot),
    ).toBeUndefined();
  });

  it('localStorage takes priority even when COMPANY scope present', () => {
    window.localStorage.setItem('reporting:currentCompanyId', '99');
    setAuthzSnapshot({
      allowedScopes: [{ scopeType: 'COMPANY', scopeRefId: 1 }],
    });
    expect(resolveCurrentCompanyId(window.localStorage, hoisted.authState.authzSnapshot)).toBe(
      '99',
    );
  });
});
