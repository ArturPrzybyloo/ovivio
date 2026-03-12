import { test } from '../src/fixtures/test-base';

// Checkout tests log in via UI using fixtures, so override project storageState.
test.use({ storageState: undefined });

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test('[@smoke][@e2e] allows starting the checkout process', async ({
    loginAsStandardUser,
    inventoryPage,
    cartPage,
    checkoutInformationPage
  }) => {
    await test.step('log in as standard_user', async () => {
      await loginAsStandardUser();
    });

    await test.step('add product and open cart', async () => {
      await inventoryPage.addProductToCartByName(PRODUCT_NAME);
      await inventoryPage.openCart();
      await cartPage.waitForLoaded();
    });

    await test.step('start checkout and reach information page', async () => {
      await cartPage.startCheckout();
      await checkoutInformationPage.waitForLoaded();
    });
  });
});

