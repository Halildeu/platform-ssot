import { EMPTY_AUDIT_FEED_FILTERS, parseAuditFeedSearch } from './audit-feed-deeplink';

describe('parseAuditFeedSearch', () => {
  it('audit id ve filtreleri query stringten okur', () => {
    expect(
      parseAuditFeedSearch('?auditId=42&service=auth-service&action=SESSION_CREATED&user=admin%40example.com'),
    ).toEqual({
      auditId: '42',
      filters: {
        userEmail: 'admin@example.com',
        service: 'auth-service',
        level: '',
        action: 'SESSION_CREATED',
      },
    });
  });

  it('bos query icin varsayilan filtreleri dondurur', () => {
    expect(parseAuditFeedSearch('')).toEqual({
      auditId: null,
      filters: EMPTY_AUDIT_FEED_FILTERS,
    });
  });
});
