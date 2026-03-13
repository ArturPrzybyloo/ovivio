import { test, expect } from '../src/fixtures/test-base';

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Cart', () => {
  test('[@e2e][@storageState] allows adding a product to the cart', async ({
    inventoryPage,
    cartPage
  }) => {
    await test.step('open inventory as authenticated user', async () => {
      await inventoryPage.goto();
    });

    await test.step('add product to the cart', async () => {
      await inventoryPage.addProductToCartByName(PRODUCT_NAME);
      expect(await inventoryPage.header.getItemsInCartCount()).toBe(1);
    });

    await test.step('verify product is visible in cart', async () => {
      await inventoryPage.header.openCart();
      await cartPage.waitForLoaded();
      await expect(cartPage.getCartItemByName(PRODUCT_NAME)).toBeVisible();
    });
  });
});

