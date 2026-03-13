import { Locator, Page } from '@playwright/test';

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

  async getItemsInCartCount(): Promise<number> {
    const text = (await this.cartBadge.textContent()) ?? '';
    const parsed = Number.parseInt(text, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}

