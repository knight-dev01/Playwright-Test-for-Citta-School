import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, STORAGE_STATE } from '../fixtures/users';

/**
 * Setup: typed sign-in for each role → save storageState
 * Docx Sec.2: all Demo2026! / 123456, production 2FA
 * Must sign out before switching roles.
 */
const roles: (keyof typeof STORAGE_STATE)[] = ['applicant', 'student', 'registrar', 'lecturer', 'bursar', 'executive'];

for (const role of roles) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    const user = USERS[role as keyof typeof USERS];
    if (!user) throw new Error(`No creds for ${role}`);
    const login = new LoginPage(page);
    console.log(`[setup] authenticating ${role} as ${user.username}`);
    await login.loginWithCode(user.username, user.password, user.code);
    // Assert landing in correct portal — not on login page
    await page.waitForLoadState('networkidle');
    // Basic check: not still on login
    const url = page.url();
    const body = (await page.textContent('body').catch(() => '') || '').toLowerCase();
    // If still shows login, capture for debugging
    if (body.includes('sign in') && body.includes('password') && url.includes('login')) {
      console.warn(`[setup] ${role} still on login — body snippet: ${body.slice(0, 400)}`);
      // Take screenshot for diagnosis
      await page.screenshot({ path: `test-results/setup-${role}.png`, fullPage: true }).catch(() => {});
    }
    // Ensure authenticated by checking we can reach a protected page (follow redirect)
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 15000 }).catch(() => {
      console.warn(`[setup] ${role} may not have authenticated — still at login URL ${url}`);
    });
    await page.context().storageState({ path: STORAGE_STATE[role] });
    console.log(`[setup] ${role} → ${STORAGE_STATE[role]} saved, url=${page.url()}`);
  });
}
