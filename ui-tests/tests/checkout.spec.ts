import { test } from '../src/fixtures/test-base';

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test(
    '[@smoke][@e2e][@storageState] allows starting the checkout process',
    async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
      await test.step('open inventory as authenticated user', async () => {
        await inventoryPage.goto();
      });

      await test.step('add product and open cart', async () => {
        await inventoryPage.addProductToCartByName(PRODUCT_NAME);
        await inventoryPage.header.openCart();
        await cartPage.waitForLoaded();
      });

      await test.step('start checkout and reach information page', async () => {
        await cartPage.startCheckout();
        await checkoutInformationPage.waitForLoaded();
      });
    }
  );
});

