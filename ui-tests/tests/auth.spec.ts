import { test, expect } from '../src/fixtures/test-base';
import { users } from '../src/config/users';

// For login tests we want a clean, unauthenticated state,
// so we override the project-level storageState.
test.use({ storageState: undefined });

test.describe('Authentication', () => {
  test('[@smoke] allows login with standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.waitForLoaded();
  });

  test('shows error for locked_out_user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.assertErrorVisible('locked out');
  });
});

