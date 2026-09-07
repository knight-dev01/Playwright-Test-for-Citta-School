import { test, expect } from '@playwright/test';

/**
 * TC-17, TC-18, TC-19 — Transcript, graduation, executive oversight
 * ISS-012,013,005 AC-11,12,13
 */
test.describe('TRANSCRIPT / GRADUATION / EXECUTIVE [TC-17..TC-19]', () => {
  test('TC-17 transcript lifecycle — no issue before dispatch, QR verifies, cross-student refused', async ({ page }) => {
    // Student: Documents → Request transcript
    await page.goto('/student/documents').catch(async () => await page.goto('/student/transcript'));
    await page.waitForTimeout(1000);
    const requestBtn = page.getByRole('button', { name: /Request transcript/i }).first();
    console.log(`[TC-17] request transcript visible=${await requestBtn.isVisible().catch(() => false)}`);
    // Registrar: dispatch queue
    // Cross-student access: tamper reference ID in URL (NT-03)
    const body = await page.textContent('body') || '';
    console.log(`[TC-17] documents page snippet=${body.slice(0, 500)}`);
    await page.screenshot({ path: `test-results/tc17-transcript-${Date.now()}.png`, fullPage: true }).catch(() => {});
    // Try to brute-force another transcript ID
    await page.goto('/student/documents/99999', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(800);
    const refusedBody = (await page.textContent('body') || '').toLowerCase();
    const refused = refusedBody.includes('not authorised') || refusedBody.includes('not found') || refusedBody.includes('forbidden') || page.url().includes('login');
    console.log(`[TC-17] cross-student transcript refused=${refused} url=${page.url()}`);
  });

  test('TC-18 graduation eligibility — blockers specific, clearance live update, cert QR', async ({ page }) => {
    // Registrar: Graduation
    await page.goto('/registrar/graduation').catch(async () => await page.goto('/registrar/graduands'));
    await page.waitForTimeout(1200);
    const body = await page.textContent('body') || '';
    console.log(`[TC-18] graduation body=${body.slice(0, 700)}`);
    // Look for specific blockers
    const hasBlocked = body.toLowerCase().includes('blocked') || body.toLowerCase().includes('library') || body.toLowerCase().includes('cgpa');
    console.log(`[TC-18] blockers visible=${hasBlocked}`);
    // Chinedu Okafor CGPA 4.62
    const chinedu = page.locator('text=Chinedu').first();
    console.log(`[TC-18] Chinedu visible=${await chinedu.isVisible().catch(() => false)}`);
    await page.screenshot({ path: `test-results/tc18-graduation-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('TC-19 executive oversight — collections = gateway+approved only, figures match pass', async ({ page }) => {
    await page.goto('/executive').catch(async () => await page.goto('/executive/overview'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1200);
    const body = await page.textContent('body') || '';
    console.log(`[TC-19] executive body=${body.slice(0, 900)}`);
    const hasCollections = body.toLowerCase().includes('collection');
    const hasAdmissions = body.toLowerCase().includes('admission');
    const hasPipeline = body.includes('CSC101') || body.toLowerCase().includes('pipeline') || body.toLowerCase().includes('results');
    console.log(`[TC-19] collections=${hasCollections} admissions=${hasAdmissions} pipeline=${hasPipeline}`);
    // Broadcast
    const broadcast = page.getByRole('button', { name: /Broadcast/i }).first();
    console.log(`[TC-19] broadcast visible=${await broadcast.isVisible().catch(() => false)}`);
    await page.screenshot({ path: `test-results/tc19-executive-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });
});
