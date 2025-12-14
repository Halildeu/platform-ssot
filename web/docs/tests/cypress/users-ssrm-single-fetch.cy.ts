// E2E: Verify SSRM initial fetch is single-call on Users page
// How to use:
// - Copy to your frontend cypress tests folder (e.g., cypress/e2e/)
// - Ensure your shell is running at http://localhost:3000 and mfe-users route is /admin/users
// - For strict assertion (== 1), run without React.StrictMode or run a prod build

describe('Users SSRM initial fetch single-call', () => {
  it('calls the users SSRM endpoint exactly once on first load', () => {
    const usersUrl = `http://localhost:3000/admin/users?mfe_users_bust=${Date.now()}`;

    cy.intercept({ method: 'GET', url: '**/api/users/all*' }).as('ssrm');

    cy.visit(usersUrl);

    // Wait for the first SSRM request to be made and completed
    cy.wait('@ssrm');

    // Allow a short window for any duplicate dev triggers, then assert exactly one
    cy.wait(200);

    cy.get('@ssrm.all').then((calls) => {
      // If this fails in dev, disable StrictMode or run against prod build
      expect(calls.length, 'initial SSRM fetch count').to.eq(1);
    });
  });
});

