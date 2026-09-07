import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly codeInput: Locator;
  readonly verifyButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on live HTML: https://demo.cittaschool.com login has
    // <input placeholder="e.g. registrar or DU/FST/25/0001" autocomplete="username"> then <input type="password">
    this.usernameInput = page.locator('input[autocomplete="username"], input[placeholder*="registrar" i], input[placeholder*="e.g." i]').first();
    // Fallback to first text input in form if above not found
    this.passwordInput = page.locator('input[type="password"]').first();
    this.signInButton = page.locator('button:has-text("Sign in"), button:has-text("Login"), button:has-text("Log in"), button[type="submit"]').first();
    // Verification code step — 6-digit (seen after sign-in)
    this.codeInput = page.locator('input[name*="code" i], input[name*="otp" i], input[id*="code" i], input[placeholder*="code" i], input[inputmode="numeric"], input[autocomplete*="one-time" i]').first();
    this.verifyButton = page.locator('button:has-text("Verify"), button:has-text("Confirm"), button:has-text("Submit"), button:has-text("Continue")').first();
    this.errorAlert = page.locator('[role="alert"], .alert, .error, .text-red-500, .text-danger, [class*="error" i], text=/Invalid/i').first();
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async fillCredentials(username: string, password: string) {
    // Username field — with fallback to form first input
    let user = this.usernameInput;
    if (!(await user.isVisible().catch(() => false))) {
      user = this.page.locator('form input').first();
    }
    await user.waitFor({ state: 'visible', timeout: 15000 });
    await user.fill(username);
    // Fallback placeholder selector for Six-digit vs username confusion
    let pw = this.passwordInput;
    if (!(await pw.isVisible().catch(() => false))) {
      pw = this.page.locator('input[type="password"]').first();
    }
    await pw.waitFor({ state: 'visible', timeout: 10000 });
    await pw.fill(password);
    await this.page.waitForTimeout(300);
    await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(() => {
      const btn = document.querySelector('button');
      return btn && !btn.disabled;
    }, { timeout: 5000 }).catch(() => {});
    await this.signInButton.click();
  }

  /** Typed sign-in: username/password -> verification code -> wait for dashboard */
  async loginWithCode(username: string, password: string, code: string) {
    await this.goto();
    // Ensure login form ready
    await this.page.waitForTimeout(1000);
    await this.fillCredentials(username, password);
    // Wait for two-factor prompt — check for "Six-digit code" or verification text
    const codeVisible = await this.page.getByPlaceholder('Six-digit code').isVisible().catch(() => false)
      || await this.codeInput.isVisible().catch(() => false);
    // Wait a bit for API challenge roundtrip
    await this.page.waitForTimeout(2000);
    const promptVisible = await this.page.getByText('Two-factor prompt').isVisible().catch(() => false)
      || await this.page.getByText('verification code').isVisible().catch(() => false)
      || await this.codeInput.isVisible().catch(() => false);
    if (promptVisible || codeVisible) {
      const input = this.page.getByPlaceholder('Six-digit code').first();
      const target = await input.isVisible().catch(() => false) ? input : this.codeInput;
      await target.waitFor({ state: 'visible', timeout: 10000 });
      await target.fill(code);
      const btn = this.page.getByRole('button', { name: 'Verify and continue' }).first();
      const btnToUse = await btn.isVisible().catch(() => false) ? btn : this.verifyButton;
      // Wait for auth callback + session
      const responsePromise = this.page.waitForResponse(r => r.url().includes('/auth/session') || r.url().includes('/auth/callback'), { timeout: 15000 }).catch(() => null);
      await btnToUse.click();
      await responsePromise;
      await this.page.waitForLoadState('networkidle').catch(() => {});
      // Next.js navigation to / happens via client router — wait for URL to leave /login
      await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 }).catch(() => {});
      await this.page.waitForTimeout(1500);
    } else {
      await this.page.waitForTimeout(1000);
    }
  }

  async fillCode(code: string) {
    await this.codeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.codeInput.fill(code);
    await this.verifyButton.click();
  }

  async getErrorText(): Promise<string> {
    await this.errorAlert.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const text = await this.errorAlert.textContent().catch(() => '');
    if (text?.trim()) return text.trim();
    // Fallback — search any visible error-like text
    const body = await this.page.textContent('body').catch(() => '') || '';
    // Extract near "Invalid"
    const m = body.match(/Invalid[^.\n]{0,80}/i);
    return m ? m[0] : body.slice(0, 200);
  }

  async signOut() {
    // Click profile menu (shows initials e.g. AY) then Sign out
    const profileBtn = this.page.locator('button:has-text("Open profile menu")').first();
    const fallbackProfile = this.page.locator('button[aria-label*="profile" i], button:has-text("Profile")').first();
    const toClick = await profileBtn.isVisible().catch(() => false) ? profileBtn : fallbackProfile;
    if (await toClick.isVisible().catch(() => false)) {
      await toClick.click();
      await this.page.waitForTimeout(500);
    }
    const signOut = this.page.locator('button:has-text("Sign out"), button:has-text("Log out"), a:has-text("Sign out"), a:has-text("Logout")').first();
    if (await signOut.isVisible().catch(() => false)) {
      await signOut.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForTimeout(1000);
      // After sign out the app routes to /logout then /login — ensure we're at login
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    } else {
      await this.page.goto('/api/auth/signout').catch(() => {});
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
  }
}
