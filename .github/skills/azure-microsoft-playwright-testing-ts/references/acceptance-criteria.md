# Azure Microsoft Playwright Testing SDK Acceptance Criteria (TypeScript)

**SDK**: `@azure/microsoft-playwright-testing`
**Repository**: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/loadtesting/playwright
**Purpose**: Skill testing acceptance criteria for validating generated code correctness

---

## 1. Correct Import Patterns

### 1.1 Service Configuration Imports

#### ✅ CORRECT: Core Imports
```typescript
import { defineConfig } from "@playwright/test";
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
```

#### ✅ CORRECT: Connect Options Import
```typescript
import { getConnectOptions } from "@azure/microsoft-playwright-testing";
```

#### ✅ CORRECT: Custom Credential Import
```typescript
import { ManagedIdentityCredential } from "@azure/identity";
import { getServiceConfig } from "@azure/microsoft-playwright-testing";
```

### 1.2 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Wrong package name
```typescript
// WRONG - package is @azure/microsoft-playwright-testing
import { getServiceConfig } from "@azure/playwright";
import { getServiceConfig } from "azure-playwright-testing";
```

---

## 2. Service Configuration Patterns

### 2.1 ✅ CORRECT: Basic Service Config
```typescript
import { defineConfig } from "@playwright/test";
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    os: ServiceOS.LINUX,
  }),
  {
    reporter: [["list"], ["@azure/microsoft-playwright-testing/reporter"]],
  }
);
```

### 2.2 ✅ CORRECT: Full Configuration Options
```typescript
import { defineConfig } from "@playwright/test";
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    os: ServiceOS.LINUX,
    timeout: 30000,
    exposeNetwork: "<loopback>",
    useCloudHostedBrowsers: true,
  }),
  {
    reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter", {
        enableGitHubSummary: true,
        enableResultPublish: true,
      }],
    ],
  }
);
```

### 2.3 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Missing defineConfig wrapper
```typescript
// WRONG - must use defineConfig
const config = getServiceConfig(baseConfig, { os: ServiceOS.LINUX });
export default config;
```

---

## 3. Authentication Patterns

### 3.1 ✅ CORRECT: Default Entra ID Auth
```typescript
// Uses DefaultAzureCredential by default
export default defineConfig(
  config,
  getServiceConfig(config, {
    os: ServiceOS.LINUX,
    // serviceAuthType defaults to ENTRA_ID
  })
);
```

### 3.2 ✅ CORRECT: Custom Credential
```typescript
import { ManagedIdentityCredential } from "@azure/identity";
import { getServiceConfig } from "@azure/microsoft-playwright-testing";

export default defineConfig(
  config,
  getServiceConfig(config, {
    credential: new ManagedIdentityCredential(),
  })
);
```

### 3.3 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Hardcoded access token
```typescript
// WRONG - should use Entra ID or environment variables
export default defineConfig(
  config,
  getServiceConfig(config, {
    serviceAuthType: "ACCESS_TOKEN",
    accessToken: "hardcoded-token-12345",
  })
);
```

---

## 4. Reporter Configuration Patterns

### 4.1 ✅ CORRECT: With Reporter
```typescript
export default defineConfig(
  config,
  getServiceConfig(config, { os: ServiceOS.LINUX }),
  {
    reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter"],
    ],
  }
);
```

### 4.2 ✅ CORRECT: Reporter with Options
```typescript
export default defineConfig(
  config,
  getServiceConfig(config, { os: ServiceOS.LINUX }),
  {
    reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter", {
        enableGitHubSummary: true,
        enableResultPublish: true,
      }],
    ],
  }
);
```

### 4.3 ✅ CORRECT: Reporting Only (Local Browsers)
```typescript
export default defineConfig(
  config,
  getServiceConfig(config, {
    useCloudHostedBrowsers: false,
  }),
  {
    reporter: [["@azure/microsoft-playwright-testing/reporter"]],
  }
);
```

---

## 5. Manual Browser Connection Patterns

### 5.1 ✅ CORRECT: Manual Connection
```typescript
import playwright, { test, expect, BrowserType } from "@playwright/test";
import { getConnectOptions } from "@azure/microsoft-playwright-testing";

test("manual connection", async ({ browserName }) => {
  const { wsEndpoint, options } = await getConnectOptions();
  const browser = await (playwright[browserName] as BrowserType).connect(wsEndpoint, options);
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);

  await browser.close();
});
```

### 5.2 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Missing browser close
```typescript
// WRONG - browser should be closed
test("manual connection", async ({ browserName }) => {
  const { wsEndpoint, options } = await getConnectOptions();
  const browser = await (playwright[browserName] as BrowserType).connect(wsEndpoint, options);
  const page = await browser.newPage();
  await page.goto("https://example.com");
  // Missing browser.close()
});
```

---

## 6. Environment Variables

### 6.1 ✅ CORRECT: Required Variables
```typescript
// PLAYWRIGHT_SERVICE_URL is required
// Set in environment: wss://eastus.api.playwright.microsoft.com/accounts/{workspace-id}/browsers
```

### 6.2 ❌ INCORRECT: Hardcoded service URL
```typescript
// WRONG - should use environment variable
const wsEndpoint = "wss://eastus.api.playwright.microsoft.com/accounts/12345/browsers";
```

---

## 7. CI/CD Integration Patterns

### 7.1 ✅ CORRECT: GitHub Actions Workflow
```yaml
name: playwright-ts
on: [push, pull_request]

permissions:
  id-token: write
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - run: npm ci
      
      - name: Run Tests
        env:
          PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        run: npx playwright test -c playwright.service.config.ts --workers=20
```

### 7.2 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Missing Azure login
```yaml
# WRONG - missing Azure authentication step
jobs:
  test:
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test -c playwright.service.config.ts
```

---

## 8. Running Tests

### 8.1 ✅ CORRECT: Run with Service Config
```bash
npx playwright test --config=playwright.service.config.ts --workers=20
```

### 8.2 ✅ CORRECT: Run with Specific Workers
```bash
npx playwright test -c playwright.service.config.ts --workers=20
```

### 8.3 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Using default config for cloud testing
```bash
# WRONG - must use service config for cloud browsers
npx playwright test
```
