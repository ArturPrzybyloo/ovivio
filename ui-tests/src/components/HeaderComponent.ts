import { Locator, Page, expect } from '@playwright/test';

export class HeaderComponent {
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async expectItemsInCart(count: number): Promise<void> {
    const expected = String(count);
    await expect(this.cartBadge).toHaveText(expected);
  }
}

