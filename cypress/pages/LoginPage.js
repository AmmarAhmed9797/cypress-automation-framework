// Page Object Model — Login Page
// Predict360 GRC Platform — 360factors

class LoginPage {
  // Selectors
  get usernameInput() { return cy.get('#username'); }
  get passwordInput() { return cy.get('#password'); }
  get loginButton()   { return cy.get('[data-cy="login-btn"]'); }
  get errorMessage()  { return cy.get('.error-message'); }
  get forgotPassword(){ return cy.get('[data-cy="forgot-password"]'); }

  // Actions
  navigate() {
    cy.visit('/login');
    cy.title().should('include', 'Predict360');
  }

  enterUsername(username) {
    this.usernameInput.clear().type(username);
  }

  enterPassword(password) {
    this.passwordInput.clear().type(password, { log: false });
  }

  clickLogin() {
    this.loginButton.click();
  }cypress/pages/LoginPage.js

  login(username, password) {
    this.navigate();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  loginWithCredentials() {
    this.login(
      Cypress.env('username'),
      Cypress.env('password')
    );
  }

  verifyErrorMessage(message) {
    this.errorMessage.should('be.visible').and('contain', message);
  }

  verifyLoginSuccess() {
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-menu"]').should('be.visible');
  }
}

export default new LoginPage();
