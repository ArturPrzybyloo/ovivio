import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.usernameInput = this.page.locator('#user-name');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#login-button');
    this.errorMessage = this.page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertErrorVisible(messageSubstring?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (messageSubstring) {
      await expect(this.errorMessage).toContainText(messageSubstring);
    }
  }
}

