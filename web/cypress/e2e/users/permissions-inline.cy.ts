const visitUsersPage = () => {
  cy.visitWithShellAuth(
    'http://localhost:3004/',
    ['VIEW_USERS', 'EDIT_USERS', 'USER_MANAGEMENT_MODULE', 'user-read', 'VIEW_REPORTS'],
  );
  cy.get('[data-testid="users-grid-root"]', { timeout: 20000 }).should('be.visible');
};

describe('Users permissions inline warnings', () => {
  beforeEach(() => {
    cy.viewport(1440, 960);
  });

  it('shows inline warning for user management permission rules', () => {
    visitUsersPage();

    cy.contains('button', 'İşlemler', { timeout: 20000 })
      .first()
      .click({ force: true });
    cy.contains('button', 'Detayı Görüntüle', { timeout: 10000 })
      .click({ force: true });

    cy.contains('Kullanıcı Detayı', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="module-warning-user_management"]', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .should((text) => {
        expect(text).to.match(/Bu modül için yetki bulunmuyor|Kullanıcı Yönetimi yetkileri şirket\/dönem seçimi ile verilmelidir/);
      });
  });
});
