const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API } = require("./helpers/auth");

/**
 * Pedidos: estado del pago y estado del pedido son independientes.
 *  - Los filtros "estado del pedido" y "Mercado Pago — Pagados" se combinan
 *    en la misma consulta (status + payment_method/payment_status).
 *  - El selector de estado solo ofrece el siguiente paso permitido y el API
 *    rechaza cualquier salto (422) sin tocar el pago.
 */

const authHeaders = async (page) => {
  const token = (await page.context().cookies()).find((c) => c.name === "uat")?.value;
  return { Authorization: `Bearer ${token}` };
};

test.describe("Pedidos — flujo de estados", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("los filtros de pedido y de pago viajan juntos al API", async ({ page }) => {
    const calls = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/\/order\?/.test(url) && !/\/order\/[^?]/.test(url)) calls.push(new URL(url));
    });
    await page.goto("/order?status=processing&payment=mercadopago_paid");
    await page.waitForTimeout(3000);

    const combined = calls.find((u) => u.searchParams.get("status") === "processing" && u.searchParams.get("payment_status") === "completed");
    expect(combined, "una sola consulta con ambos filtros").toBeTruthy();
    expect(combined.searchParams.get("payment_method")).toBe("mercadopago");

    // Ambas pestañas quedan activas a la vez.
    await expect(page.locator(".order-filter-group").nth(0).locator("li.active")).toContainText(/Procesando|Processing/i);
    await expect(page.locator(".order-filter-group").nth(1).locator("li.active")).toContainText(/Mercado Pago/i);
    // La tabla muestra el estado del pedido y el del pago como columnas distintas.
    await expect(page.locator("th", { hasText: /Estado del pedido|Order Status/i })).toBeVisible();
    await expect(page.locator("th", { hasText: /Estado de Pago|Payment Status/i })).toBeVisible();
  });

  test("el API rechaza saltos de estado y el selector solo ofrece el siguiente paso", async ({ page }) => {
    const headers = await authHeaders(page);
    const statuses = (await (await page.request.get(`${BASE_API}/orderStatus`)).json()).data || [];
    // Sin catálogo de estados (OrderStatus vacío) no hay flujo que probar:
    // sembrar el API (npm run seed:e2e) o crear los estados desde el admin.
    if (statuses.length < 5) test.skip(true, "El API no tiene el catálogo de estados de pedido");
    const bySlug = Object.fromEntries(statuses.map((s) => [s.slug, s]));

    // Un pedido que aún admite cambios (processing o shipped).
    let order = null;
    for (const slug of ["processing", "shipped"]) {
      const res = await page.request.get(`${BASE_API}/order?status=${slug}&paginate=1`, { headers });
      const body = await res.json();
      if (body?.data?.length) { order = body.data[0]; break; }
    }
    if (!order) test.skip(true, "No hay pedidos en processing/shipped en este entorno");

    const detail = await (await page.request.get(`${BASE_API}/order/${order.id}`, { headers })).json();
    const allowed = detail.allowed_next_statuses.map((s) => s.slug);
    expect(allowed.length).toBeGreaterThan(0);

    // Salto prohibido: cualquier estado que no esté permitido ni sea el actual.
    const current = detail.order_status.slug;
    const forbidden = ["delivered", "processing", "out_for_delivery"].find((s) => s !== current && !allowed.includes(s));
    const jump = await page.request.put(`${BASE_API}/order/${order.id}`, { headers, data: { order_status_id: bySlug[forbidden].id } });
    expect(jump.status()).toBe(422);
    const jumpBody = await jump.json();
    expect(jumpBody.allowed_next_statuses).toEqual(allowed);

    // Ni el estado del pedido ni el del pago cambiaron.
    const after = await (await page.request.get(`${BASE_API}/order/${order.id}`, { headers })).json();
    expect(after.order_status.slug).toBe(current);
    expect(after.payment_status).toBe(detail.payment_status);

    // En el admin, el selector solo lista los permitidos.
    await page.goto(`/order/details/${order.order_number}`);
    await page.waitForTimeout(3000);
    const select = page.locator(".title-header .custom-select-box").first();
    if (!(await select.count())) test.skip(true, "Selector de estado no visible (permisos)");
    await select.locator(".category-select-box").click({ force: true });
    await page.waitForTimeout(500);
    const optionTexts = (await select.locator(".box-content.open ul li").allTextContents()).map((s) => s.trim().toLowerCase()).filter(Boolean);
    const allowedNames = allowed.map((slug) => bySlug[slug].name.toLowerCase());
    for (const name of allowedNames) expect(optionTexts.some((o) => o.includes(name.replace(/_/g, " ")))).toBe(true);
    const forbiddenName = bySlug[forbidden].name.toLowerCase();
    expect(optionTexts.some((o) => o.includes(forbiddenName))).toBe(false);
  });
});
