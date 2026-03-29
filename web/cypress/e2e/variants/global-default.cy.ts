const VARIANT_PREFERENCE_ENDPOINT = '**/api/v1/variants/*/preference';
const USERS_ENDPOINT = /\/api\/v1\/users(?:\?.*)?$/;
const REPORT_REMOTE_ENTRY = 'http://localhost:3007/remoteEntry.js*';
const SEARCH_INPUT_TEST_ID = 'report-filter-search';
const USERS_FIXTURE = 'users/list.json';
const REPORT_VARIANT_SELECT = '[data-component="variant-selector"] select';

const GRID_ID = 'reports.users';

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

const buildVariantSeed = (variants: unknown[]) => {
  const typedVariants = variants as Array<{ id: string; isUserDefault?: boolean; isUserSelected?: boolean }>;
  const selectedVariant = typedVariants.find((variant) => variant.isUserSelected);
  const defaultVariant = typedVariants.find((variant) => variant.isUserDefault);

  return {
    'grid-variants': JSON.stringify({ [GRID_ID]: typedVariants }),
    'grid-variants-global-ts': JSON.stringify({ [GRID_ID]: Date.now() }),
    'grid-variants-preferences': JSON.stringify({
      [GRID_ID]: {
        defaultVariantId: defaultVariant?.id,
        selectedVariantId: selectedVariant?.id,
      },
    }),
  };
};

const visitUsersReport = (fixture: string, query = '') => {
  cy.fixture(fixture).then((variants) => {
    cy.visitWithShellAuth(
      `/admin/reports/users${query}`,
      ['VIEW_REPORTS', 'REPORTING_MODULE'],
      { localStorage: buildVariantSeed(variants) },
    );
  });
  cy.wait('@getReportRemote', { timeout: 15000 });
  cy.get(REPORT_VARIANT_SELECT, { timeout: 30000 }).should('be.visible');
};

const selectVariantOption = (label: string) => {
  cy.get(REPORT_VARIANT_SELECT, { timeout: 20000 })
    .should('be.visible')
    .select(label, { force: true });
};

const ensureVariantSelectReady = () => {
  cy.contains('button', /Kullanıcı|Users/i, { timeout: 20000 }).scrollIntoView().should('be.visible');
  cy.get(REPORT_VARIANT_SELECT, { timeout: 20000 })
    .scrollIntoView({ block: 'center', inline: 'center' })
    .should('be.visible');
};

const getSelectedVariantOption = () => cy.get(`${REPORT_VARIANT_SELECT} option:selected`, { timeout: 10000 });

const getSearchInput = () => cy.get(`[data-testid="${SEARCH_INPUT_TEST_ID}"]`, { timeout: 10000 });

describe('Variant Manager — Global Defaults', () => {
  beforeEach(() => {
    cy.viewport(1440, 1000);
    cy.intercept('GET', REPORT_REMOTE_ENTRY, (req) => req.continue()).as('getReportRemote');
    stubUsersApi();
  });

  it('applies the global default variant when no user default exists', () => {
    visitUsersReport('variants/global-only.json');
    ensureVariantSelectReady();
    getSelectedVariantOption().should('contain', 'Genel Görünüm');
  });

  it('prefers user default over global default', () => {
    visitUsersReport('variants/user-default.json');
    ensureVariantSelectReady();
    getSelectedVariantOption().should('contain', 'Takımım');
  });

  it('updates preference when user picks a variant explicitly', () => {
    cy.fixture('variants/team-view-selected.json').then((teamVariant) => {
      cy.intercept('PATCH', VARIANT_PREFERENCE_ENDPOINT, (req) => {
        expect(req.body).to.deep.equal({ isSelected: true });
        req.reply({ statusCode: 200, body: teamVariant });
      }).as('setVariantPreference');
    });

    visitUsersReport('variants/global-and-team.json');
    ensureVariantSelectReady();
    selectVariantOption('Takım Görünümü');
    cy.wait('@setVariantPreference');
    getSelectedVariantOption().should('contain', 'Takım Görünümü');
  });

  it('applies variant from query parameter when provided', () => {
    visitUsersReport('variants/global-and-team.json', '?variant=team-view');
    ensureVariantSelectReady();
    getSelectedVariantOption().should('contain', 'Takım Görünümü');
  });

  it('disables variant select when list is empty', () => {
    visitUsersReport('variants/empty-list.json');
    cy.get(REPORT_VARIANT_SELECT, { timeout: 10000 })
      .should('be.disabled');
  });

  it('shows error toast when preference update fails and keeps previous selection', () => {
    cy.fixture('variants/preference-error.json').then((preferenceError) => {
      cy.intercept('PATCH', VARIANT_PREFERENCE_ENDPOINT, {
        statusCode: 500,
        body: preferenceError,
      }).as('setVariantPreferenceFail');
    });

    visitUsersReport('variants/global-and-team.json');
    ensureVariantSelectReady();
    selectVariantOption('Takım Görünümü');
    cy.wait('@setVariantPreferenceFail');
    cy.contains('[data-testid="toast-message"]', 'Varyant tercihi güncellenemedi', { matchCase: false }).should('be.visible');
    getSelectedVariantOption()
      .should('not.contain', 'Takım Görünümü');
  });

  it('prefills filters when search query is provided', () => {
    visitUsersReport('variants/global-only.json', '?search=ali%40example.com');
    ensureVariantSelectReady();
    getSearchInput().should('have.value', 'ali@example.com');
  });

  it('prefills search when only userId query is provided', () => {
    visitUsersReport('variants/global-only.json', '?userId=42');
    ensureVariantSelectReady();
    getSearchInput().should('have.value', '42');
  });
});
