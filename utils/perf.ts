import type { Page } from '@playwright/test';

/**
 * Performance measurer — messages.txt Sec. 18: Common ≤3s, Dashboard ≤5s
 */
export async function measurePageLoad(page: Page, url: string): Promise<{ url: string; durationMs: number; status: 'PASS'|'FAIL' }> {
  const start = Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  const durationMs = Date.now() - start;
  const isDashboard = url.includes('executive') || url.includes('dashboard') || url.includes('overview');
  const threshold = isDashboard ? 5000 : 3000;
  const status = durationMs <= threshold ? 'PASS' : 'FAIL';
  return { url, durationMs, status };
}

export function formatPerf(url: string, durationMs: number, thresholdMs: number) {
  return `${url} — ${durationMs}ms (threshold ${thresholdMs}ms) — ${durationMs <= thresholdMs ? 'PASS' : 'FAIL'}`;
}
