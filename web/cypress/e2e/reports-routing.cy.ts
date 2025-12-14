const REPORT_REMOTE_ENTRY = 'http://localhost:3007/remoteEntry.js*';

const visitReports = (permissions: string[]) => {
  cy.visit('/login', { failOnStatusCode: false });
  cy.setShellAuthState(permissions);
  cy.visit('/admin/reports/users', { failOnStatusCode: false });
  cy.wait('@getReportingRemote', { timeout: 15000 });
};

describe('Reports route guards', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.intercept('GET', REPORT_REMOTE_ENTRY, (req) => req.continue()).as('getReportingRemote');
  });

  it('redirects to login when token missing', () => {
    cy.visit('/admin/reports/users', { failOnStatusCode: false });
    cy.contains('Giriş Yap', { timeout: 15000 }).should('be.visible');
  });

  it('redirects to unauthorized when permission missing', () => {
    visitReports([]);
    cy.contains('Erişim Yetkiniz Bulunmuyor', { timeout: 15000 }).should('be.visible');
  });

  it('allows access when VIEW_REPORTS permission granted', () => {
    visitReports(['VIEW_REPORTS']);
    cy.wait('@getReportingRemote', { timeout: 15000 });
    cy.location('pathname', { timeout: 15000 }).should('include', '/admin/reports');
  });
});
