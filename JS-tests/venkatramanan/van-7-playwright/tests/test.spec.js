const { test, expect } = require('@playwright/test');

test.describe('Toolshop JS Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const firstTitle = page.locator('.card-title').first();
    await expect(firstTitle).toBeVisible({ timeout: 30000 });
    await expect(firstTitle).not.toHaveText('', { timeout: 30000 });
  });

  test('Search products for pliers', async ({ page }) => {
    const searchInput = page.locator('[data-test="search-query"]');
    
    // Intercept backend API response for search
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/products') && res.status() === 200
    );

    await searchInput.fill('pliers');
    await searchInput.press('Enter');
    await responsePromise;

    const cards = page.locator('.card-title');
    await expect(cards.first()).toBeVisible();

    const titles = await cards.allInnerTexts();
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain('pliers');
    }
  });

  test('Apply A-Z sorting (client-side)', async ({ page }) => {
    await page.locator('[data-test="sort"]').selectOption('name,asc');

    
    await page.waitForFunction(() => {
      const titles = Array.from(document.querySelectorAll('.card-title'))
        .map((el) => el.textContent.trim().toLowerCase())
        .filter((t) => t.length > 0);
      if (titles.length === 0) return false;
      for (let i = 0; i < titles.length - 1; i++) {
        if (titles[i].localeCompare(titles[i + 1]) > 0) return false;
      }
      return true;
    }, { timeout: 30000 });

    const titles = await page.locator('.card-title').allInnerTexts();
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    expect(titles).toEqual(sortedTitles);
  });
});
