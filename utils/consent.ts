import type { Page, Frame, Locator } from '@playwright/test';

/**
 * WHY this helper exists:
 * - Cookie/consent overlays often block clicks and can hide elements from interaction.
 * - Many consent managers render inside an iframe.
 * - We want a "best effort" dismiss that does NOT fail tests when no banner appears.
 */
async function clickSouhlasInFrame(frame: Frame): Promise<boolean> {
  // This matches exactly the snippet you provided:
  // <p class="fc-button-label">Souhlas</p>
  //
  // WHY locator() instead of getByRole():
  // - This element is a <p>, not a <button>, so it has no "button" role.
  // - getByRole('button') would never find it.
  const consentLabel: Locator = frame
    .locator('p.fc-button-label')
    .filter({ hasText: 'Souhlas' })
    .first();

  // Best-effort check: if it doesn't exist, we just return false.
  const visible = await consentLabel.isVisible().catch(() => false);
  if (!visible) return false;

  // Try clicking the label itself first.
  // Some UIs attach click handlers directly to the label.
  const clickedLabel = await consentLabel.click({ timeout: 2000 }).then(
    () => true,
    () => false
  );
  if (clickedLabel) return true;

  // If the <p> isn't clickable, the clickable element is often a parent wrapper.
  // `locator('..')` means "parent node" in Playwright locator chaining.
  const parent1 = consentLabel.locator('..');
  const clickedParent1 = await parent1.click({ timeout: 2000 }).then(
    () => true,
    () => false
  );
  if (clickedParent1) return true;

  // Sometimes you need to go up another level.
  const parent2 = parent1.locator('..');
  const clickedParent2 = await parent2.click({ timeout: 2000 }).then(
    () => true,
    () => false
  );
  if (clickedParent2) return true;

  return false;
}

export async function handleConsentIfPresent(page: Page): Promise<void> {
  // 1) Try main document first
  if (await clickSouhlasInFrame(page.mainFrame())) return;

  // 2) Try all iframes (common for consent managers)
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    if (await clickSouhlasInFrame(frame)) return;
  }

  // 3) Optional fallback: ESC sometimes closes overlays
  await page.keyboard.press('Escape').catch(() => {});
}
