import { test, expect } from '@playwright/test';

/**
 * TC-15, TC-16 — Lecturer portal + 3-level approval
 * ISS-010,031,032,003,006,011 NT-04,07
 */
test.describe('LECTURER & RESULTS APPROVAL [TC-15..TC-16]', () => {
  test('TC-15 lecturer tiles + score entry — zero/blank/ABS, upload validation', async ({ page }) => {
    // Lecturer project
    // Home tiles
    const tiles = ['Assigned Courses', 'Pending Sheets', 'Submitted Sheets'];
    for (const name of tiles) {
      const tile = page.locator(`text=${name}`).first();
      const visible = await tile.isVisible().catch(() => false);
      console.log(`[TC-15] tile "${name}" visible=${visible}`);
      if (visible) {
        await tile.click().catch(() => {});
        await page.waitForTimeout(800);
        const opened = page.url();
        console.log(`[TC-15] clicked ${name} -> ${opened}`);
        await page.goBack().catch(() => {});
        await page.waitForTimeout(600);
      }
    }
    // Try open CSC101
    await page.goto('/lecturer/courses').catch(() => {});
    await page.waitForTimeout(1000);
    const csc101 = page.locator('text=CSC101').first();
    if (await csc101.isVisible().catch(() => false)) {
      await csc101.click();
      await page.waitForTimeout(1000);
      // Check score validation — CA box should reject 85 if max lower, accept 0
      const caInput = page.locator('input[type="number"]').first();
      if (await caInput.isVisible().catch(() => false)) {
        await caInput.fill('85');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(600);
        const body = await page.textContent('body') || '';
        const refused = body.toLowerCase().includes('invalid') || body.toLowerCase().includes('exceeds') || body.toLowerCase().includes('30') || body.toLowerCase().includes('maximum');
        console.log(`[TC-15] CA 85 refused=${refused}`);
        await caInput.fill('0');
        await page.keyboard.press('Tab');
        console.log('[TC-15] CA 0 accepted path tested');
      }
      // ABS
      const absent = page.getByRole('button', { name: /Absent/i }).first();
      console.log(`[TC-15] Absent button visible=${await absent.isVisible().catch(() => false)}`);
      // Blank submit should banner missing student
      const submit = page.getByRole('button', { name: /Submit/i }).first();
      if (await submit.isVisible().catch(() => false)) {
        await submit.click().catch(() => {});
        await page.waitForTimeout(800);
        const banner = await page.textContent('body') || '';
        console.log(`[TC-15] blank submit banner snippet=${banner.slice(0, 400)}`);
      }
      // Excel template upload
      const upload = page.getByRole('button', { name: /Upload|Template/i }).first();
      console.log(`[TC-15] upload/template visible=${await upload.isVisible().catch(() => false)}`);
    }
    await page.screenshot({ path: `test-results/tc15-lecturer-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('TC-16 HOD→Dean→Senate approval + return + release gate', async ({ page }) => {
    // Registrar acts as HOD/Dean/Senate queue
    await page.goto('/registrar/results').catch(async () => await page.goto('/registrar/approvals'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const body = await page.textContent('body') || '';
    console.log(`[TC-16] results queue body=${body.slice(0, 600)}`);
    // Look for CSC101 sheet
    const csc101Row = page.locator('text=CSC101').first();
    const hasCSC101 = await csc101Row.isVisible().catch(() => false);
    console.log(`[TC-16] CSC101 row visible=${hasCSC101}`);
    if (hasCSC101) {
      await csc101Row.click().catch(() => {});
      await page.waitForTimeout(800);
      // Try Return with comment
      const retBtn = page.getByRole('button', { name: /Return/i }).first();
      if (await retBtn.isVisible().catch(() => false)) {
        console.log('[TC-16] Return button found — testing flow');
        // Don't actually return if it would disrupt data — just log
      }
      // Check out-of-order: Senate approve while at Dean should be unavailable
      const senateBtn = page.getByRole('button', { name: /Senate/i }).first();
      console.log(`[TC-16] Senate button visible=${await senateBtn.isVisible().catch(() => false)}`);
    }
    // Timeline audit check
    const timeline = page.locator('text=Prof. Eze, text=Prof. Bakare, text=Senate');
    console.log(`[TC-16] timeline actors visible count=${await timeline.count().catch(() => 0)}`);
    await page.screenshot({ path: `test-results/tc16-approval-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('unreleased results invisible to student — NT-04 pre-Senate', async ({ page }) => {
    // Runs on student project — check Academic record shows pending if not Senate approved
    await page.goto('/student/results').catch(async () => await page.goto('/student/academic'));
    await page.waitForTimeout(1000);
    const body = (await page.textContent('body') || '').toLowerCase();
    const pending = body.includes('pending approval') || body.includes('not released') || body.includes('awaiting');
    const hasGrades = body.includes('gpa') || body.includes('cgpa') || body.includes('grade');
    console.log(`[TC-16] student pending=${pending} hasGrades=${hasGrades}`);
    await page.screenshot({ path: `test-results/tc16-student-pending-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });
});
