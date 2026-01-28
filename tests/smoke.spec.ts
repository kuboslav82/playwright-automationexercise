// tests/smoke.spec.ts

// ✅ Import from our custom fixture module instead of @playwright/test directly.
// This makes `{ app }` available in the test callback.
import { test, expect } from './fixtures/appTest';

test.describe('Automation Exercise - Smoke', () => {
  test('home page loads and primary navigation is visible', async ({ app }) => {
    // ✅ Our helper does:
    // 1) page.goto with domcontentloaded
    // 2) handle consent popup if present
    await app.goto('/');

    // ✅ `app.page` exposes the underlying Playwright Page for locators/assertions.
    await expect(
      app.page.getByRole('heading', { level: 1, name: /Automation\s*Exercise/i })
    ).toBeVisible({ timeout: 15000 });

    await expect(app.page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(app.page.getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(app.page.getByRole('link', { name: 'Cart' })).toBeVisible();
    await expect(app.page.getByRole('link', { name: /Signup\s*\/\s*Login/i })).toBeVisible();
  });
});
