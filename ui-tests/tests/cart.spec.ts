import { test, expect } from '../src/fixtures/test-base';

// Cart tests log in via UI using fixtures, so override project storageState.
test.use({ storageState: undefined });

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Cart', () => {
  test('[@e2e] allows adding a product to the cart', async ({
    loginAsStandardUser,
    inventoryPage,
    cartPage
  }) => {
    await test.step('log in as standard_user', async () => {
      await loginAsStandardUser();
    });

    await test.step('add product to the cart', async () => {
      await inventoryPage.addProductToCartByName(PRODUCT_NAME);
      await inventoryPage.header.expectItemsInCart(1);
    });

    await test.step('verify product is visible in cart', async () => {
      await inventoryPage.openCart();
      await cartPage.waitForLoaded();
      await cartPage.assertProductInCart(PRODUCT_NAME);
    });
  });
});

