import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test('login page loads', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('#user-name')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#login-button')).toBeVisible();
});

test('login with valid credentials', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('login with invalid credentials shows error', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'wrong_user');
  await page.fill('#password', 'wrong_password');
  await page.click('#login-button');

  const error = page.locator("[data-test='error']");
  await expect(error).toBeVisible();
  await expect(error).toContainText('Username and password do not match');
});

test('add item to cart', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.locator('.inventory_item').first().locator('button').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('logout', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  await expect(page).toHaveURL(`${BASE_URL}/`);
  await expect(page.locator('#login-button')).toBeVisible();
});