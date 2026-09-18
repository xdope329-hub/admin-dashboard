// Brand deletion — row trash icon + bulk "Delete" button.
//
// Covers the fix where TableWrapper now wires a real delete mutation into
// ShowTable/Options/DeleteButton, and TableDeleteOption implements the bulk
// delete that used to be an empty stub. Requires admin dashboard on :3000
// and the seeded API on :5000.

const { test, expect } = require("@playwright/test");
const { loginViaAPI, apiRequest } = require("./helpers/auth");

async function createBrand(page, token, name) {
  const res = await apiRequest(page, token, "POST", "/brand", { name, status: 1 });
  expect([200, 201]).toContain(res.status());
  const body = await res.json();
  const id = body.id || body._id;
  expect(id).toBeTruthy();
  return id;
}

async function brandExists(page, token, name) {
  const res = await apiRequest(page, token, "GET", `/brand?search=${encodeURIComponent(name)}`);
  const body = await res.json();
  return JSON.stringify(body?.data || body).includes(name);
}

test.describe("brand deletion", () => {
  test("row trash icon deletes a brand", async ({ page }) => {
    test.setTimeout(90000);
    const { token } = await loginViaAPI(page);
    const name = `E2E Marca Row ${Date.now()}`;
    const id = await createBrand(page, token, name);

    await page.goto("/brand", { waitUntil: "networkidle" });
    await page.fill(".role-search input", name);
    const row = page.locator("tbody tr", { hasText: name });
    await expect(row).toHaveCount(1, { timeout: 15000 });

    await row.locator(".custom-ul a").last().click(); // trash icon
    await page.locator(".modal .btn-theme", { hasText: /Yes|Sí/i }).click();

    await expect(page.locator("tbody tr", { hasText: name })).toHaveCount(0, { timeout: 15000 });
    expect(await brandExists(page, token, name)).toBe(false);

    // Safety cleanup in case of failure
    await apiRequest(page, token, "DELETE", `/brand/${id}`).catch(() => {});
  });

  test("bulk Delete button deletes selected brands", async ({ page }) => {
    test.setTimeout(90000);
    const { token } = await loginViaAPI(page);
    const stamp = Date.now();
    const nameA = `E2E Marca Bulk A ${stamp}`;
    const nameB = `E2E Marca Bulk B ${stamp}`;
    const idA = await createBrand(page, token, nameA);
    const idB = await createBrand(page, token, nameB);

    await page.goto("/brand", { waitUntil: "networkidle" });
    await page.fill(".role-search input", `E2E Marca Bulk`);
    await expect(page.locator("tbody tr", { hasText: `${stamp}` })).toHaveCount(2, { timeout: 15000 });

    for (const name of [nameA, nameB]) {
      await page.locator("tbody tr", { hasText: name }).locator('td input[type="checkbox"]').check();
    }
    await page.locator(".show-box a.btn", { hasText: /Delete|Borrar/i }).click();
    await page.locator(".modal .btn-theme", { hasText: /Yes|Sí/i }).click();

    await expect(page.locator("tbody tr", { hasText: `${stamp}` })).toHaveCount(0, { timeout: 20000 });
    expect(await brandExists(page, token, nameA)).toBe(false);
    expect(await brandExists(page, token, nameB)).toBe(false);

    await apiRequest(page, token, "DELETE", `/brand/${idA}`).catch(() => {});
    await apiRequest(page, token, "DELETE", `/brand/${idB}`).catch(() => {});
  });
});
