# TUI Automation Test Suite

This project contains an automated test for the TUI NL website, implemented using TypeScript and Playwright.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup

1. Clone or download the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file based on `.env.example` if you want to override the base URL.

## Running Tests

- To run all tests:
  ```bash
  npx playwright test
  ```
- To run tests in a specific browser (e.g., Chromium):
  ```bash
  npx playwright test --project=chromium
  ```
- To run tests in headed mode:
  ```bash
  npx playwright test --headed
  ```
- To view the test report:
  ```bash
  npx playwright show-report
  ```

## Project Structure

- `framework/`: Contains the Page Object Model (POM) and utilities.
  - `pages/`: Page objects for different parts of the TUI website.
  - `utils/`: Reusable utility functions.
  - `logger/`: Custom logger and decorators for step reporting.
- `tests/`: Contains the test specifications.
  - `fixtures/`: Custom Playwright fixtures.
- `playwright.config.ts`: Playwright configuration.
