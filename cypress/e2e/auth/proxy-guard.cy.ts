describe('Proxy Guard', () => {
  describe('authenticated user', () => {
    beforeEach(() => {
      cy.loginWithTestUser();
    });

    it('should redirect from /auth/login to /dashboard', () => {
      cy.visit('/auth/login');
      cy.url().should('include', '/dashboard');
    });

    it('should redirect from /auth/sign-up to /dashboard', () => {
      cy.visit('/auth/sign-up');
      cy.url().should('include', '/dashboard');
    });

    it('should redirect from /auth/forgot-password to /dashboard', () => {
      cy.visit('/auth/forgot-password');
      cy.url().should('include', '/dashboard');
    });

    it('should allow access to /auth/update-password', () => {
      cy.visit('/auth/update-password');
      cy.url().should('include', '/auth/update-password');
      cy.get('[data-slot="card-title"]')
        .contains('Reset Your Password')
        .should('be.visible');
    });

    it('should allow access to /dashboard', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });
  });

  describe('unauthenticated user', () => {
    it('should redirect from /dashboard to /auth/login', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/login');
    });

    it('should allow access to /auth/login', () => {
      cy.visit('/auth/login');
      cy.url().should('include', '/auth/login');
      cy.get('[data-slot="card-title"]').contains('Login').should('be.visible');
    });

    it('should allow access to /auth/sign-up', () => {
      cy.visit('/auth/sign-up');
      cy.url().should('include', '/auth/sign-up');
      cy.get('[data-slot="card-title"]')
        .contains('Sign up')
        .should('be.visible');
    });

    it('should allow access to /auth/forgot-password', () => {
      cy.visit('/auth/forgot-password');
      cy.url().should('include', '/auth/forgot-password');
      cy.get('[data-slot="card-title"]')
        .contains('Reset Your Password')
        .should('be.visible');
    });

    it('should allow access to /', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
});
