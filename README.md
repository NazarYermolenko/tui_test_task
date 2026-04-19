![TUI Automation Framework](./assets/banner.png)

# TUI Automation Test Suite 🚀

A modest attempt at an end-to-end testing framework for the TUI NL portal, powered by **Playwright** and **TypeScript**. It tries its best to be organized and provides some logs and reports to help understand the test results.

---

## 💎 Implemented Features

- **📝 Automated Step Reporting**: A custom `@Step` decorator that intelligently wraps methods into Playwright steps, utilizing method parameters for dynamic naming.
- **📜 Enhanced Logging System**: A custom **Winston**-based logger with `AsyncLocalStorage` integration for tracking class and method context across asynchronous execution.
- **🏆 Advanced POM Architecture**: A robust Page Object Model utilizing base classes for pages and dynamic components to maximize reusability.
- **🎭 Custom Test Fixtures**: Lightweight Playwright fixtures that simplify page initialization and test setup.
- **📂 Pretty Imports**: Optimized project structure with TypeScript path aliases for cleaner code and maintainable imports.

---

## 🛠️ Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![Playwright](https://img.shields.io/badge/playwright-%232EAD33.svg?style=for-the-badge&logo=playwright&logoColor=white)
![Winston](https://img.shields.io/badge/winston-%23010101.svg?style=for-the-badge&logo=winston&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

---

## 📂 Project Structure

```text
.
├── 📂 assets              # Media files and banner
├── 📂 framework           # Core Automation Framework
│   ├── 📂 base            # Base classes for Pages and Components
│   ├── 📂 logger          # Custom Winston Logger & @Step Decorator
│   ├── 📂 pages           # Page Object implementation
│   │   ├── 📂 main        # Home Page & related components
│   │   └── 📂 search      # Search Results & Booking details
│   └── 📂 utils           # Cross-project utility functions
├── 📂 tests               # Test Specifications
│   ├── 📂 fixtures        # Custom Playwright Fixtures
│   └── 📄 booking.spec.ts # End-to-end Booking Flow Test
├── 📄 playwright.config.ts # Playwright Configuration
├── 📄 tsconfig.json       # TypeScript Configuration (Path Aliases)
└── 📄 .env.example        # Environment Variable Template
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (you can use `.env.example` as a template):
```bash
BASE_URL=https://www.tui.nl/h/nl
```

---

## 🧪 Running Tests

Execution is straightforward via the CLI:

### Execute all tests (Default: Firefox)
```bash
npx playwright test
```

### Execute on Chromium
```bash
npx playwright test --project=chromium
```

### Run in Headed Mode
```bash
npx playwright test --headed
```

### Selective Execution
```bash
npx playwright test tests/booking.spec.ts
```

---

## 📊 Reporting & Logging

### HTML Report
After execution, a beautiful HTML report is generated automatically. To view it:
```bash
npx playwright show-report
```

### Framework Logs
The framework utilizes a custom **Winston** logger. Logs are displayed in the console with high readability and saved to:
`test-results/test-run.log`

#### Example Log Output:
```text
2024-04-19 21:01:46 [SearchResultsPage.clickContinue]:
info: Clicking continue button
```

---

## 🏗️ Core Architecture: The `@Step` Decorator

The project features a unique `@Step` decorator that enhances both code readability and reporting completeness.

**How it works:**
By decorating any method in a Page Object, it automatically:
1. Wraps the method in a `test.step()` block for Playwright reporting.
2. Formats a log message using method parameters.
3. Logs the execution to the console and file system.

```typescript
// Example usage in Page Object
@Step('Searching for {query}')
async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
}
```

---

## 👤 Author
*Nazar Yermolenko*
