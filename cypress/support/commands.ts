export const TEST_USERS = {
  demo1: { email: 'demo1@example.com', password: 'password123' },
  demo2: { email: 'demo2@example.com', password: 'password123' },
} as const;

declare global {
  namespace Cypress {
    interface Chainable {
      loginWithTestUser(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'loginWithTestUser',
  (email?: string, password?: string) => {
    const userEmail = email ?? TEST_USERS.demo1.email;
    const userPassword = password ?? TEST_USERS.demo1.password;

    cy.visit('/auth/login');
    cy.get('input#email').type(userEmail);
    cy.get('input#password').type(userPassword);
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/dashboard');
  },
);
