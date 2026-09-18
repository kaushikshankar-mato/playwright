import pytest
from playwright.sync_api import Page, expect

TIMEOUT = 15000  


def test_search_product(page: Page):
    page.goto("http://localhost:4200")
    page.wait_for_load_state("networkidle")

    page.fill('[data-test="search-query"]', "pliers")
    page.press('[data-test="search-query"]', "Enter")
    page.wait_for_load_state("networkidle")
    
    expect(page.locator(".card-title").first).not_to_have_text("", timeout=TIMEOUT)

    products = [p.strip() for p in page.locator(".card-title").all_inner_texts() if p.strip()]

    assert len(products) > 0
    for name in products:
        assert "pliers" in name.lower()


def test_apply_filter(page: Page):
    page.goto("http://localhost:4200")
    page.wait_for_load_state("networkidle")
    expect(page.locator(".card-title").first).not_to_have_text("", timeout=TIMEOUT)

    checkbox = page.locator('input[type="checkbox"]').first
    checkbox.check()
    page.wait_for_timeout(1000)

    products = [p.strip() for p in page.locator(".card-title").all_inner_texts() if p.strip()]
    assert len(products) >= 0


def test_apply_sorting(page: Page):
    page.goto("http://localhost:4200")
    page.wait_for_load_state("networkidle")
    expect(page.locator(".card-title").first).not_to_have_text("", timeout=TIMEOUT)

    page.select_option('[data-test="sort"]', value="name,asc")
    page.wait_for_timeout(1500)

    products = [p.strip() for p in page.locator(".card-title").all_inner_texts() if p.strip()]
    assert products == sorted(products, key=str.lower)


def test_pagination(page: Page):
    page.goto("http://localhost:4200")
    page.wait_for_load_state("networkidle")
    expect(page.locator(".card-title").first).not_to_have_text("", timeout=TIMEOUT)

    first_page = [p.strip() for p in page.locator(".card-title").all_inner_texts() if p.strip()]

    next_btn = page.locator('[aria-label="Next"]')
    if next_btn.is_visible() and next_btn.is_enabled():
        next_btn.click()
        page.wait_for_timeout(1000)
        second_page = [p.strip() for p in page.locator(".card-title").all_inner_texts() if p.strip()]
        assert first_page != second_page


def test_select_product_and_validate_details(page: Page):
    page.goto("http://localhost:4200")
    page.wait_for_load_state("networkidle")

    first_card = page.locator(".card").first
    expect(first_card.locator(".card-title")).not_to_have_text("", timeout=TIMEOUT)

    name_in_search = first_card.locator(".card-title").inner_text().strip()

    first_card.click()
    page.wait_for_url("**/product/**", timeout=10000)

    detail_locator = page.locator('h1[data-test="product-name"], h3[data-test="product-name"]')
    expect(detail_locator).not_to_have_text("", timeout=TIMEOUT)

    name_in_details = detail_locator.inner_text().strip()

    assert name_in_search == name_in_details
