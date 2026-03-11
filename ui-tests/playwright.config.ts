import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [
        ['list'],
        ['junit', { outputFile: 'playwright-report/junit-results.xml' }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
      ]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/standard-user.json' },
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: '.auth/standard-user.json' },
      dependencies: ['setup']
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/standard-user.json' },
      dependencies: ['setup']
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'], storageState: '.auth/standard-user.json' },
      dependencies: ['setup']
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'], storageState: '.auth/standard-user.json' },
      dependencies: ['setup']
    }
  ]
});

