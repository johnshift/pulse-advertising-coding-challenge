import './commands';

const bypassSecret = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');

if (bypassSecret) {
  beforeEach(() => {
    cy.intercept('*', (req) => {
      req.headers['x-vercel-protection-bypass'] = bypassSecret;
    });
  });
}
