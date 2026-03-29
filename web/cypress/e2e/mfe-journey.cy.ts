describe('Mikro-Frontend Kullanıcı Yolculuğu', () => {
  it('Shell, Ethic ve paylaşılan statein doğru çalışmasını test eder', () => {
    cy.visitWithShellAuth('/home', ['VIEW_USERS', 'VIEW_REPORTS']);
    cy.location('pathname').should('eq', '/home');
    cy.contains('Orchestrator Dashboard', { timeout: 15000 }).should('be.visible');
    cy.contains('Cypress Test User').should('be.visible');

    cy.visit('/ethic');
    cy.location('pathname').should('eq', '/ethic');
    cy.contains('Ethic mikro uygulaması aktif.', { timeout: 15000 }).should('be.visible');
  });
});
