describe('Summary Cards', () => {
  beforeEach(() => {
    cy.loginWithTestUser();
  });

  it('should display summary cards section', () => {
    cy.contains('h2', 'Overview').should('be.visible');
    cy.contains('Your performance snapshot at a glance').should('be.visible');
  });

  it('should display engagement metrics', () => {
    cy.contains('Engagement').should('be.visible');
  });
});
