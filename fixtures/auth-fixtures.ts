import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, type Role } from './users';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// Re-export expect
export { expect };

// Helper to assert production auth mode (no quick panel / no hint)
export async function assertProductionAuthMode(page: import('@playwright/test').Page) {
  await expect(page.locator('text=Quick sign-in')).toHaveCount(0);
  // No code hint text anywhere
  await expect(page.locator('text=123456')).toHaveCount(0);
  await expect(page.locator('text=code hint')).toHaveCount(0);
}
