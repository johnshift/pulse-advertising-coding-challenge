describe('Daily Metrics', () => {
  beforeEach(() => {
    cy.loginWithTestUser();
  });

  it('should display daily metrics section', () => {
    cy.contains('Daily Metrics').should('be.visible');
  });

  it('should display chart controls', () => {
    cy.contains('Range:').should('be.visible');
    cy.contains('Chart:').should('be.visible');
    cy.contains('Metric:').should('be.visible');
  });

  it('should display the chart area', () => {
    cy.get('[class*="recharts"]').should('exist');
  });
});
