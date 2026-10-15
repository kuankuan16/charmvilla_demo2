// Browser tests of the bag and checkout hand-off (shopify mode against the mock store, plus local mode), in English and Chinese.
// Chrome is used through Playwright (devDependency `playwright`, channel "chrome": the installed Google Chrome, no download).
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { BASE, LOCAL_BASE, MOCK, mock, fixture, variant } from "../support/helpers.mjs";

let browser;
before(async () => { browser = await chromium.launch({ channel: "chrome", headless: !process.env.HEADED }); });
after(async () => { await browser?.close(); });
beforeEach(() => mock.reset());

const REUNION = "reunion-paper-gift-box", DAWN = "spring-dawn-gift-box", SNOW = "snowflake-gift-box", BUTTERFLY = "purple-butterfly-gift-box";
const prefix = (lang) => (lang === "zh" ? "/zh" : "");
const usd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const T = {
  en: { empty: "Your bag is empty.", preorder: fixture.preOrderShipping.en, free: "qualifies for complimentary shipping", below: "Complimentary shipping on orders of US$199", soldOut: "Sold out", signIn: "Sign in", signOut: "Sign out", hello: "Hello", stock: "Only 1 items", checkout: "Go to checkout", localNote: "Online checkout is not open yet" },
  zh: { empty: "購物車是空的。", preorder: fixture.preOrderShipping.zh, free: "可享免運", below: "訂單金額滿 US$ 199", soldOut: "已售罄", signIn: "登入", signOut: "登出", hello: "您好", stock: "部分商品的數量已依目前庫存調整。", checkout: "前往結帳", localNote: "線上結帳即將開放" },
};

/** A fresh browser tab that records console errors, page errors and failed requests; the newsletter pop-up is marked as seen. */
async function open(width = 1440, height = 900) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript(() => { try { localStorage.setItem("cv-newsletter-popup-seen", "1"); } catch { /* */ } });
  const page = await context.newPage();
  const problems = [];
  page.on("console", (m) => { if (m.type() === "error") problems.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => { const f = r.failure()?.errorText ?? ""; if (!/ERR_ABORTED|NS_BINDING_ABORTED/.test(f)) problems.push(`requestfailed: ${r.url()} ${f}`); });
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/api/account/me")) problems.push(`HTTP ${r.status()} ${r.url()}`); });
  return { context, page, problems };
}
const noOverflow = async (page, label) => {
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  assert.ok(sw <= iw, `${label}: page is ${sw}px wide in a ${iw}px window`);
};
const settled = (page) => page.locator(".cart-root.is-open .cart-panel:not(:has([aria-busy=\"true\"]))").waitFor();
/** Runs a bag action and waits for its /api/cart answer to be shown. */
const act = async (page, action, shopify = true) => {
  const answer = shopify ? page.waitForResponse((r) => r.url().includes("/api/cart") && r.request().method() !== "GET") : null;
  await action(); await answer; await settled(page);
};
const addFromPage = async (page, shopify = true) => {
  const radios = page.locator('.product-choices input[type="radio"]');
  if (await radios.count() && !await page.locator('.product-choices input:checked').count()) {
    const labels = page.locator('.product-choices label').filter({ hasNotText: /售罄|Sold out/ });
    await labels.first().click();
  }
  await act(page, () => page.locator("button.product-buy").click(), shopify); await page.locator(".cart-root.is-open").waitFor(); };
const tap = (page, locator) => act(page, () => locator.click());
const closeBag = async (page) => { await page.locator(".cart-panel .cart-close").click(); await page.locator(".cart-root:not(.is-open)").waitFor({ state: "attached" }); };
const lines = (page) => page.locator(".cart-panel .cart-line");
const subtotalText = (page) => page.locator(".cart-subtotal strong").innerText();
const cartState = async () => (await mock.state()).carts;

