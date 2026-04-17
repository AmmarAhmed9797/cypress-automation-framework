/**
 * AI Test Case Generator — Cypress Automation Framework
 * Author: Muhammad Ammar Ahmed — Senior Test Automation Engineer
 *
 * Uses OpenAI GPT API to automatically generate Cypress test cases
 * from user stories, requirements, or page descriptions.
 * Integrates with the Predict360 GRC test suite.
 */

const Anthropic = require('@anthropic-ai/sdk');

class AITestGenerator {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });
    this.model = 'claude-opus-4-6';
  }

  /**
   * Generate Cypress test cases from a user story or feature description.
   * @param {string} featureDescription - Plain English feature/requirement
   * @param {string} context - Additional context (page URL, module name)
   * @returns {string} - Generated Cypress test code
   */
  async generateTestCases(featureDescription, context = '') {
    const prompt = `You are a senior QA automation engineer specializing in Cypress.
Generate complete, production-ready Cypress test cases for the following feature.

Feature Description:
${featureDescription}

Context: ${context}

Requirements:
- Use Page Object Model pattern
- Include positive and negative test cases
- Add proper assertions using Cypress best practices
- Include beforeEach/afterEach hooks
- Add meaningful describe/it block names
- Use data-cy selectors where possible
- Include error handling test cases
- Follow BDD style (Given/When/Then in comments)

Return ONLY the Cypress test code, no explanations.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  }

  /**
   * Generate test cases for compliance module automatically.
   * @param {string} moduleName - GRC module (e.g., 'Risk Management', 'Compliance Alerts')
   */
  async generateComplianceTests(moduleName) {
    const description = `
      Module: ${moduleName} in Predict360 GRC Platform
      This is a Banking & Financial Services compliance platform.
      Users can: create, read, update, delete compliance records.
      Include: authentication, CRUD operations, filtering, search, export.
    `;
    return this.generateTestCases(description, `Predict360 GRC - ${moduleName}`);
  }

  /**
   * Analyze existing test failures and suggest fixes using AI.
   * @param {string} failureLog - Cypress test failure output
   */
  async analyzeFailure(failureLog) {
    const prompt = `You are a Cypress debugging expert. Analyze this test failure and provide:
1. Root cause analysis
2. Suggested fix with code
3. Prevention strategy

Failure Log:
${failureLog}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  }

  /**
   * Generate test data for a given form or module using AI.
   * @param {string} formDescription - Description of the form fields
   * @param {number} count - Number of test data sets to generate
   */
  async generateTestData(formDescription, count = 5) {
    const prompt = `Generate ${count} realistic test data sets for:
${formDescription}
Return as a JavaScript array of objects. Only return the JSON array, no explanation.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    try {
      return JSON.parse(response.content[0].text);
    } catch {
      return response.content[0].text;
    }
  }

  /**
   * Generate BDD feature file from requirements.
   * @param {string} requirement - Plain English requirement
   */
  async generateFeatureFile(requirement) {
    const prompt = `Convert this requirement into a Gherkin BDD feature file for Cucumber:
${requirement}
Include: Feature, Background (if needed), multiple Scenarios with Given/When/Then steps.
Return ONLY the .feature file content.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  }
}

module.exports = AITestGenerator;

// Example usage:
// const generator = new AITestGenerator();
// const tests = await generator.generateComplianceTests('Risk Management');
// console.log(tests);
