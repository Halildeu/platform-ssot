import { auditEventsManifest } from './events.manifest';

describe('auditEventsManifest', () => {
  it('has the correct id', () => {
    expect(auditEventsManifest.id).toBe('audit-events');
  });

  it('defines a feature flag', () => {
    expect(auditEventsManifest.featureFlag).toBe('audit_feed_enabled');
  });

  it('defines a route path and element', () => {
    expect(auditEventsManifest.route.path).toBe('/audit/events');
    expect(auditEventsManifest.route.element).toBe('AuditApp');
  });

  it('defines page metadata with title and description', () => {
    expect(auditEventsManifest.page.title).toBeTruthy();
    expect(auditEventsManifest.page.description).toBeTruthy();
  });

  it('defines breadcrumb items', () => {
    expect(auditEventsManifest.page.breadcrumbItems).toHaveLength(3);
    expect(auditEventsManifest.page.breadcrumbItems[0].title).toContain('observability');
  });

  it('defines filter configurations', () => {
    expect(auditEventsManifest.filters.length).toBeGreaterThanOrEqual(3);
    const filterKeys = auditEventsManifest.filters.map((f) => f.key);
    expect(filterKeys).toContain('userEmail');
    expect(filterKeys).toContain('service');
    expect(filterKeys).toContain('level');
  });

  it('defines level filter as select type with options', () => {
    const levelFilter = auditEventsManifest.filters.find((f) => f.key === 'level');
    expect(levelFilter?.type).toBe('select');
    expect(levelFilter?.options).toBeDefined();
    expect(levelFilter?.options?.length).toBeGreaterThanOrEqual(4);
  });

  it('defines grid columns matching AuditEvent fields', () => {
    const columnKeys = auditEventsManifest.grid.columns.map((c) => c.field);
    expect(columnKeys).toContain('timestamp');
    expect(columnKeys).toContain('userEmail');
    expect(columnKeys).toContain('service');
    expect(columnKeys).toContain('action');
    expect(columnKeys).toContain('level');
    expect(columnKeys).toContain('correlationId');
  });

  it('defines drawer tabs for summary, diff, and raw', () => {
    const tabKeys = auditEventsManifest.drawer.tabs.map((t) => t.key);
    expect(tabKeys).toEqual(['summary', 'diff', 'raw']);
  });
});