for (const lang of ["en", "zh"]) {
  const t = T[lang];
  const name = (slug) => (lang === "en" ? fixture.products[slug].name : null);

  test(`[${lang}] optioned and pre-order pieces: names, options, Shopify prices, notes, quantities, checkout`, async () => {
    const { context, page, problems } = await open();
    // 1. a published pre-order product; choose its first available option
    await page.goto(`${BASE}${prefix(lang)}/products/${REUNION}`);
    await noOverflow(page, "product page 1440");
    await addFromPage(page);
    await assert.doesNotReject(lines(page).first().waitFor());
    assert.equal(await lines(page).count(), 1);
    const first = lines(page).first();
    if (name(REUNION)) assert.match(await first.locator(".cart-line-name").innerText(), new RegExp(name(REUNION), "i"));
    assert.equal(await first.locator(".cart-line-price").innerText(), usd(fixture.products[REUNION].price));
    assert.equal(await first.locator(".cart-line-preorder").innerText(), t.preorder);
    assert.equal(await subtotalText(page), usd(fixture.products[REUNION].price));
    assert.ok((await page.locator(".cart-foot").innerText()).includes(t.below), "below US$199: the free-shipping threshold is explained");
    let carts = await cartState();
    assert.equal(carts.length, 1);
    assert.equal(carts[0].buyerIdentity.countryCode, "US");
    assert.deepEqual(carts[0].lines[0].attributes, [{ key: "Packaging", value: fixture.products[REUNION].options[0].label }, { key: "Pre-order", value: "Yes" }]);
    await closeBag(page);

    // 2. tea × lid colour option
    await page.goto(`${BASE}${prefix(lang)}/products/${DAWN}`);
    const opt = fixture.products[DAWN].options[2];
    await page.locator(`label:has(input[name="tea-${DAWN}"])`).nth(2).click();
    await addFromPage(page);
    assert.equal(await lines(page).count(), 2);
    const dawnLine = lines(page).nth(1);
    if (lang === "en") assert.ok((await dawnLine.locator(".cart-line-name").innerText()).includes(opt.label));
    assert.equal(await dawnLine.locator(".cart-line-price").innerText(), usd(opt.price));
    carts = await cartState();
    assert.equal(carts.length, 1, "the second piece goes into the same Shopify cart");
    assert.equal(carts[0].lines[1].merchandiseId, variant(DAWN, 2));
    assert.deepEqual(carts[0].lines[1].attributes, [{ key: "Tea", value: opt.label }, { key: "Pre-order", value: "Yes" }]);
    let total = fixture.products[REUNION].price + opt.price;
    assert.equal(await subtotalText(page), usd(total));
    assert.ok((await page.locator(".cart-foot").innerText()).includes(t.free), "US$199 or more: complimentary shipping");
    await closeBag(page);

    // Christmas products remain unpublished; exercise quantities only with published lines.
    await page.locator(".header-cart-btn").first().click();
    await settled(page);

    // 4. quantity + and −, remove
    await tap(page, lines(page).first().locator(".cart-qty button").last());
    assert.equal(await lines(page).first().locator(".cart-qty span").innerText(), "2");
    assert.equal(await subtotalText(page), usd(total + fixture.products[REUNION].price));
    assert.equal(await page.locator(".header-cart-count").first().innerText(), "3");
    await tap(page, lines(page).first().locator(".cart-qty button").first());
    assert.equal(await lines(page).first().locator(".cart-qty span").innerText(), "1");
    assert.equal(await lines(page).first().locator(".cart-qty button").first().isDisabled(), true, "− stops at 1");
    assert.equal(await lines(page).count(), 2);
    assert.equal(await subtotalText(page), usd(fixture.products[REUNION].price + opt.price));

    // 5. phone width: nothing sticks out with the bag open
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow(page, "bag open 390");
    await page.setViewportSize({ width: 1440, height: 900 });

    // 6. checkout goes to Shopify's checkout for this cart
    const href = await page.locator("a.cart-checkout").getAttribute("href");
    assert.ok(href.startsWith(`${MOCK}/cart/c/`), href);
    await page.locator("a.cart-checkout").click();
    await page.waitForURL(`${MOCK}/cart/c/**`);
    assert.equal(await page.locator("#country").innerText(), "US");
    assert.equal(await page.locator("#subtotal").innerText(), (fixture.products[REUNION].price + opt.price).toFixed(1));

    // 7. back on the site the bag is still there; empty it
    await page.goto(`${BASE}${prefix(lang)}/products/${REUNION}`);
    await page.locator(".header-cart-btn").first().click();
    await lines(page).first().waitFor();
    while (await lines(page).count()) await tap(page, lines(page).first().locator(".cart-remove"));
    assert.equal(await page.locator(".cart-empty p").first().innerText(), t.empty);
    assert.equal(await page.locator(".header-cart-count").count(), 0);
    assert.deepEqual(problems, []);
    await context.close();
  });

  test(`[${lang}] the first add fails: the empty bag says why`, async () => {
    const { context, page } = await open(390, 844);
    await mock.config({ failNext: { op: "CartCreate", message: "Mock checkout outage" } });
    await page.goto(`${BASE}${prefix(lang)}/products/${REUNION}`);
    await noOverflow(page, "product page 390");
    await addFromPage(page);
    await page.locator(".cart-error").waitFor();
    assert.ok((await page.locator(".cart-error").innerText()).length > 0);
    assert.equal(await page.locator(".cart-empty p").first().innerText(), t.empty);
    assert.equal(await page.evaluate(() => localStorage.getItem("cv-cart-id")), null);
    await context.close();
  });

  test(`[${lang}] live variant sold out: purchase stays disabled`, async () => {
    await mock.config({ stock: { [variant(BUTTERFLY)]: 0 } });
    const { context, page, problems } = await open();
    await page.goto(`${BASE}${prefix(lang)}/products/${BUTTERFLY}`);
    const buy = page.locator("button.product-buy");
    await page.waitForFunction((txt) => document.querySelector("button.product-buy")?.textContent === txt, t.soldOut);
    assert.equal(await buy.isDisabled(), true);
    assert.ok(await page.locator(".product-soldout").first().isVisible());
    assert.deepEqual(problems, []);
    await context.close();
  });

  test(`[${lang}] fewer left than asked: Shopify's stock note, and a line removed in Shopify disappears from the bag`, async () => {
    const { context, page } = await open();
    await mock.config({ stock: { [variant(DAWN, 0)]: 1 } });
    await page.goto(`${BASE}${prefix(lang)}/products/${DAWN}`);
    await page.locator(`label:has(input[name="tea-${DAWN}"])`).nth(0).click();
    await addFromPage(page);
    await tap(page, lines(page).first().locator(".cart-qty button").last());
    assert.ok((await page.locator(".cart-notice").innerText()).includes(t.stock));
    assert.equal(await lines(page).first().locator(".cart-qty span").innerText(), "1");
    // the line is taken out on Shopify's side; the next change refreshes the bag from Shopify
    await closeBag(page);
    await page.goto(`${BASE}${prefix(lang)}/products/${REUNION}`);
    await addFromPage(page);
    const [cart] = await cartState();
    await mock.removeLine(cart.id, cart.lines[0].id);
    await tap(page, lines(page).first().locator(".cart-qty button").last());
    await page.locator(".cart-error").waitFor();
    assert.equal(await lines(page).count(), 1, "the removed line is gone from the bag");
    await context.close();
  });

  test(`[${lang}] sign in ties the bag to the customer; sign out lets it go`, async () => {
    await mock.customer({ email: "shopper@example.com", password: "correct-horse-1", firstName: "Sam", lastName: "Lee" });
    const { context, page, problems } = await open();
    await page.goto(`${BASE}${prefix(lang)}/products/${REUNION}`);
    await addFromPage(page);
    await closeBag(page);
    assert.equal((await cartState())[0].buyerIdentity.customerId, undefined);
    await page.goto(`${BASE}${prefix(lang)}/account`);
    await page.locator("#login-email").fill("shopper@example.com");
    await page.locator("#login-password").fill("correct-horse-1");
    await page.locator(".account-form button[type=submit]").click();
    await page.locator(".account-shell--in").waitFor();
    assert.ok((await page.locator(".account-title").first().innerText()).includes(t.hello));
    const bi = (await cartState())[0].buyerIdentity;
    assert.match(bi.customerId ?? "", /^gid:\/\/shopify\/Customer\//);
    assert.equal(bi.countryCode, "US");
    await noOverflow(page, "account 1440");
    await page.locator(".account-logout").click();
    await page.locator(".account-shell--out").waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem("cv-cart-id")), null);
    assert.equal(await page.locator(".header-cart-count").count(), 0);
    await page.locator(".header-cart-btn").first().click();
    assert.equal(await page.locator(".cart-empty p").first().innerText(), t.empty);
    assert.deepEqual(problems.filter((p) => !/\/api\/account\/me/.test(p) && !/401/.test(p)), []);
    await context.close();
  });
}

