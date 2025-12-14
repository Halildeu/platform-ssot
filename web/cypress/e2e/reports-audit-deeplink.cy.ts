const REPORT_REMOTE_ENTRY = 'http://localhost:3007/remoteEntry.js*';

describe('Reports/Audit deep-link', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.intercept('GET', REPORT_REMOTE_ENTRY, (req) => req.continue()).as('getReportingRemote');
  });

  it('applies auditId/level/service from URL (guard passed)', () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.setShellAuthState(['VIEW_REPORTS']);
    cy.visit('/admin/reports/audit?auditId=a-123&level=INFO&service=users-service', {
      failOnStatusCode: false,
    });

    cy.wait('@getReportingRemote', { timeout: 20000 });
    cy.location('pathname', { timeout: 20000 }).should('include', '/admin/reports/audit');
    cy.location('search').should('include', 'auditId=a-123');
    cy.location('search').should('include', 'level=INFO');
    cy.location('search').should('include', 'service=users-service');
  });

  it('redirects to login when token missing', () => {
    cy.visit('/admin/reports/audit?auditId=a-123', { failOnStatusCode: false });
    cy.location('pathname', { timeout: 15000 }).should('eq', '/login');
  });
});
