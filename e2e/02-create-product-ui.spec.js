// Product creation — full UI flow.
//
// Logs in as the seeded admin, opens /product/create, fills the minimum
// required fields across the form tabs (General -> categories -> inventory),
// saves, and verifies the product exists via the API. Requires both servers
// running: admin dashboard on :3000 and the seeded API on :5000.

const { test, expect } = require("@playwright/test");
const { loginViaAPI, apiRequest } = require("./helpers/auth");

/** Click a custom select (ReactstrapSelectInput) by input id, pick option by text. */
async function pickSelectOption(page, inputId, optionText) {
  const box = page.locator(`.custom-select-box:has(#${inputId})`).first();
  await box.scrollIntoViewIfNeeded();
  await box.locator("input").first().click();
  const option = box
    .locator(".box-content li p")
    .filter({ hasText: optionText })
    .first();
  if (await option.count()) {
    await option.click();
  } else {
    await box.locator(".box-content li").first().click(); // fallback: first option
  }
}

/** Click a tab in the vertical product nav by its visible title. */
async function openTab(page, titleRegex) {
  const link = page.locator(".nav-pills .nav-link").filter({ hasText: titleRegex }).first();
  await link.click();
  await page.waitForTimeout(300);
}

test("admin can create a product through the UI", async ({ page }) => {
  test.setTimeout(120000);
  const { token } = await loginViaAPI(page);
  const name = `E2E UI Producto ${Date.now()}`;

  await page.goto("/product/create", { waitUntil: "networkidle" });
  await expect(page.locator('input[name="name"]').first()).toBeVisible({ timeout: 20000 });

  // ── General tab ────────────────────────────────────────────────
  await page.fill('input[name="name"]', name);
  await page.fill('textarea[name="short_description"]', "Producto creado por la suite e2e (UI)");

  // Description — Jodit rich-text editor; only a blur commits the value
  // into Formik, so fire a native blur explicitly after typing.
  const editor = page.locator(".jodit-wysiwyg").first();
  await editor.scrollIntoViewIfNeeded();
  await editor.click();
  await editor.type("Descripción de prueba del producto e2e para la suite automatizada.");
  await editor.evaluate((el) => el.blur());
  await page.waitForTimeout(400);

  // Tax — seeded as "IVA".
  await pickSelectOption(page, "tax_id", /IVA/i);

  // ── Categories (tags multi-select on the Setup tab) ───────────
  // CAREFUL: the Setup tab has several tag-style inputs (Tags, Categories,
  // Cross Sell...). Scope to the field row whose label says "Categories".
  await openTab(page, /Setup|Configuraci/i);
  const catField = page
    .locator("div:has(.category-select-box)")
    .filter({ hasText: /Categor/i })
    .last(); // innermost container that has both the label and the widget
  const tagsInput = catField.locator(".bootstrap-tagsinput").first();
  await tagsInput.scrollIntoViewIfNeeded();
  await tagsInput.click();
  // Its dropdown panel: each category row has a "Select" link.
  const catBox = catField.locator(".select-category-box.show").first();
  await expect(catBox).toBeVisible({ timeout: 10000 });
  const preferred = catBox.locator(".category-listing li").filter({ hasText: /Mujer|Hombre|Accesorios/i }).first();
  const targetLi = (await preferred.count()) ? preferred : catBox.locator(".category-listing li").first();
  await targetLi.locator("a.select-btn").click();
  // the chosen category should now appear as a tag chip in the input
  await expect(tagsInput).toHaveText(/Mujer|Hombre|Accesorios|Niños|Calzado/i, { timeout: 5000 });
  // close the panel
  await page.keyboard.press("Escape").catch(() => {});
  await page.mouse.click(10, 300); // click empty area outside the panel
  await page.waitForTimeout(300);

  // ── Inventory tab (sku / quantity / price for simple products) ─
  const skuInput = page.locator('input[name="sku"]');
  if (!(await skuInput.isVisible().catch(() => false))) {
    await openTab(page, /Inventory|Inventario/i);
  }
  await skuInput.fill(`E2E-UI-${Date.now()}`);
  await page.fill('input[name="quantity"]', "10");
  await page.fill('input[name="price"]', "99900");

  // ── Save ──────────────────────────────────────────────────────
  const saveBtn = page.locator(".save-back-button button.btn-primary").last();
  const responsePromise = page
    .waitForResponse((r) => r.url().includes("/product") && r.request().method() === "POST", { timeout: 15000 })
    .catch(() => null);
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  const response = await responsePromise;

  if (!response) {
    // Formik blocked the submit — surface WHICH fields are invalid.
    await page.waitForTimeout(500);
    const fieldErrors = await page.locator(".invalid-feedback").allTextContents();
    const invalidTabs = await page.locator(".nav-item.is-invalid .nav-link").allTextContents();
    throw new Error(
      `Save did not trigger POST /product. Validation errors: ${JSON.stringify(fieldErrors.filter(Boolean))}; invalid tabs: ${JSON.stringify(invalidTabs)}`
    );
  }
  expect([200, 201]).toContain(response.status());

  // ── Verify via API + cleanup ──────────────────────────────────
  const listRes = await apiRequest(page, token, "GET", `/product?search=${encodeURIComponent(name)}`);
  const listStr = JSON.stringify(await listRes.json());
  expect(listStr).toContain(name);

  const created = await response.json().catch(() => null);
  const productId = created?.id || created?._id || created?.data?.id || created?.data?._id;
  if (productId) {
    await apiRequest(page, token, "DELETE", `/product/${productId}`);
  }
});