for (const lang of ["en", "zh"]) test(`[${lang}] unpublished Christmas products retain correct choices and the confirmed three-box set`, async () => {
  const { context, page, problems } = await open();
  for (const slug of ["christmas-gift-box", SNOW]) {
    await page.goto(`${BASE}${prefix(lang)}/products/${slug}`);
    await page.waitForFunction((txt) => document.querySelector("button.product-buy")?.textContent === txt, T[lang].soldOut);
    assert.equal(await page.locator("button.product-buy").isDisabled(), true);
    assert.equal(await page.locator('.product-choices input').count(), fixture.products[slug].options.length);
    assert.equal(await page.locator('.product-mix').count(), 0);
    if (slug === SNOW) {
      assert.ok((await page.locator('body').innerText()).includes('$60.00'));
      assert.match(await page.locator('body').innerText(), lang === 'zh' ? /3 盒一組/ : /Set of 3 boxes/);
    }
  }
  assert.deepEqual(problems, []); await context.close();
});

test("newsletter pop-up: opens by itself in shopify mode, never in local mode", async () => {
  for (const [base, expected] of [[BASE, true], [LOCAL_BASE, false]]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${base}/collections/tea`);
    const shown = await page.locator(".news-pop-panel").waitFor({ timeout: 12000 }).then(() => true, () => false); // opens after 8 s
    assert.equal(shown, expected, base);
    await context.close();
  }
});

test("[en] the footer newsletter form subscribes through Shopify", async () => {
  const { context, page } = await open();
  await page.goto(`${BASE}/collections/tea`);
  await page.locator("#footer-email").fill("footer@example.com");
  await page.locator(".footer-news-form button[type=submit]").click();
  await page.locator(".footer-news-status").waitFor();
  assert.match(await page.locator(".footer-news-status").innerText(), /Thank you/);
  const c = (await mock.state()).customers.find((x) => x.email === "footer@example.com");
  assert.equal(c?.emailMarketingConsent?.marketingState, "SUBSCRIBED");
  await context.close();
});

for (const lang of ["en", "zh"]) test(`[${lang}] local mode: the bag lives in the browser, checkout stays closed`, async () => {
  const { context, page, problems } = await open(390, 844);
  await page.goto(`${LOCAL_BASE}${prefix(lang)}/products/${REUNION}`);
  await addFromPage(page, false);
  assert.equal(await lines(page).count(), 1);
  assert.equal(await lines(page).first().locator(".cart-line-price").innerText(), usd(fixture.products[REUNION].price));
  assert.equal(await page.locator(".cart-checkout").evaluate((el) => el.tagName), "BUTTON");
  assert.equal(await page.locator(".cart-checkout").isDisabled(), true);
  assert.ok((await page.locator(".cart-foot").innerText()).includes(T[lang].localNote));
  const stored = JSON.parse(await page.evaluate(() => localStorage.getItem("cv-cart")));
  assert.equal(stored.length, 1); assert.equal(stored[0].slug, REUNION); assert.equal(stored[0].quantity, 1); assert.equal(stored[0].option, 2);
  await noOverflow(page, "local bag 390");
  await page.reload();
  await page.locator(".header-cart-count").first().waitFor();
  assert.equal(await page.locator(".header-cart-count").first().innerText(), "1");
  assert.equal((await mock.state()).log.length, 0, "local mode never calls Shopify");
  assert.deepEqual(problems, []);
  await context.close();
});
