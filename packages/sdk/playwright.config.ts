import { defineConfig, devices } from '@playwright/test';

/**
 * The browser bundle in a real browser (#655). No server: each test serves
 * dist/browser/stellar-drive-signet.min.js and a stub API through page.route. Build first:
 *
 *   pnpm --filter @stellar-drive-signet/sdk build
 *   pnpm --filter @stellar-drive-signet/sdk test:browser
 */
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  use: {
    // A machine without Playwright's own Chromium can run the installed Chrome.
    ...(process.env.PW_CHANNEL && { channel: process.env.PW_CHANNEL }),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
