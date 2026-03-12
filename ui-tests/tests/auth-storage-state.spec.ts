import { test, expect } from '../src/fixtures/test-base';

// This test demonstrates using storageState-based fixtures.
// For this demo app we do not rely on storageState for core flows,
// but the pattern is here to show how it would work with API/SSO auth.

test.describe('@storageState Authentication using prepared state', () => {
  test('opens inventory page using authenticated context', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await expect(authenticatedPage).toHaveURL(/saucedemo\.com/);
  });
});

