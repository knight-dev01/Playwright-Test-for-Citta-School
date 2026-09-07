import type { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Evidence helper per messages.txt Sec. 20 — screenshot + url + error + steps + role + expected/actual
 */
export async function captureEvidence(page: Page, testInfo: TestInfo, opts: {
  role: string;
  url: string;
  expected: string;
  actual: string;
  errorMessage?: string;
  steps?: string;
}) {
  const dir = path.resolve('Evidence', testInfo.title.replace(/[^a-z0-9\-]+/gi, '_'));
  fs.mkdirSync(dir, { recursive: true });
  const screenshotPath = path.join(dir, `${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
  const html = await page.content().catch(() => '<no content>');
  await testInfo.attach('page.html', { body: Buffer.from(html), contentType: 'text/html' });
  const meta = [
    `Role: ${opts.role}`,
    `URL: ${opts.url}`,
    `Expected: ${opts.expected}`,
    `Actual: ${opts.actual}`,
    `Error: ${opts.errorMessage || ''}`,
    `Steps: ${opts.steps || ''}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n');
  await testInfo.attach('evidence.txt', { body: Buffer.from(meta), contentType: 'text/plain' });
  return { screenshotPath, dir };
}

export function logDefect(row: { issueId?: string; testId: string; module: string; role: string; severity: string; url: string; precondition?: string; steps: string; expected: string; actual: string; errorMessage?: string }) {
  const line = `[${row.severity}] ${row.testId} | ${row.module} | ${row.role} | ${row.url} | Expected: ${row.expected} | Actual: ${row.actual} | Error: ${row.errorMessage || ''} | Steps: ${row.steps}`;
  // Also write to stdout for CI
  console.log(line);
  return line;
}
