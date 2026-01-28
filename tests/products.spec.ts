// tests/products.spec.ts

// ✅ Importing named exports from our local module.
// - This is ES module syntax (Playwright TS supports it).
// - `test` and `expect` are VALUES (they exist at runtime).
import { test, expect } from './fixtures/appTest';

test.describe('Automation Exercise - Products', () => {
  // ✅ `test(...)` defines one test case.
  // - First arg: string name (for reports).
  // - Second arg: async function (returns Promise) that receives fixtures.
  test('products page loads and shows a product list', async ({ app }) => {
    // ✅ `app.goto` is our helper function (async) that does:
    // - page.goto(..., { waitUntil: 'domcontentloaded' })
    // - handleConsentIfPresent(page)
    await app.goto('/products');

    // ✅ Assertion on URL:
    // - `expect(app.page)` uses Playwright's expect on a Page object.
    // - `.toHaveURL(/regex/)` auto-waits until the URL matches the regex.
    await expect(app.page).toHaveURL(/\/products/);

    // ✅ Headings are good stable locators because they are user-facing.
    // - getByRole uses accessibility tree (more resilient than CSS chains).
    await expect(
      app.page.getByRole('heading', { name: /All Products/i })
    ).toBeVisible();

    // ✅ Verify products rendered:
    // - The page contains many "Add to cart" links.
    // - `.first()` returns the first matching locator (still auto-waits).
    await expect(
      app.page.getByRole('link', { name: /Add to cart/i }).first()
    ).toBeVisible();
  });
});
