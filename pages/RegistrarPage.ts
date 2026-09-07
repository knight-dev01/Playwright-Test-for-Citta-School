import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class RegistrarPage extends BasePage {
  // Admissions operations tabs — one page with 6 tabs per docx
  async openAdmissionsOperations() {
    await this.page.getByRole('link', { name: /Admissions/i }).first().click().catch(async () => {
      await this.page.goto('/registrar/admissions');
    });
    await this.page.waitForLoadState('networkidle');
  }

  async openTab(name: RegExp | string) {
    await this.page.getByRole('tab', { name: name as any }).click().catch(async () => {
      await this.page.getByRole('button', { name: name as any }).click();
    });
    await this.page.waitForLoadState('networkidle');
  }

  async openAdmissionControl() {
    await this.page.getByRole('link', { name: /Admission control/i }).click().catch(async () => {
      await this.page.goto('/registrar/admission-control');
    });
    await this.page.waitForLoadState('networkidle');
  }

  async openClearanceVerification() {
    await this.page.goto('/registrar/clearance').catch(async () => {
      await this.page.getByRole('link', { name: /Clearance/i }).click();
    });
    await this.page.waitForLoadState('networkidle');
  }

  async resetData() {
    // Header -> Reset data — Registrar only, with confirmation
    const resetBtn = this.page.getByRole('button', { name: /Reset data/i }).first();
    await expect(resetBtn).toBeVisible({ timeout: 10000 });
    await resetBtn.click();
    const confirm = this.page.getByRole('button', { name: /Confirm|Yes|Reset/i }).last();
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await this.page.waitForLoadState('networkidle');
  }

  async generateMatricNumber(studentName: string) {
    const btn = this.page.getByRole('button', { name: /Generate matriculation/i }).first();
    await btn.click();
    const confirm = this.page.getByRole('button', { name: /Confirm|Generate/i }).last();
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await this.page.waitForLoadState('networkidle');
    // Return visible matric number
    const body = await this.page.textContent('body') || '';
    const m = body.match(/DU\/[A-Z]+\/\d+\/\d+/);
    return m ? m[0] : '';
  }
}
