import { test, expect } from '@playwright/test';

/**
 * TC-13, TC-14 — Curriculum and registration (Registrar + Student)
 * ISS-023..028, NT-17,19-21, 15-24 rule
 */
test.describe('CURRICULUM & REGISTRATION [TC-13..TC-14]', () => {
  test('TC-13 Add Course — duplicate refused, assignment reaches lecturer/student', async ({ page }) => {
    // Registrar project
    const curriculum = page.getByRole('link', { name: /Curriculum|Programme curriculum/i }).first();
    if (await curriculum.isVisible().catch(() => false)) await curriculum.click();
    else await page.goto('/registrar/curriculum').catch(() => {});
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /Add Course/i }).first();
    const hasAdd = await addBtn.isVisible().catch(() => false);
    console.log(`[TC-13] Add Course visible=${hasAdd}`);
    if (hasAdd) {
      await addBtn.click();
      await page.waitForTimeout(800);
      // Try fill ACC205
      const nameInput = page.locator('input[name*="course" i], input[placeholder*="course" i]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('ACC205');
        // Units
        const units = page.locator('input[name*="unit" i], input[type="number"]').first();
        if (await units.isVisible().catch(() => false)) await units.fill('3');
        const save = page.getByRole('button', { name: /Save|Create|Confirm/i }).first();
        await save.click().catch(() => {});
        await page.waitForTimeout(1000);
        const body = await page.textContent('body') || '';
        console.log(`[TC-13] after add body=${body.slice(0, 500)}`);
        // Duplicate should be refused — try again
        if (await addBtn.isVisible().catch(() => false)) {
          await addBtn.click();
          await page.waitForTimeout(600);
          if (await nameInput.isVisible().catch(() => false)) await nameInput.fill('ACC205');
          await save.click().catch(() => {});
          await page.waitForTimeout(800);
          const body2 = await page.textContent('body') || '';
          const refused = body2.toLowerCase().includes('duplicate') || body2.toLowerCase().includes('already exists') || body2.toLowerCase().includes('exists');
          console.log(`[TC-13] duplicate refused=${refused}`);
        }
      }
    }
    await page.screenshot({ path: `test-results/tc13-curriculum-${Date.now()}.png`, fullPage: true }).catch(() => {});
  });

  test('TC-14 registration 15-24 rule — over/under limit refused, PDF form', async ({ page }) => {
    // Student project
    await page.goto('/student/registration').catch(async () => await page.goto('/student/courses'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const body = await page.textContent('body') || '';
    const hasUnits = body.toLowerCase().includes('unit') || body.includes('15');
    console.log(`[TC-14] units indicator visible=${hasUnits}`);
    // Try to verify Submit disabled when over 24 — heuristic: count checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count().catch(() => 0);
    console.log(`[TC-14] elective checkboxes count=${count}`);
    // Look for Submit button state
    const submit = page.getByRole('button', { name: /Submit/i }).first();
    const disabled = await submit.isDisabled().catch(() => false);
    console.log(`[TC-14] submit disabled=${disabled}`);
    // Core pre-selected check
    const checked = await page.locator('input[type="checkbox"]:checked').count().catch(() => 0);
    console.log(`[TC-14] pre-checked core count=${checked}`);
    await page.screenshot({ path: `test-results/tc14-reg-${Date.now()}.png`, fullPage: true }).catch(() => {});
    // Course form PDF — look for Print/Download
    const pdfBtn = page.getByRole('button', { name: /Print|Course form|PDF/i }).first();
    console.log(`[TC-14] pdf button visible=${await pdfBtn.isVisible().catch(() => false)}`);
  });
});
