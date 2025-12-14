import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Bu satır, testlerde cy.visit('/') gibi kısa yollar kullanmanızı sağlar.
    baseUrl: 'http://localhost:3000',
    
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
