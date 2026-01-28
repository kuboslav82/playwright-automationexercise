// tests/products.spec.ts
import { test, expect } from './fixtures/appTest';

test.describe('Automation Exercise - Products', () => {
  test('products page loads and shows a product list', async ({ app }) => {
    await app.goto('/products');

    await expect(app.page).toHaveURL(/\/products/);

    await expect(
      app.page.getByRole('heading', { name: /All Products/i })
    ).toBeVisible();

    // ✅ Robust product rendering check (see notes above).
    const productCards = app.page.locator('.productinfo');
    await expect(productCards.first()).toBeVisible();
  });
});
