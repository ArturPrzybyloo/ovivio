import { test, expect } from '../src/fixtures/test-base';

// Cart tests log in via UI using fixtures, so override project storageState.
test.use({ storageState: undefined });

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Cart', () => {
  test('allows adding a product to the cart', async ({
    loginAsStandardUser,
    inventoryPage,
    cartPage
  }) => {
    await loginAsStandardUser();

    await inventoryPage.addProductToCartByName(PRODUCT_NAME);

    await inventoryPage.header.expectItemsInCart(1);

    await inventoryPage.openCart();
    await cartPage.waitForLoaded();
    await cartPage.assertProductInCart(PRODUCT_NAME);
  });
});

