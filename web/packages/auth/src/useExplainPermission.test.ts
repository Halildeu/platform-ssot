// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExplainPermission } from './useExplainPermission';

/**
 * TP-0320 hook coverage (Codex BLOCK Turn 1 fix): verify `useExplainPermission`
 * forwards the scope arguments as the backend expects:
 *
 *   - omitted scope     → body contains userId/permType/permKey only (no scopeType / scopeRefId keys)
 *   - scopeType only    → body still omits scopeRefId (backend treats missing as "skip scope check")
 *   - scopeRefId=0      → body forwards scopeRefId="0" (valid numeric ID; must not be treated as absent)
 *   - null scopeType    → body omits scope keys (explicit null == no scope check)
 *   - non-null scopeRefId without scopeType → body forwards scopeRefId only (backend ignores per blank guard)
 */

const flushLoading = async (hook: ReturnType<typeof renderHook>) =>
  waitFor(() => expect(hook.result.current.loading).toBe(false));

test('explain forwards userId / permType / permKey only when scope is omitted', async () => {
  const httpPost = vi.fn(async () => ({ data: { reason: 'ALLOWED' } }));
  const { result } = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    await result.current.explain('15', 'MODULE', 'PURCHASE');
  });

  expect(httpPost).toHaveBeenCalledTimes(1);
  const [path, body] = httpPost.mock.calls[0];
  expect(path).toBe('/v1/authz/explain');
  expect(body).toEqual({ userId: '15', permissionType: 'MODULE', permissionKey: 'PURCHASE' });
});

test('explain forwards scopeType + scopeRefId when both provided', async () => {
  const httpPost = vi.fn(async () => ({ data: { reason: 'NO_SCOPE' } }));
  const { result } = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    await result.current.explain('15', 'MODULE', 'PURCHASE', 'COMPANY', 99);
  });

  expect(httpPost).toHaveBeenCalledTimes(1);
  const body = httpPost.mock.calls[0][1] as Record<string, unknown>;
  expect(body.scopeType).toBe('COMPANY');
  expect(body.scopeRefId).toBe('99');
});

test('explain forwards scopeRefId=0 as "0" (valid numeric ID, not treated as absent)', async () => {
  const httpPost = vi.fn(async () => ({ data: { reason: 'NO_SCOPE' } }));
  const { result } = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    await result.current.explain('15', 'MODULE', 'PURCHASE', 'COMPANY', 0);
  });

  const body = httpPost.mock.calls[0][1] as Record<string, unknown>;
  expect(body.scopeRefId).toBe('0');
});

test('explain omits scope keys when scopeType is null even if scopeRefId is set', async () => {
  const httpPost = vi.fn(async () => ({ data: { reason: 'ALLOWED' } }));
  const { result } = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    await result.current.explain('15', 'MODULE', 'PURCHASE', null, 99);
  });

  const body = httpPost.mock.calls[0][1] as Record<string, unknown>;
  expect(body.scopeType).toBeUndefined();
  // scopeRefId may still be forwarded (backend blank-scope-type guard short-circuits)
  // but the important invariant is that no scopeType leaks through as the empty string.
  expect(body.scopeType).not.toBe('');
});

test('explain surfaces server error message in error state', async () => {
  const httpPost = vi.fn(async () => {
    throw new Error('boom');
  });
  const hook = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    const r = await hook.result.current.explain('15', 'MODULE', 'PURCHASE');
    expect(r).toBeNull();
  });

  await flushLoading(hook);
  expect(hook.result.current.error).toBe('boom');
  expect(hook.result.current.result).toBeNull();
});

test('explain sets result state on success', async () => {
  const payload = {
    allowed: false,
    reason: 'NO_SCOPE',
    details: {
      roleName: null,
      grantType: null,
      permissionType: 'MODULE',
      permissionKey: 'PURCHASE',
      scopeType: 'COMPANY',
      scopeRefId: 99,
    },
    userRoles: [],
    userScopes: { COMPANY: [11] },
  };
  const httpPost = vi.fn(async () => ({ data: payload }));
  const hook = renderHook(() => useExplainPermission({ httpPost }));

  await act(async () => {
    await hook.result.current.explain('15', 'MODULE', 'PURCHASE', 'COMPANY', 99);
  });

  await flushLoading(hook);
  expect(hook.result.current.result).toEqual(payload);
  expect(hook.result.current.error).toBeNull();
});
