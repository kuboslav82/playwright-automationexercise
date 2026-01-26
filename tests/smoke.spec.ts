import { test, expect } from '@playwright/test';
import { handleConsentIfPresent } from '../utils/consent';

test.describe('Automation Exercise - Smoke', () => {
  test('home page loads and primary navigation is visible', async ({ page }) => {
    // baseURL in config lets '/' resolve to https://automationexercise.com/
    // domcontentloaded avoids waiting for every image/asset; assertions will auto-wait for UI.
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // If a consent overlay appears, it may block interaction and hide elements.
    // This helper is "best effort": it won't fail if no popup exists.
    await handleConsentIfPresent(page);

    // IMPORTANT:
    // The page uses <h1><span>Automation</span>Exercise</h1> (no space in HTML),
    // so we allow optional whitespace with \s*.
    await expect(
      page.getByRole('heading', { level: 1, name: /Automation\s*Exercise/i })
    ).toBeVisible({ timeout: 15000 });

    // Nav links are real <a> elements (good for getByRole('link')).
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Signup\s*\/\s*Login/i })).toBeVisible();
  });
});
