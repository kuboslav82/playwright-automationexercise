// tests/fixtures/appTest.ts

// ✅ TypeScript "import" (ES module syntax): bring in values/types from another module.
// - `test as base` renames the imported `test` value so we can export our own `test` later.
// - `expect` is a value (a function object) used for assertions.
// - `type Page` is a TYPE-only import: it exists only at compile time (no runtime JS output).
import { test as base, expect, type Page } from '@playwright/test';

// ✅ Importing a function you wrote (a value import).
import { handleConsentIfPresent } from '../../utils/consent';

// ✅ Type alias: defines a reusable "shape" (like a blueprint) for objects.
// Here we declare what extra fixtures we want Playwright to inject into tests.
type AppFixtures = {
  app: {
    // `page: Page` uses the imported Page TYPE to describe the property type.
    page: Page;

    // Function type: "goto takes a string and returns a Promise<void>".
    // Promise<void> means it's async and doesn't return a meaningful value.
    goto: (path: string) => Promise<void>;

    // Another helper method to accept consent explicitly if needed.
    acceptConsent: () => Promise<void>;
  };
};

// ✅ Export a new `test` that extends the base Playwright `test` with our fixtures.
// - `<AppFixtures>` is a GENERIC: we tell TS what new fixture types we’re adding.
// - `base.extend(...)` returns a new test function that understands `{ app }` in test callbacks.
export const test = base.extend<AppFixtures>({
  // ✅ Fixture definition:
  // `app` is the fixture name; Playwright will inject it into tests as `({ app })`.
  // The function is `async` because fixture setup often awaits browser operations.
  app: async ({ page, baseURL }, use) => {
    // ✅ Arrow function assigned to a const:
    // - `async` makes it return a Promise automatically.
    // - Parameter type annotation `(path: string)` is TypeScript syntax.
    const goto = async (path: string) => {
      // With `baseURL` set in config, relative paths resolve correctly.
      // We keep `waitUntil: 'domcontentloaded'` to avoid waiting for every image/asset.
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      // Best-effort consent dismissal to avoid overlays blocking interactions.
      await handleConsentIfPresent(page);
    };

    // ✅ Another arrow function helper (thin wrapper around your utility).
    const acceptConsent = async () => {
      await handleConsentIfPresent(page);
    };

    // ✅ `use(...)` is how Playwright hands the fixture value to the test body.
    // After the test finishes, Playwright handles cleanup automatically.
    await use({ page, goto, acceptConsent });
  },
});

// ✅ Re-export expect so tests can import { test, expect } from one place.
export { expect };
