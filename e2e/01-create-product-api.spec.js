// Product creation — API level.
//
// Validates the full backend path an admin uses when saving a product:
// login -> pick a real category + tax -> POST /product -> product appears in
// the list -> cleanup. This is the stable half of the product-create gate;
// the UI flow lives in 02-create-product-ui.spec.js.

const { test, expect } = require("@playwright/test");
const { adminLogin, apiRequest } = require("./helpers/auth");

test("admin can create (and delete) a product via the API", async ({ page }) => {
  const { token } = await adminLogin(page);

  // Use real seeded references — a category and the IVA tax.
  const catRes = await apiRequest(page, token, "GET", "/category?status=1");
  expect(catRes.ok()).toBeTruthy();
  const catBody = await catRes.json();
  const categories = catBody?.data || catBody;
  expect(categories.length).toBeGreaterThan(0);
  const categoryId = categories[0].id || categories[0]._id;

  const taxRes = await apiRequest(page, token, "GET", "/tax?status=1");
  expect(taxRes.ok()).toBeTruthy();
  const taxBody = await taxRes.json();
  const taxes = taxBody?.data || taxBody;
  expect(taxes.length).toBeGreaterThan(0);
  const taxId = taxes[0].id || taxes[0]._id;

  const name = `E2E Producto ${Date.now()}`;
  const createRes = await apiRequest(page, token, "POST", "/product", {
    name,
    short_description: "Producto creado por la suite e2e",
    description: "<p>Descripción de prueba del producto e2e.</p>",
    product_type: "physical",
    type: "simple",
    stock_status: "in_stock",
    sku: `E2E-${Date.now()}`,
    quantity: 10,
    price: 99900,
    discount: 0,
    categories: [categoryId],
    tax_id: taxId,
    status: 1,
  });
  expect([200, 201]).toContain(createRes.status());
  const created = await createRes.json();
  const productId = created.id || created._id || created?.data?.id || created?.data?._id;
  expect(productId).toBeTruthy();

  // It must show up in the product list.
  const listRes = await apiRequest(page, token, "GET", `/product?search=${encodeURIComponent(name)}`);
  expect(listRes.ok()).toBeTruthy();
  const listBody = await listRes.json();
  const listStr = JSON.stringify(listBody);
  expect(listStr).toContain(name);

  // Cleanup so repeated runs stay tidy.
  const delRes = await apiRequest(page, token, "DELETE", `/product/${productId}`);
  expect([200, 204]).toContain(delRes.status());
});
