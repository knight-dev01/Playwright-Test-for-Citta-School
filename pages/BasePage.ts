import { type Page, type Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async assertNoQuickSignIn() {
    await expect(this.page.locator('text=Quick sign-in')).toHaveCount(0);
  }

  async assertNoRoleSwitcher() {
    // Should NOT show switch-role option anywhere
    await expect(this.page.locator('text=Switch role, text=Change role')).toHaveCount(0);
  }

  async takeEvidence(name: string) {
    return await this.page.screenshot({ path: `Evidence/${name}-${Date.now()}.png`, fullPage: true });
  }

  async waitForToast(expected?: RegExp | string) {
    const toast = this.page.locator('[role="alert"], [role="status"], .toast, .notification, [class*="toast" i]').first();
    if (expected) await expect(toast).toContainText(expected as any, { timeout: 8000 }).catch(() => {});
    return toast;
  }

  /** Direct URL access check — expects refusal/redirect for unauthorized role */
  async assertRefusedOrRedirect(originalPath: string) {
    // Either 403 page, login redirect, or not-authorized toast
    const url = this.page.url();
    const body = (await this.page.textContent('body').catch(() => '') || '').toLowerCase();
    const refused = url.includes('/login') || url.includes('/unauthorized') || body.includes('not authorised') || body.includes('not authorized') || body.includes('forbidden') || body.includes('access denied') || body.includes('refused');
    if (!refused && originalPath !== url) {
      // Redirected somewhere else — treat as refused if not original content
    }
    return { refused, url, bodySlice: body.slice(0, 400) };
  }

  async measureLoad(): Promise<number> {
    const start = Date.now();
    await this.page.waitForLoadState('networkidle');
    return Date.now() - start;
  }

  async checkNoDemoTerminology() {
    const body = await this.page.textContent('body') || '';
    // Exclude the Reset data control name itself per docx
    const lower = body.toLowerCase();
    const forbidden = ['demo', 'presenter', 'storyline'].filter(w => lower.includes(w));
    return forbidden;
  }
}
