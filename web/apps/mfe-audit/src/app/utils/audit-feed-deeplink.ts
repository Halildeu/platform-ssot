export type AuditFeedFilters = {
  userEmail: string;
  service: string;
  level: string;
  action: string;
};

export type AuditFeedDeepLinkState = {
  auditId: string | null;
  filters: AuditFeedFilters;
};

export const EMPTY_AUDIT_FEED_FILTERS: AuditFeedFilters = {
  userEmail: '',
  service: '',
  level: '',
  action: '',
};

const sanitizeValue = (value: string | null): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

export const parseAuditFeedSearch = (search: string): AuditFeedDeepLinkState => {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const auditId = sanitizeValue(params.get('auditId')) || null;
  const userEmail = sanitizeValue(params.get('userEmail')) || sanitizeValue(params.get('user'));

  return {
    auditId,
    filters: {
      userEmail,
      service: sanitizeValue(params.get('service')),
      level: sanitizeValue(params.get('level')),
      action: sanitizeValue(params.get('action')),
    },
  };
};
