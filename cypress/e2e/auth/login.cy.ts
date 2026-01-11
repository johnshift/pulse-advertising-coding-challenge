import { TEST_USERS } from '../../support/commands';

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should display the login form', () => {
    cy.get('[data-slot="card-title"]').contains('Login').should('be.visible');
    cy.contains('Enter your email below to login').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
  });

  it('should have email and password inputs with correct types', () => {
    cy.get('input#email').should('have.attr', 'type', 'email');
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('should require email and password fields', () => {
    cy.get('input#email').should('have.attr', 'required');
    cy.get('input#password').should('have.attr', 'required');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Forgot your password?').click();
    cy.url().should('include', '/auth/forgot-password');
  });

  it('should navigate to sign up page', () => {
    cy.contains('Sign up').click();
    cy.url().should('include', '/auth/sign-up');
  });

  it('should show loading state when submitting', () => {
    cy.intercept('POST', '**/token**', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 400,
        body: { error: 'invalid_grant' },
      });
    }).as('authRequest');
    cy.get('input#email').type('loading-test@example.com');
    cy.get('input#password').type('testpassword');
    cy.contains('button', 'Login').click();
    cy.contains('button', 'Logging in...').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input#email').type('invalid@example.com');
    cy.get('input#password').type('wrongpassword');
    cy.contains('button', 'Login').click();
    cy.get('.text-red-500').should('be.visible');
  });

  it('should successfully login and redirect to dashboard', () => {
    cy.loginWithTestUser();
    cy.url().should('include', '/dashboard');
  });
});
