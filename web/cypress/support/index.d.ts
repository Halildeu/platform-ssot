/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    setShellAuthState(permissions?: string[]): Chainable<void>;
  }
}
