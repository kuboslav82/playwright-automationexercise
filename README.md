# Playwright E2E Portfolio — automationexercise.com

End-to-end UI tests built with Playwright + TypeScript against https://automationexercise.com/.

## Tech stack
- Playwright Test (TypeScript)
- GitHub Actions CI
- Playwright HTML Report (published as artifact / optionally to GitHub Pages)

## How to run locally
```bash
npm install
npx playwright install
npm test
npm run test:headed
npm run test:report