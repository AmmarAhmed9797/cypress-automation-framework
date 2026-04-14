// Compliance Monitoring Test Suite
// Predict360 GRC Platform — 360factors
// Author: Muhammad Ammar Ahmed

import LoginPage from '../../pages/LoginPage';
import CompliancePage from '../../pages/CompliancePage';
import { generateTestData } from '../../support/helpers';

describe('Compliance Monitoring Module', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    LoginPage.loginWithCredentials();
    CompliancePage.navigate();
  });

  context('Compliance Alerts', () => {
    it('should display all active compliance alerts', () => {
      CompliancePage.verifyAlertsLoaded();
      cy.get('[data-cy="alert-list"]').should('be.visible');
      cy.get('[data-cy="alert-item"]').should('have.length.greaterThan', 0);
    });

    it('should filter alerts by severity level', () => {
      CompliancePage.filterBysSeverity('High');
      cy.get('[data-cy="alert-item"]').each(($el) => {
        cy.wrap($el).find('[data-cy="severity-badge"]')
          .should('contain', 'High');
      });
    });

    it('should create a new compliance alert', () => {
      const alertData = generateTestData('alert');
      CompliancePage.createAlert(alertData);
      CompliancePage.verifyAlertCreated(alertData.title);
    });

    it('should update alert status to Resolved', () => {
      CompliancePage.getFirstAlert().then((alertId) => {
        CompliancePage.updateAlertStatus(alertId, 'Resolved');
        CompliancePage.verifyAlertStatus(alertId, 'Resolved');
      });
    });

    it('should export compliance alerts to CSV', () => {
      CompliancePage.exportAlerts('csv');
      cy.verifyDownload('compliance-alerts.csv');
    });
  });

  context('Regulatory Change Management', () => {
    it('should display regulatory changes list', () => {
      CompliancePage.navigateToRegulatoryChanges();
      cy.get('[data-cy="reg-change-list"]').should('be.visible');
    });

    it('should search for a specific regulation', () => {
      CompliancePage.navigateToRegulatoryChanges();
      CompliancePage.searchRegulation('FFIEC');
      cy.get('[data-cy="reg-change-item"]')
        .should('contain', 'FFIEC');
    });

    it('should assign a regulatory change to a user', () => {
      CompliancePage.navigateToRegulatoryChanges();
      CompliancePage.assignChange('user@360factors.com');
      CompliancePage.verifyAssignment('user@360factors.com');
    });
  });

  context('Compliance Dashboard', () => {
    it('should display compliance score widget', () => {
      cy.get('[data-cy="compliance-score"]').should('be.visible');
      cy.get('[data-cy="score-value"]')
        .invoke('text')
        .then((text) => {
          const score = parseInt(text);
          expect(score).to.be.within(0, 100);
        });
    });

    it('should render compliance trend chart', () => {
      cy.get('[data-cy="trend-chart"]').should('be.visible');
      cy.get('canvas').should('exist');
    });
  });
});
