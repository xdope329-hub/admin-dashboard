# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-orders-status-flow.spec.js >> Pedidos — flujo de estados >> el API rechaza saltos de estado y el selector solo ofrece el siguiente paso
- Location: e2e\04-orders-status-flow.spec.js:43:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  1  | const { test, expect } = require("@playwright/test");
  2  | const { loginViaAPI, BASE_API } = require("./helpers/auth");
  3  | 
  4  | /**
  5  |  * Pedidos: estado del pago y estado del pedido son independientes.
  6  |  *  - Los filtros "estado del pedido" y "Mercado Pago — Pagados" se combinan
  7  |  *    en la misma consulta (status + payment_method/payment_status).
  8  |  *  - El selector de estado solo ofrece el siguiente paso permitido y el API
  9  |  *    rechaza cualquier salto (422) sin tocar el pago.
  10 |  */
  11 | 
  12 | const authHeaders = async (page) => {
  13 |   const token = (await page.context().cookies()).find((c) => c.name === "uat")?.value;
  14 |   return { Authorization: `Bearer ${token}` };
  15 | };
  16 | 
  17 | test.describe("Pedidos — flujo de estados", () => {
  18 |   test.beforeEach(async ({ page }) => {
  19 |     await loginViaAPI(page);
  20 |   });
  21 | 
  22 |   test("los filtros de pedido y de pago viajan juntos al API", async ({ page }) => {
  23 |     const calls = [];
  24 |     page.on("request", (req) => {
  25 |       const url = req.url();
  26 |       if (/\/order\?/.test(url) && !/\/order\/[^?]/.test(url)) calls.push(new URL(url));
  27 |     });
  28 |     await page.goto("/order?status=processing&payment=mercadopago_paid");
  29 |     await page.waitForTimeout(3000);
  30 | 
  31 |     const combined = calls.find((u) => u.searchParams.get("status") === "processing" && u.searchParams.get("payment_status") === "completed");
  32 |     expect(combined, "una sola consulta con ambos filtros").toBeTruthy();
  33 |     expect(combined.searchParams.get("payment_method")).toBe("mercadopago");
  34 | 
  35 |     // Ambas pestañas quedan activas a la vez.
  36 |     await expect(page.locator(".order-filter-group").nth(0).locator("li.active")).toContainText(/Procesando|Processing/i);
  37 |     await expect(page.locator(".order-filter-group").nth(1).locator("li.active")).toContainText(/Mercado Pago/i);
  38 |     // La tabla muestra el estado del pedido y el del pago como columnas distintas.
  39 |     await expect(page.locator("th", { hasText: /Estado del pedido|Order Status/i })).toBeVisible();
  40 |     await expect(page.locator("th", { hasText: /Estado de Pago|Payment Status/i })).toBeVisible();
  41 |   });
  42 | 
  43 |   test("el API rechaza saltos de estado y el selector solo ofrece el siguiente paso", async ({ page }) => {
  44 |     const headers = await authHeaders(page);
  45 |     const statuses = (await (await page.request.get(`${BASE_API}/orderStatus`)).json()).data;
  46 |     const bySlug = Object.fromEntries(statuses.map((s) => [s.slug, s]));
  47 | 
  48 |     // Un pedido que aún admite cambios (processing o shipped).
  49 |     let order = null;
  50 |     for (const slug of ["processing", "shipped"]) {
  51 |       const res = await page.request.get(`${BASE_API}/order?status=${slug}&paginate=1`, { headers });
  52 |       const body = await res.json();
  53 |       if (body?.data?.length) { order = body.data[0]; break; }
  54 |     }
  55 |     if (!order) test.skip(true, "No hay pedidos en processing/shipped en este entorno");
  56 | 
  57 |     const detail = await (await page.request.get(`${BASE_API}/order/${order.id}`, { headers })).json();
  58 |     const allowed = detail.allowed_next_statuses.map((s) => s.slug);
> 59 |     expect(allowed.length).toBeGreaterThan(0);
     |                            ^ Error: expect(received).toBeGreaterThan(expected)
  60 | 
  61 |     // Salto prohibido: cualquier estado que no esté permitido ni sea el actual.
  62 |     const current = detail.order_status.slug;
  63 |     const forbidden = ["delivered", "processing", "out_for_delivery"].find((s) => s !== current && !allowed.includes(s));
  64 |     const jump = await page.request.put(`${BASE_API}/order/${order.id}`, { headers, data: { order_status_id: bySlug[forbidden].id } });
  65 |     expect(jump.status()).toBe(422);
  66 |     const jumpBody = await jump.json();
  67 |     expect(jumpBody.allowed_next_statuses).toEqual(allowed);
  68 | 
  69 |     // Ni el estado del pedido ni el del pago cambiaron.
  70 |     const after = await (await page.request.get(`${BASE_API}/order/${order.id}`, { headers })).json();
  71 |     expect(after.order_status.slug).toBe(current);
  72 |     expect(after.payment_status).toBe(detail.payment_status);
  73 | 
  74 |     // En el admin, el selector solo lista los permitidos.
  75 |     await page.goto(`/order/details/${order.order_number}`);
  76 |     await page.waitForTimeout(3000);
  77 |     const select = page.locator(".title-header .custom-select-box").first();
  78 |     if (!(await select.count())) test.skip(true, "Selector de estado no visible (permisos)");
  79 |     await select.locator(".category-select-box").click({ force: true });
  80 |     await page.waitForTimeout(500);
  81 |     const optionTexts = (await select.locator(".box-content.open ul li").allTextContents()).map((s) => s.trim().toLowerCase()).filter(Boolean);
  82 |     const allowedNames = allowed.map((slug) => bySlug[slug].name.toLowerCase());
  83 |     for (const name of allowedNames) expect(optionTexts.some((o) => o.includes(name.replace(/_/g, " ")))).toBe(true);
  84 |     const forbiddenName = bySlug[forbidden].name.toLowerCase();
  85 |     expect(optionTexts.some((o) => o.includes(forbiddenName))).toBe(false);
  86 |   });
  87 | });
  88 | 
```