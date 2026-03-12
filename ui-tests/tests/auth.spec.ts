import { test, expect } from '../src/fixtures/test-base';
import { users } from '../src/config/users';

// For login tests we want a clean, unauthenticated state,
// so we override the project-level storageState.
test.use({ storageState: undefined });

test.describe('Authentication', () => {
  test('[@smoke][@e2e] allows login with standard_user', async ({
    loginPage,
    inventoryPage
  }) => {
    await test.step('open login page', async () => {
      await loginPage.goto();
    });

    await test.step('submit credentials', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('verify inventory is visible', async () => {
      await inventoryPage.waitForLoaded();
    });
  });

  test('[@e2e] shows error for locked_out_user', async ({ loginPage }) => {
    await test.step('open login page', async () => {
      await loginPage.goto();
    });

    await test.step('attempt login as locked_out_user', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await test.step('verify error message is shown', async () => {
      await loginPage.assertErrorVisible('locked out');
    });
  });
});

