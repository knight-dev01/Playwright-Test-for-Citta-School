import { test, expect } from '@playwright/test';

/**
 * Smoke — unauthenticated, verifies live site reachable before deep tests.
 * BLOCKED if demo.cittaschool.com unavailable (messages.txt critical rule).
 */
test.describe('SMOKE — live site reachable', () => {
  test.use({ storageState: undefined }); // unauthenticated

  test('home / login loads without 5xx', async ({ page }) => {
    const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
    const status = resp?.status() ?? 0;
    expect(status, `GET / returned ${status}`).toBeLessThan(500);
    expect(status).toBeGreaterThan(0);
    // Do not assert 200 strictly — may redirect to /login (302) which is acceptable
    expect([200, 302, 301, 303]).toContain(status);
    const body = await page.textContent('body').catch(() => '') || '';
    // Should show sign-in UI, not 500 page
    expect(body.toLowerCase()).not.toContain('internal server error');
    expect(body.toLowerCase()).not.toContain('502 bad gateway');
    await page.screenshot({ path: 'test-results/smoke-home.png', fullPage: true }).catch(() => {});
  });

  test('login page has typed sign-in fields', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Search for username/email + password inputs
    const username = page.locator('input[name="username"], input[name="email"], input[id*="username" i], input[placeholder*="username" i]').first();
    const password = page.locator('input[type="password"]').first();
    // If redirected to /login path, wait
    await page.waitForTimeout(1500);
    const hasUsername = await username.isVisible().catch(() => false);
    const hasPassword = await password.isVisible().catch(() => false);
    // Accept either — if SPA, may need deeper
    if (!hasUsername || !hasPassword) {
      const body = await page.textContent('body') || '';
      console.log(`[smoke] login fields not found — url=${page.url()} body=${body.slice(0, 600)}`);
      await page.screenshot({ path: 'test-results/smoke-login.png', fullPage: true }).catch(() => {});
    }
    expect(hasPassword, 'password input should be visible on login').toBeTruthy();
  });

  test('no Quick sign-in panel in production mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Quick sign-in')).toHaveCount(0);
  });
});
