import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // Good interview topic: retries are usually off locally, on in CI.
  retries: process.env.CI ? 2 : 0,

  // Prevent huge parallelism on CI runners; keep local fast.
  workers: process.env.CI ? 2 : undefined,

  reporter: [['html', { open: 'never' }]],

  use: {
    // Your target site. Enables page.goto('/') and relative navigation.
    baseURL: 'https://automationexercise.com',

    // Debug-friendly artifacts, but only when something fails.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Local dev defaults; CI runs headless by default anyway.
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Webkit'] },
    },
  ],
});
