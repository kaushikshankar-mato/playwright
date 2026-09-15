
from playwright.sync_api import Page, expect

BASE_URL = "https://www.saucedemo.com"


def test_login_page_loads(page: Page):
    page.goto(BASE_URL)
    expect(page.locator("#user-name")).to_be_visible()
    expect(page.locator("#password")).to_be_visible()
    expect(page.locator("#login-button")).to_be_visible()


def test_login_with_valid_credentials(page: Page):
    page.goto(BASE_URL)
    page.fill("#user-name", "standard_user")
    page.fill("#password", "secret_sauce")
    page.click("#login-button")

    expect(page).to_have_url(f"{BASE_URL}/inventory.html")
    expect(page.locator(".title")).to_have_text("Products")


def test_login_with_invalid_credentials_shows_error(page: Page):
    page.goto(BASE_URL)
    page.fill("#user-name", "wrong_user")
    page.fill("#password", "wrong_password")
    page.click("#login-button")

    expect(page.locator("[data-test='error']")).to_be_visible()
    expect(page.locator("[data-test='error']")).to_contain_text(
        "Username and password do not match"
    )


def test_add_item_to_cart(page: Page):
    page.goto(BASE_URL)
    page.fill("#user-name", "standard_user")
    page.fill("#password", "secret_sauce")
    page.click("#login-button")

    # Add the first product to the cart
    page.click(".inventory_item >> nth=0 >> button")
    expect(page.locator(".shopping_cart_badge")).to_have_text("1")


def test_logout(page: Page):
    page.goto(BASE_URL)
    page.fill("#user-name", "standard_user")
    page.fill("#password", "secret_sauce")
    page.click("#login-button")

    page.click("#react-burger-menu-btn")
    page.click("#logout_sidebar_link")

    expect(page).to_have_url(f"{BASE_URL}/")
    expect(page.locator("#login-button")).to_be_visible()