// @vitest-environment jsdom
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import UsersGrid from '../UsersGrid.ui';

vi.mock('../../../../i18n/useUsersI18n', () => ({
  useUsersI18n: () => ({ t: (k: string) => k, locale: 'tr' }),
}));

// Capture props passed to EntityGridTemplate
let mockCapturedProps: any = null;

const mockFetchUsers = vi.hoisted(() => vi.fn());

vi.mock('../../../../entities/user/api/users.api', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, fetchUsers: mockFetchUsers };
});

vi.mock('@mfe/design-system', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    EntityGridTemplate: (props: any) => {
      mockCapturedProps = props;
      return null;
    },
  };
});

describe('UsersGrid SSRM dedup', () => {
  beforeEach(() => {
    mockCapturedProps = null;
    mockFetchUsers.mockResolvedValue({
      items: [{ id: '1', email: 'john@example.com' }],
      total: 1,
      page: 1,
      pageSize: 50,
      meta: { reason: 'success' },
    });
  });

  it('aynı blok için eşzamanlı iki getRows çağrısını tek fetchUsers çağrısına indirger', async () => {
    render(<UsersGrid onSelectUser={() => {}} />);

    // Access probe tamamlanıp EntityGridTemplate render edilene kadar bekle
    await waitFor(() => expect(mockCapturedProps).not.toBeNull());

    // createServerSideDatasource props üzerinden alınır
    expect(typeof mockCapturedProps?.createServerSideDatasource).toBe('function');

    const ds = mockCapturedProps.createServerSideDatasource({ gridApi: {} });

    // Access probe çağrısını temizle
    mockFetchUsers.mockClear();

    const paramsA: any = {
      request: { startRow: 0, endRow: 50, filterModel: {}, sortModel: [] },
      success: vi.fn(),
      fail: vi.fn(),
    };
    const paramsB: any = {
      request: { startRow: 0, endRow: 50, filterModel: {}, sortModel: [] },
      success: vi.fn(),
      fail: vi.fn(),
    };

    // İki çağrıyı eşzamanlı tetikle
    const p1 = ds.getRows(paramsA);
    const p2 = ds.getRows(paramsB);

    await Promise.all([p1, p2]);

    // fetchUsers sadece 1 kez çağrılmalı (dedup çalışıyor)
    expect(mockFetchUsers.mock.calls.length).toBe(1);

    // Başarı callback'leri her iki çağrı için de çalışmalı
    expect(paramsA.success).toHaveBeenCalledTimes(1);
    expect(paramsB.success).toHaveBeenCalledTimes(1);
    expect(paramsA.fail).not.toHaveBeenCalled();
    expect(paramsB.fail).not.toHaveBeenCalled();
  });
});
