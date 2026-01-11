describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-up');
  });

  it('should display the sign up form', () => {
    cy.get('[data-slot="card-title"]').contains('Sign up').should('be.visible');
    cy.contains('Create a new account').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('input#repeat-password').should('be.visible');
    cy.contains('button', 'Sign up').should('be.visible');
  });

  it('should have email and password inputs with correct types', () => {
    cy.get('input#email').should('have.attr', 'type', 'email');
    cy.get('input#password').should('have.attr', 'type', 'password');
    cy.get('input#repeat-password').should('have.attr', 'type', 'password');
  });

  it('should require all fields', () => {
    cy.get('input#email').should('have.attr', 'required');
    cy.get('input#password').should('have.attr', 'required');
    cy.get('input#repeat-password').should('have.attr', 'required');
  });

  it('should navigate to login page', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/auth/login');
  });

  it('should show error when passwords do not match', () => {
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('input#repeat-password').type('differentpassword');
    cy.contains('button', 'Sign up').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should show loading state when submitting', () => {
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('input#repeat-password').type('password123');
    cy.contains('button', 'Sign up').click();
    cy.contains('button', 'Creating an account...').should('be.visible');
  });
});
