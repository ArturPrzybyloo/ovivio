import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { users } from '../config/users';

type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  loginAsStandardUser: () => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutInformationPage: async ({ page }, use) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    await use(checkoutInformationPage);
  },
  loginAsStandardUser: async ({ page }, use) => {
    await use(async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.waitForLoaded();
    });
  }
});

export { expect };

