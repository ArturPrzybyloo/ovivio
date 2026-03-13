import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MenuComponent } from '../components/MenuComponent';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly burgerMenu: MenuComponent;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.cartItems = this.page.locator('.cart_item');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.burgerMenu = new MenuComponent(this.page);
    this.header = new HeaderComponent(this.page);
  }

  async waitForLoaded(): Promise<void> {
    await this.expectUrlMatches(/cart\.html/);
    await expect(this.cartItems.first()).toBeVisible();
  }

  getCartItemByName(name: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: name })
    });
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

