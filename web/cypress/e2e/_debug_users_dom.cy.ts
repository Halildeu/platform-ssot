describe('debug users dom', () => {
  it('dumps standalone users dom', () => {
    cy.visitWithShellAuth(
      'http://localhost:3004/',
      ['VIEW_USERS', 'EDIT_USERS', 'USER_MANAGEMENT_MODULE', 'user-read', 'VIEW_REPORTS'],
    );
    cy.get('body', { timeout: 20000 }).should('be.visible');
    cy.document().then((doc) => {
      const buttons = Array.from(doc.querySelectorAll('button')).map((button) => button.textContent?.trim() ?? '');
      const testIds = Array.from(doc.querySelectorAll('[data-testid]')).map((node) => node.getAttribute('data-testid'));
      cy.writeFile('/tmp/users_dom_dump.json', {
        url: doc.location.href,
        title: doc.title,
        buttons,
        testIds,
        bodyText: doc.body.innerText,
      });
    });
  });
});
