/// <reference types="cypress" />

declare namespace Cypress {
  interface ShellAuthOptions {
    tokenSignature?: string;
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    runtimeEnv?: Record<string, string>;
    localStorage?: Record<string, string>;
  }

  interface Chainable {
    setShellAuthState(permissions?: string[], options?: ShellAuthOptions): Chainable<void>;
    visitWithShellAuth(path: string, permissions?: string[], options?: ShellAuthOptions): Chainable<void>;
  }
}
