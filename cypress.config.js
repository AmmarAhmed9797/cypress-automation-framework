const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://app.predict360.com',
    specPattern: 'cypress/e2e/**/*.{cy.js,feature}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      return config;
    },
    env: {
      environment: 'staging',
      apiUrl: 'https://api.predict360.com',
    },
  },
});
