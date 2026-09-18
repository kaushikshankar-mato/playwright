import random
from playwright.sync_api import Page, expect
BASE_URL = "http://localhost:4200"
email = f"arundeepak{random.randint(10000, 99999)}@example.com"
password = "ArunDeepak*123"

def test_application_accessible(page: Page):

    page.goto(BASE_URL)

    expect(page.locator("#Layer_1")).to_be_visible()

 
def register_user(page: Page):

    page.goto(f"{BASE_URL}/auth/register")

    page.get_by_placeholder("First name *").fill("Arun")

    page.get_by_placeholder("Your last name *").fill("Deepak")

    page.get_by_placeholder("YYYY-MM-DD").fill("1999-01-01")

    page.locator("#country").select_option("IN")

    page.get_by_placeholder("Your Postcode *").fill("630606")

    page.get_by_placeholder("e.g. 42 *").fill("32-E")

    page.get_by_placeholder("Your Street *").fill("Main Street")

    page.get_by_placeholder("Your City *").fill("Manamadurai")

    page.get_by_placeholder("Your State *").fill("Tamil Nadu")

    page.locator("[data-test='phone']").fill("9876543210")

    page.get_by_placeholder("Your email *").fill(email)

    page.get_by_placeholder("Your password").fill(password)

    page.locator("button[data-test='register-submit']").click()



def login(page: Page):

    page.goto(f"{BASE_URL}/auth/login")

    page.get_by_placeholder("Your email").fill(email)

    page.get_by_placeholder("Your password").fill(password)

    page.locator("input[data-test='login-submit']").click()

    
def test_register_and_login(page: Page):

    register_user(page)

    login(page)


def test_session_persistence(page: Page):

    register_user(page)

    login(page)

    page.reload()


def test_new_browser_context(page: Page, browser):

    register_user(page)

    login(page)

    context = browser.new_context()

    new_page = context.new_page()

    new_page.goto(BASE_URL)

    context.close()


def test_logout(page: Page):

    register_user(page)
    login(page)

    print("LOGIN URL:", page.url)
    print("PAGE TEXT AFTER LOGIN:")
    print(page.locator("body").inner_text())


def test_invalid_login(page: Page):

    page.goto(f"{BASE_URL}/auth/login")

    page.get_by_placeholder("Your email").fill("invalid@example.com")

    page.get_by_placeholder("Your password").fill("WrongPassword*123")

    page.locator("input[data-test='login-submit']").click()


def test_required_fields(page: Page):

    page.goto(f"{BASE_URL}/auth/register")

    expect(page.get_by_placeholder("First name *")).to_have_attribute("aria-required", "true")

    expect(page.get_by_placeholder("Your last name *")).to_have_attribute("aria-required", "true")

    expect(page.get_by_placeholder("Your Postcode *")).to_have_attribute("aria-required", "true")

    expect(page.get_by_placeholder("Your email *")).to_have_attribute("aria-required", "true")


def test_authentication_storage(page: Page):

    register_user(page)

    login(page)

    cookies = page.context.cookies()
    
    local_storage = page.evaluate("Object.keys(localStorage)")

    session_storage = page.evaluate("Object.keys(sessionStorage)")

    print("Cookies:", cookies)

    print("Local Storage:", local_storage)
    
    print("Session Storage:", session_storage)

