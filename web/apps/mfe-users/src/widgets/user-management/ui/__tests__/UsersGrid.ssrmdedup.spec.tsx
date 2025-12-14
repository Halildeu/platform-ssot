import React from 'react';
import { render } from '@testing-library/react';

// Test target
import UsersGrid from '../UsersGrid.ui';

// Capture props passed to EntityGridTemplate
let capturedProps: any = null;

jest.mock('mfe-ui-kit', () => ({
  EntityGridTemplate: (props: any) => {
    capturedProps = props;
    return null;
  },
}));

describe('UsersGrid SSRM dedup', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    capturedProps = null;
    jest.resetAllMocks();
    // Mock fetch to emulate /api/users/all
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ items: [{ id: '1', email: 'john@example.com' }], total: 1 }),
    })) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  it('aynı blok için eşzamanlı iki getRows çağrısını tek ağ çağrısına indirger', async () => {
    render(<UsersGrid onSelectUser={() => {}} />);

    // createServerSideDatasource props üzerinden alınır
    expect(typeof capturedProps?.createServerSideDatasource).toBe('function');

    const ds = capturedProps.createServerSideDatasource({ gridApi: {}, columnApi: {} });

    const paramsA: any = {
      request: { startRow: 0, endRow: 50, filterModel: {}, sortModel: [] },
      success: jest.fn(),
      fail: jest.fn(),
    };
    const paramsB: any = {
      request: { startRow: 0, endRow: 50, filterModel: {}, sortModel: [] },
      success: jest.fn(),
      fail: jest.fn(),
    };

    // İki çağrıyı eşzamanlı tetikle
    const p1 = ds.getRows(paramsA);
    const p2 = ds.getRows(paramsB);

    await Promise.all([p1, p2]);

    // Ağ sadece 1 kez çağrılmalı
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);

    // Başarı callback'leri her iki çağrı için de çalışmalı
    expect(paramsA.success).toHaveBeenCalledTimes(1);
    expect(paramsB.success).toHaveBeenCalledTimes(1);
    expect(paramsA.fail).not.toHaveBeenCalled();
    expect(paramsB.fail).not.toHaveBeenCalled();
  });
});

