import { describe, it, expect } from 'vitest';
import { resolveZanzibarAccessProps } from '../resolveZanzibarAccessProps';
import type { ZanzibarAccessResult } from '../resolveZanzibarAccessProps';

describe('resolveZanzibarAccessProps', () => {
  it('maps loading to disabled with reason', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: true, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('disabled');
    expect(props.accessReason).toContain('kontrol');
  });

  it('maps error to disabled with error message', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: false, error: 'Network error' };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('disabled');
    expect(props.accessReason).toBe('Network error');
  });

  it('maps denied to hidden by default', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: false, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('hidden');
    expect(props.accessReason).toBeDefined();
  });

  it('maps denied to disabled when showDisabledOnDeny is true', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: false, error: null };
    const props = resolveZanzibarAccessProps(result, { showDisabledOnDeny: true });
    expect(props.access).toBe('disabled');
  });

  it('maps allowed + can_manage to full', () => {
    const result: ZanzibarAccessResult = { allowed: true, relation: 'can_manage', loading: false, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('full');
    expect(props.accessReason).toBeUndefined();
  });

  it('maps allowed + can_edit to full', () => {
    const result: ZanzibarAccessResult = { allowed: true, relation: 'can_edit', loading: false, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('full');
  });

  it('maps allowed + can_view to readonly with reason', () => {
    const result: ZanzibarAccessResult = { allowed: true, relation: 'can_view', loading: false, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('readonly');
    expect(props.accessReason).toContain('Görüntüleme');
  });

  it('maps allowed + null relation to readonly (safe default)', () => {
    const result: ZanzibarAccessResult = { allowed: true, relation: null, loading: false, error: null };
    const props = resolveZanzibarAccessProps(result);
    expect(props.access).toBe('readonly');
  });

  it('uses custom denyReason when provided', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: false, error: null };
    const props = resolveZanzibarAccessProps(result, { denyReason: 'Özel neden' });
    expect(props.accessReason).toBe('Özel neden');
  });

  it('uses custom loadingReason when provided', () => {
    const result: ZanzibarAccessResult = { allowed: false, relation: null, loading: true, error: null };
    const props = resolveZanzibarAccessProps(result, { loadingReason: 'Bekleniyor...' });
    expect(props.accessReason).toBe('Bekleniyor...');
  });
});
