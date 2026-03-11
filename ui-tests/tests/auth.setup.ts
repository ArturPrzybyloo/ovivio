import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { users } from '../src/config/users';

/*
This setup test shows the recommended pattern for preparing an authenticated storageState
that can be reused by other projects. In this particular demo app (SauceDemo) the login
state still partially depends on sessionStorage, so tests do not rely solely on this
snapshot, but the structure mirrors how you would implement SSO/API-based login in a
real system where cookies/localStorage carry the authenticated state.
*/
test('authenticate as standard user', async ({ page }) => {
  const authDir = path.join(__dirname, '..', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', users.standard.username);
  await page.fill('#password', users.standard.password);
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');

  await page.context().storageState({
    path: path.join(authDir, 'standard-user.json')
  });
});



