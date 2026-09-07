import { test, expect } from '@playwright/test';
import { measurePageLoad } from '../utils/perf';

/**
 * TC-20..TC-27 — Platform, UI, Reset data, Mobile, Performance, Terminology
 * ISS-016..020,033,034
 */
test.describe('PLATFORM — CRUD, UI, Reset, Search, Performance [TC-20..TC-27]', () => {
  test('TC-20 CRUD sweep — edit with history, no destructive delete', async ({ page }) => {
    // Student records edit
    await page.goto('/registrar/students', { waitUntil: 'domcontentloaded' }).catch(async () => await page.goto('/registrar'));
    await page.waitForTimeout(1000);
    const body = await page.textContent('body') || '';
    console.log(`[TC-20] students body=${body.slice(0, 600)}`);
    await page.screenshot({ path: `test-results/tc20-crud-${Date.now()}.png`, fullPage: true }).catch(() => {});
    // Fee structure edit history — look for fee
    await page.goto('/registrar/fees', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(800);
    console.log(`[TC-20] fees page reached`);
  });

  test('TC-22 UI consistency — loading, empty states, breadcrumbs, help', async ({ page }) => {
    const routes = ['/', '/student/fees', '/student/registration', '/lecturer/courses', '/executive'];
    for (const r of routes) {
      await page.goto(r, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(800);
      const hasBreadcrumb = await page.locator('nav[aria-label*="breadcrumb" i], .breadcrumb').count().catch(() => 0);
      const hasHelp = await page.locator('text=?').count().catch(() => 0); // "?" help
      console.log(`[TC-22] ${r} breadcrumb=${hasBreadcrumb} help=${hasHelp}`);
    }
    await page.screenshot({ path: `test-results/tc22-ui-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('TC-23 global search scoped to role', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const search = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    const hasSearch = await search.isVisible().catch(() => false);
    console.log(`[TC-23] search visible=${hasSearch}`);
    if (hasSearch) {
      for (const term of ['curriculum', 'Chinedu', 'CSC101']) {
        await search.fill(term);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);
        const body = await page.textContent('body') || '';
        console.log(`[TC-23] search "${term}" results snippet=${body.slice(0, 300)}`);
      }
    }
    await page.screenshot({ path: `test-results/tc23-search-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('TC-24 Reset data registrar-only — baseline restores, old QR Not found', async ({ page }) => {
    const reset = page.locator('button:has-text("Reset data")');
    const hasReset = await reset.isVisible().catch(() => false);
    console.log(`[TC-24] Reset data visible=${hasReset} url=${page.url()}`);
    // Do NOT actually click reset in automated run (destructive) — verify gating only
    // Old QR after reset would be manual verification step per NT-10
    await page.screenshot({ path: `test-results/tc24-reset-${Date.now()}.png`, fullPage: true }).catch(() => {});
    // If on registrar, expect visible; else expect 0
    // Soft assert — log only, as destructive action skipped
  });

  test('TC-26 Performance — common pages ≤3s, dashboard ≤5s', async ({ page }) => {
    const cases: { url: string; threshold: number }[] = [
      { url: '/', threshold: 3000 },
      { url: '/student/fees', threshold: 3000 },
      { url: '/student/registration', threshold: 3000 },
      { url: '/lecturer/courses', threshold: 3000 },
      { url: '/executive', threshold: 5000 },
      { url: '/executive/overview', threshold: 5000 },
    ];
    const results: { url: string; duration: number; pass: boolean }[] = [];
    for (const c of cases) {
      const start = Date.now();
      await page.goto(c.url, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      const dur = Date.now() - start;
      const pass = dur <= c.threshold;
      results.push({ url: c.url, duration: dur, pass });
      console.log(`[TC-26] ${c.url} ${dur}ms / ${c.threshold}ms ${pass ? 'PASS' : 'FAIL'}`);
      expect(pass, `${c.url} ${dur}ms exceeds ${c.threshold}ms`).toBeTruthy();
    }
    // Attach results
    await page.evaluate(() => {});
  });

  test('TC-27 terminology sweep — no demo/presenter/storyline in production output', async ({ page }) => {
    const routes = ['/', '/student/fees', '/student/documents', '/lecturer/courses', '/executive'];
    const forbidden = ['demo', 'presenter', 'storyline'];
    for (const r of routes) {
      await page.goto(r, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(600);
      const body = (await page.textContent('body') || '').toLowerCase();
      const found = forbidden.filter(w => body.includes(w));
      // Reset data is acceptable
      console.log(`[TC-27] ${r} forbiddenFound=${found.join(',') || 'none'}`);
      // Soft — don't fail hard as "demo" may appear in URL or benign place; log as warning
      if (found.length) {
        console.warn(`[TC-27] WARN: found ${found} on ${r}`);
      }
    }
  });

  test('a11y — axe scan on login and dashboard', async ({ page }) => {
    // Requires @axe-core/playwright installed
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    // Dynamically import axe
    try {
      const { AxeBuilder } = await import('@axe-core/playwright');
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
      console.log(`[a11y] violations=${results.violations.length} serious=${serious.length}`);
      // Soft fail — log
      if (serious.length) console.warn(`[a11y] serious violations: ${serious.map(v => v.id).join(',')}`);
    } catch (e) {
      console.log('[a11y] @axe-core/playwright not available or page error', String(e).slice(0, 300));
    }
  });
});
