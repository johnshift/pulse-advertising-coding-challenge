describe('Posts Table', () => {
  beforeEach(() => {
    cy.loginWithTestUser();
  });

  it('should display posts table section', () => {
    cy.contains('h2', 'Posts').should('be.visible');
    cy.contains('View and analyze your content performance').should(
      'be.visible',
    );
  });

  it('should display platform filter buttons', () => {
    cy.contains('Platform:').should('be.visible');
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Instagram').should('be.visible');
    cy.contains('button', 'TikTok').should('be.visible');
  });

  it('should filter posts by Instagram platform', () => {
    cy.contains('button', 'Instagram').click();
    cy.contains('button', 'Instagram').should(
      'have.class',
      'pointer-events-none',
    );
  });

  it('should filter posts by TikTok platform', () => {
    cy.contains('button', 'TikTok').click();
    cy.contains('button', 'TikTok').should('have.class', 'pointer-events-none');
  });

  it('should reset filter to All', () => {
    cy.contains('button', 'Instagram').click();
    cy.contains('button', 'Instagram').should(
      'have.class',
      'pointer-events-none',
    );
    cy.contains('button', 'All').click({ force: true });
    cy.contains('button', 'All').should('have.class', 'pointer-events-none');
  });

  it('should display the data table', () => {
    cy.get('table').should('be.visible');
    cy.get('table thead').should('be.visible');
    cy.get('table tbody').should('be.visible');
  });

  it('should display pagination controls', () => {
    cy.contains('Show rows per page').should('be.visible');
    cy.get('button[aria-label="Go to previous page"]').should('exist');
    cy.get('button[aria-label="Go to next page"]').should('exist');
  });

  it('should open post detail dialog when clicking a row', () => {
    cy.get('table tbody .animate-pulse').should('not.exist');
    cy.get('table tbody tr').first().click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('should close post detail dialog', () => {
    cy.get('table tbody .animate-pulse').should('not.exist');
    cy.get('table tbody tr').first().click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]')
      .find('[data-slot="dialog-close"]')
      .first()
      .click({ force: true });
    cy.get('[role="dialog"]').should('not.exist');
  });
});
