import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MenuComponent } from '../components/MenuComponent';
import { HeaderComponent } from '../components/HeaderComponent';

export class InventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly header: HeaderComponent;
  readonly burgerMenu: MenuComponent;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = this.page.locator('[data-test="inventory-container"]');
    this.header = new HeaderComponent(this.page);
    this.burgerMenu = new MenuComponent(this.page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
    await this.expectUrlMatches(/inventory\.html/);
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.waitForLoaded();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: name })
    });
    await expect(item).toBeVisible();
    const addButton = item.locator('button:has-text("Add to cart")');
    await addButton.click();
  }
}

