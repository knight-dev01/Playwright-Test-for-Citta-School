import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://demo.cittaschool.com';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    channel: 'chrome',
    launchOptions: { executablePath: CHROME_PATH },
  },
  projects: [
    // Setup — creates storageState for each role
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { channel: 'chrome', launchOptions: { executablePath: CHROME_PATH } },
    },
    // Role-isolated Chromium projects — each depends on setup
    {
      name: 'chromium-applicant',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/applicant.json' },
    },
    {
      name: 'chromium-student',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/student.json' },
    },
    {
      name: 'chromium-registrar',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/registrar.json' },
    },
    {
      name: 'chromium-lecturer',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/lecturer.json' },
    },
    {
      name: 'chromium-bursar',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/bursar.json' },
    },
    {
      name: 'chromium-executive',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/executive.json' },
    },
    // Cross-browser smoke (optional)
    {
      name: 'firefox',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], storageState: '.auth/registrar.json' },
    },
    {
      name: 'webkit',
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], storageState: '.auth/registrar.json' },
    },
    // Unauthenticated — for smoke + TC-01/02 (no storageState)
    {
      name: 'chrome-unauth',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH } },
    },
    // Mobile — Pixel 7 for TC-25 / messages 49
    {
      name: 'mobile-chrome',
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/student.json' },
    },
    {
      name: 'mobile-executive',
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], channel: 'chrome', launchOptions: { executablePath: CHROME_PATH }, storageState: '.auth/executive.json' },
    },
  ],
  // No webServer for live site — hits BASE_URL directly
});
