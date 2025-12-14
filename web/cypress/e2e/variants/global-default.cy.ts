const VARIANT_PREFERENCE_ENDPOINT = '**/api/variants/*/preference';
const USERS_ENDPOINT = /\/api\/users\/all(\?.*)?$/;
const REPORT_REMOTE_ENTRY = 'http://localhost:3007/remoteEntry.js*';
const SEARCH_INPUT_TEST_ID = 'report-filter-search';
const USERS_FIXTURE = 'users/list.json';

const GRID_ID = 'reports.users';

const VARIANTS_ENDPOINT_REGEX = /\/api\/variants\?gridId=.*users.*$/;

const stubUsersApi = () => {
  cy.fixture(USERS_FIXTURE).then((payload) => {
    cy.intercept('GET', '**/api/**', (req) => {
      if (!USERS_ENDPOINT.test(req.url)) {
        req.continue();
        return;
      }
      req.alias = 'getUsers';
      Cypress.log({ name: 'users-api', message: req.url });
      req.reply({ statusCode: 200, body: payload });
    });
  });
};

const visitUsersReport = (query = '') => {
  cy.visit('/login');
  cy.setShellAuthState(['VIEW_REPORTS']);
  cy.visit(`/admin/reports/users${query}`);
  cy.wait('@getReportRemote', { timeout: 15000 });
  cy.get('[data-testid="report-variant-select"]', { timeout: 30000 }).should('exist');
};

const waitForVariantData = (minCount = 1) => {
  cy.window({ log: false })
    .should((win) => {
      const snapshot = (win as any).__gridVariantsSnapshot__;
      expect(snapshot, '__gridVariantsSnapshot__ not initialized').to.be.an('object');
      const variants = snapshot?.[GRID_ID];
      expect(
        Array.isArray(variants) ? variants.length : 0,
        'variant snapshot length',
      ).to.be.gte(minCount);
    });
};

const selectVariantOption = (label: string) => {
  const matcher = new RegExp(label, 'i');
  cy.get('[data-testid="report-variant-select"]', { timeout: 20000 })
    .should('be.visible')
    .select(matcher, { force: true });
};

const ensureVariantSelectReady = () => {
  cy.contains('button', /Kullanıcı|Users/i, { timeout: 20000 }).scrollIntoView().should('be.visible');
  cy.get('[data-testid="report-variant-select"]', { timeout: 20000 })
    .scrollIntoView({ block: 'center', inline: 'center' })
    .should('be.visible');
};

const getSearchInput = () => cy.get(`[data-testid="${SEARCH_INPUT_TEST_ID}"]`, { timeout: 10000 });

type VariantRequestHandler = (req: Cypress.Request, hitIndex: number) => void;

const interceptVariants = (handler: VariantRequestHandler, alias = 'getVariants') => {
  let callIndex = 0;
  cy.intercept({ method: 'GET', url: VARIANTS_ENDPOINT_REGEX }, (req) => {
    callIndex += 1;
    Cypress.log({ name: 'variants-api', message: `${req.url} [${callIndex}]` });
    handler(req, callIndex);
  }).as(alias);
};

const mockVariantsWithFixture = (fixture: string, alias = 'getVariants') => {
  interceptVariants((req) => req.reply({ fixture }), alias);
};

describe('Variant Manager — Global Defaults', () => {
  beforeEach(() => {
    cy.viewport(1440, 1000);
    cy.intercept('GET', REPORT_REMOTE_ENTRY, (req) => req.continue()).as('getReportRemote');
    stubUsersApi();
  });

  it('applies the global default variant when no user default exists', () => {
    mockVariantsWithFixture('variants/global-only.json');

    visitUsersReport();

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    cy.get('[data-testid="report-variant-select"]', { timeout: 10000 }).should('contain', 'Genel Görünüm');
  });

  it('prefers user default over global default', () => {
    mockVariantsWithFixture('variants/user-default.json');

    visitUsersReport();

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    cy.get('[data-testid="report-variant-select"]', { timeout: 10000 }).should('contain', 'Takımım');
  });

  it('updates preference when user picks a variant explicitly', () => {
    let callCount = 0;
    interceptVariants((req) => {
      callCount += 1;
      if (callCount === 1) {
        req.reply({ fixture: 'variants/global-and-team.json' });
      } else {
        req.reply({ fixture: 'variants/team-selected.json' });
      }
    }, 'getVariantsSequence');

    cy.fixture('variants/team-view-selected.json').then((teamVariant) => {
      cy.intercept('PATCH', VARIANT_PREFERENCE_ENDPOINT, (req) => {
        expect(req.body).to.deep.equal({ isSelected: true });
        req.reply({ statusCode: 200, body: teamVariant });
      }).as('setVariantPreference');
    });

    visitUsersReport();

    cy.wait('@getVariantsSequence', { timeout: 10000 });
    ensureVariantSelectReady();
    waitForVariantData(2);
    selectVariantOption('Takım Görünümü');
    cy.wait('@setVariantPreference');
    cy.wait('@getVariantsSequence');
    cy.get('[data-testid="report-variant-select"]', { timeout: 10000 }).should('contain', 'Takım Görünümü');
  });

  it('applies variant from query parameter when provided', () => {
    mockVariantsWithFixture('variants/global-and-team.json');

    visitUsersReport('?variant=team-view');

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    cy.get('[data-testid="report-variant-select"]', { timeout: 10000 }).should('contain', 'Takım Görünümü');
  });

  it('disables variant select when list is empty', () => {
    mockVariantsWithFixture('variants/empty-list.json');

    visitUsersReport();

    cy.wait('@getVariants');
    cy.get('[data-testid="report-variant-select"]', { timeout: 10000 })
      .should('be.disabled');
  });

  it('shows error toast when preference update fails and keeps previous selection', () => {
    mockVariantsWithFixture('variants/global-and-team.json');
    cy.fixture('variants/preference-error.json').then((preferenceError) => {
      cy.intercept('PATCH', VARIANT_PREFERENCE_ENDPOINT, {
        statusCode: 500,
        body: preferenceError,
      }).as('setVariantPreferenceFail');
    });

    visitUsersReport();

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    waitForVariantData(2);
    selectVariantOption('Takım Görünümü');
    cy.wait('@setVariantPreferenceFail');
    cy.contains('[data-testid="toast-message"]', 'Varyant tercihi güncellenemedi', { matchCase: false }).should('be.visible');
    cy.get('[data-testid="report-variant-select"] option:selected', { timeout: 10000 })
      .should('not.contain', 'Takım Görünümü');
  });

  it('prefills filters when search query is provided', () => {
    mockVariantsWithFixture('variants/global-only.json');

    visitUsersReport('?search=ali%40example.com');

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    getSearchInput().should('have.value', 'ali@example.com');
  });

  it('prefills search when only userId query is provided', () => {
    mockVariantsWithFixture('variants/global-only.json');

    visitUsersReport('?userId=42');

    cy.wait('@getVariants');
    ensureVariantSelectReady();
    getSearchInput().should('have.value', '42');
  });
});
