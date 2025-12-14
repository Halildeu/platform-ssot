const USERS_REMOTE_ENTRY = 'http://localhost:3004/remoteEntry.js*';
const USERS_ENDPOINT = '**/api/v1/users*';
const USER_DETAIL_ENDPOINT = '**/api/v1/users/by-email**';
const PERMISSIONS_ENDPOINT = '**/api/v1/permissions/assignments**';

const stubUsersList = () => {
  cy.fixture('users/list.json').then((payload) => {
    cy.intercept('GET', USERS_ENDPOINT, (req) => {
      req.alias = 'getUsers';
      req.reply({ statusCode: 200, body: payload });
    });
  });
};

const stubUserDetail = () => {
  cy.fixture('users/detail.json').then((payload) => {
    cy.intercept('GET', USER_DETAIL_ENDPOINT, (req) => {
      req.alias = 'getUserDetail';
      req.reply({ statusCode: 200, body: payload });
    });
  });
};

const stubPermissions = () => {
  cy.fixture('users/permissions.json').then((payload) => {
    cy.intercept('GET', PERMISSIONS_ENDPOINT, (req) => {
      req.alias = 'getAssignments';
      req.reply({ statusCode: 200, body: payload });
    });
  });
};

const visitUsersPage = () => {
  cy.visit('/login');
  cy.setShellAuthState(['EDIT_USERS', 'VIEW_REPORTS']);
  cy.visit('/admin/users');
  cy.wait('@getUsersRemote', { timeout: 15000 });
  cy.wait('@getUsers');
};

describe('Users permissions inline warnings', () => {
  beforeEach(() => {
    cy.viewport(1440, 960);
    cy.intercept('GET', USERS_REMOTE_ENTRY, (req) => req.continue()).as('getUsersRemote');
    stubUsersList();
    stubUserDetail();
    stubPermissions();
  });

  it('shows inline warning when module access level is NONE', () => {
    visitUsersPage();

    cy.get('.ag-center-cols-container .ag-row', { timeout: 20000 })
      .first()
      .click({ force: true });

    cy.wait('@getUserDetail');
    cy.wait('@getAssignments');

    cy.contains('Kullanıcı Detayı', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="module-warning-user_management"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Bu modül için yetki bulunmuyor');
  });
});
