
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:5000';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const TEST_PASSWORD = 'TestPass123!';


function uniqueUsername(prefix) {
  return `${prefix}_${Date.now()}`;
}


async function login(page, username, password) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill("input[name='username']", username);
  await page.fill("input[name='password']", password);
  await page.click("button:has-text('Login')");
}


async function register(page, username, password, role) {
  await page.goto(`${BASE_URL}/register`);
  await page.fill("input[name='username']", username);
  await page.fill("input[name='password']", password);
  await page.selectOption("select[name='role']", role);
  await page.getByRole('button', { name: 'submit' }).click();
}


async function registerAndLogin(page, role) {
  const username = uniqueUsername(role);
  await register(page, username, TEST_PASSWORD, role);
  await login(page, username, TEST_PASSWORD);
  return username;
}

test('home page loads', async ({ page }) => {
  await page.goto(BASE_URL);
  const title = await page.title();
  expect(title).not.toBe('');
});

test('login page renders', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await expect(page.locator("input[name='username']")).toBeVisible();
  await expect(page.locator("input[name='password']")).toBeVisible();
  await expect(page.locator("button:has-text('Login')")).toBeVisible();
});

test('register link present', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await expect(page.locator("a:has-text('Register')")).toBeVisible();
});