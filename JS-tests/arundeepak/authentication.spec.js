import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:4200";
const email = `arundeepak${Math.floor(10000 + Math.random() * 90000)}@example.com`;
const password = "ArunDeepak*123";

async function test_application_accessible(page) {

    await page.goto(BASE_URL);

    await expect(page.locator("#Layer_1")).toBeVisible();
}

async function register_user(page) {

    await page.goto(`${BASE_URL}/auth/register`);

    await page.getByPlaceholder("First name *").fill("Arun");

    await page.getByPlaceholder("Your last name *").fill("Deepak");

    await page.getByPlaceholder("YYYY-MM-DD").fill("1999-01-01");

    await page.locator("#country").selectOption("IN");

    await page.getByPlaceholder("Your Postcode *").fill("630606");

    await page.getByPlaceholder("e.g. 42 *").fill("32-E");

    await page.getByPlaceholder("Your Street *").fill("Main Street");

    await page.getByPlaceholder("Your City *").fill("Manamadurai");

    await page.getByPlaceholder("Your State *").fill("Tamil Nadu");

    await page.locator("[data-test='phone']").fill("9876543210");

    await page.getByPlaceholder("Your email *").fill(email);

    await page.getByPlaceholder("Your password").fill(password);

    await page.locator("button[data-test='register-submit']").click();
}

async function login(page) {

    await page.goto(`${BASE_URL}/auth/login`);

    await page.getByPlaceholder("Your email").fill(email);

    await page.getByPlaceholder("Your password").fill(password);

    await page.locator("input[data-test='login-submit']").click();
}

test("test_application_accessible", async ({ page }) => {

    await test_application_accessible(page);
});

test("test_register_and_login", async ({ page }) => {

    await register_user(page);

    await login(page);
});

test("test_session_persistence", async ({ page }) => {

    await register_user(page);

    await login(page);

    await page.reload();
});

test("test_new_browser_context", async ({ page, browser }) => {

    await register_user(page);

    await login(page);

    const context = await browser.newContext();

    const new_page = await context.newPage();

    await new_page.goto(BASE_URL);

    await context.close();
});

test("test_logout", async ({ page }) => {

    await register_user(page);
    await login(page);

    console.log("LOGIN URL:", page.url());

    console.log("PAGE TEXT AFTER LOGIN:");
    console.log(await page.locator("body").innerText());
});

test("test_invalid_login", async ({ page }) => {

    await page.goto(`${BASE_URL}/auth/login`);

    await page.getByPlaceholder("Your email").fill("invalid@example.com");

    await page.getByPlaceholder("Your password").fill("WrongPassword*123");

    await page.locator("input[data-test='login-submit']").click();
});

test("test_required_fields", async ({ page }) => {

    await page.goto(`${BASE_URL}/auth/register`);

    await expect(page.getByPlaceholder("First name *"))
        .toHaveAttribute("aria-required", "true");

    await expect(page.getByPlaceholder("Your last name *"))
        .toHaveAttribute("aria-required", "true");

    await expect(page.getByPlaceholder("Your Postcode *"))
        .toHaveAttribute("aria-required", "true");

    await expect(page.getByPlaceholder("Your email *"))
        .toHaveAttribute("aria-required", "true");
});

test("test_authentication_storage", async ({ page }) => {

    await register_user(page);

    await login(page);

    const cookies = await page.context().cookies();

    const local_storage = await page.evaluate(() =>
        Object.keys(localStorage)
    );

    const session_storage = await page.evaluate(() =>
        Object.keys(sessionStorage)
    );

    console.log("Cookies:", cookies);

    console.log("Local Storage:", local_storage);

    console.log("Session Storage:", session_storage);
});