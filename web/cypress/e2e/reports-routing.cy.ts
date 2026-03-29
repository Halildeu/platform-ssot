const REPORT_REMOTE_ENTRY = 'http://localhost:3007/remoteEntry.js*';
const REPORT_PAGE_TEST_ID = '[data-testid="report-page-users"]';
const REPORT_VARIANT_SELECT = '[data-component="variant-selector"] select';

const visitReports = (permissions: string[]) => {
  cy.visitWithShellAuth('/admin/reports/users', permissions);
  cy.wait('@getReportingRemote', { timeout: 15000 });
  cy.get(REPORT_PAGE_TEST_ID, { timeout: 30000 }).should('be.visible');
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
    cy.location('pathname', { timeout: 15000 }).should('eq', '/admin/reports/users');
    cy.contains('Raporlar', { timeout: 15000 }).should('be.visible');
    cy.contains('Kullanıcılar').should('be.visible');
  });

  it('allows access when VIEW_REPORTS permission granted', () => {
    visitReports(['VIEW_REPORTS']);
    cy.location('pathname', { timeout: 15000 }).should('include', '/admin/reports');
    cy.get(REPORT_VARIANT_SELECT, { timeout: 30000 }).should('be.visible');
  });
});
