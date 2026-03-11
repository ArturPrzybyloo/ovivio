import { test } from '../src/fixtures/test-base';

// Checkout tests log in via UI using fixtures, so override project storageState.
test.use({ storageState: undefined });

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test('[@smoke] allows starting the checkout process', async ({
    loginAsStandardUser,
    inventoryPage,
    cartPage,
    checkoutInformationPage
  }) => {
    await loginAsStandardUser();

    await inventoryPage.addProductToCartByName(PRODUCT_NAME);
    await inventoryPage.openCart();

    await cartPage.waitForLoaded();
    await cartPage.startCheckout();

    await checkoutInformationPage.waitForLoaded();
  });
});

