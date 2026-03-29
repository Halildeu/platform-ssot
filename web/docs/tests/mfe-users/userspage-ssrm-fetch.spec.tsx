/**
 * Amaç: Users sayfası açılışında SSRM veri çağrısının yalnızca 1 kez yapılmasını doğrulamak (fetch/axios üzerinden).
 * Yöntem: global.fetch (veya axios) mock'lanır, `/api/users/all` uç noktasına yapılan çağrı sayısı ölçülür.
 * Notlar:
 * - Bu test bir şablondur. Kendi UsersPage veya UsersApp bileşeninizi doğru path ile import edin.
 * - SSRM ilk blok yüklemesinde tek çağrı hedeflenir. Dev StrictMode çift tetikleme yapabilir.
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';

// TODO: Kendi gerçek sayfa/bileşen yolunuzu girin
// import UsersPage from 'apps/mfe-users/src/modules/users/UsersPage';
// Geçici dummy bileşen (şablon açıklaması için). Projede gerçek UsersPage'i import edin.
const UsersPage: React.FC = () => <div>UsersPage</div>;

describe('UsersPage SSRM initial fetch', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
    // fetch mock: /api/users/all* isteklerine 200 dön
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : String(input);
      if (url.includes('/api/users/all')) {
        return Promise.resolve(new Response(JSON.stringify({ items: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }));
      }
      return Promise.resolve(new Response(null, { status: 404 }));
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('ilk yüklemede /api/users/all tek çağrı', async () => {
    render(<UsersPage />);

    // SSRM çağrısını bekle
    await waitFor(() => {
      expect((global.fetch as Mock)).toHaveBeenCalled();
    });

    // /api/users/all çağrılarını say
    const calls = (global.fetch as Mock).mock.calls.filter(([input]: [RequestInfo | URL]) => {
      const url = typeof input === 'string' ? input : String(input);
      return url.includes('/api/users/all');
    });

    expect(calls.length).toBe(1);
  });
});
