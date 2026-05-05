import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hoistedMocks = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockHttpClient = { get: mockGet };
  const mockGetShellServices = vi.fn();
  return { mockGet, mockHttpClient, mockGetShellServices };
});

const { mockGet, mockGetShellServices } = hoistedMocks;

vi.mock('@mfe/shared-http', () => ({
  api: hoistedMocks.mockHttpClient,
}));

vi.mock('../../../app/services/shell-services', () => ({
  getShellServices: () => hoistedMocks.mockGetShellServices(),
}));

import { exportReportData, fetchReportData, fetchReportMetadata } from '../api';

describe('dynamic-report api X-Company-Id header propagation', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGetShellServices.mockReset();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('shell-services source', () => {
    it('uses getCurrentCompanyId() when shell-services exposes it', async () => {
      mockGetShellServices.mockReturnValue({
        http: hoistedMocks.mockHttpClient,
        getCurrentCompanyId: () => 7,
      });
      mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

      await fetchReportData('fin-muhasebe-detay', {}, { page: 1, pageSize: 50 });

      expect(mockGet).toHaveBeenCalledTimes(1);
      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '7' });
    });

    it('coerces numeric company id to string', async () => {
      mockGetShellServices.mockReturnValue({
        http: hoistedMocks.mockHttpClient,
        getCurrentCompanyId: () => 35,
      });
      mockGet.mockResolvedValue({ data: { foo: 'bar' } });

      await fetchReportMetadata('fin-muhasebe-detay');

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '35' });
    });
  });

  describe('localStorage fallback', () => {
    beforeEach(() => {
      mockGetShellServices.mockReturnValue({ http: hoistedMocks.mockHttpClient });
      window.localStorage.setItem('reporting:currentCompanyId', '12');
    });

    it('reads localStorage when shell-services has no getCurrentCompanyId', async () => {
      mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

      await fetchReportData('fin-muhasebe-detay', {}, { page: 1, pageSize: 50 });

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '12' });
    });

    it('attaches header to export() requests', async () => {
      mockGet.mockResolvedValue({ data: new Blob(['x']) });

      await exportReportData('fin-muhasebe-detay', {}, 'csv');

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '12' });
      expect(options?.responseType).toBe('blob');
    });
  });

  describe('header omitted when no source', () => {
    beforeEach(() => {
      mockGetShellServices.mockReturnValue({ http: hoistedMocks.mockHttpClient });
      window.localStorage.removeItem('reporting:currentCompanyId');
    });

    it('omits X-Company-Id header when no shell value and no localStorage', async () => {
      mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

      await fetchReportData('fin-muhasebe-detay', {}, { page: 1, pageSize: 50 });

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers ?? {}).toEqual({});
    });

    it('survives when shell-services throws (e.g. unit test environment)', async () => {
      mockGetShellServices.mockImplementation(() => {
        throw new Error('shell not registered');
      });
      window.localStorage.setItem('reporting:currentCompanyId', '4');
      mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

      await fetchReportData('fin-muhasebe-detay', {}, { page: 1, pageSize: 50 });

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '4' });
    });

    it('ignores blank shell-services value and falls through to localStorage', async () => {
      mockGetShellServices.mockReturnValue({
        http: hoistedMocks.mockHttpClient,
        getCurrentCompanyId: () => '',
      });
      window.localStorage.setItem('reporting:currentCompanyId', '99');
      mockGet.mockResolvedValue({ data: { items: [], total: 0 } });

      await fetchReportMetadata('fin-muhasebe-detay');

      const [, options] = mockGet.mock.calls[0];
      expect(options?.headers).toEqual({ 'X-Company-Id': '99' });
    });
  });
});
