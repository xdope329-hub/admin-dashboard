// Auth helpers for the admin-dashboard e2e suite.
//
// Requires the API running on BASE_API (default http://localhost:5000) with
// the seeded admin user (see xdopestore-api/seed/seed.js). Override with
// env vars if your credentials differ:
//   API_URL, ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_API = process.env.API_URL || "http://localhost:5000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@xdope.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

/**
 * Logs in through the API and returns { token, body }.
 */
async function adminLogin(page) {
  const res = await page.request.post(`${BASE_API}/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  if (!res.ok()) {
    throw new Error(
      `Admin login failed (${res.status()}). Is the API running on ${BASE_API} and seeded? (npm run seed in xdopestore-api)`
    );
  }
  const body = await res.json();
  const token = body.access_token || body.token;
  if (!token) throw new Error("Admin login response had no token");
  return { token, body };
}

/**
 * Logs in via API and injects the `uat` cookie so the admin app's middleware
 * treats the browser as authenticated.
 */
async function loginViaAPI(page) {
  const { token, body } = await adminLogin(page);
  await page.context().addCookies([
    {
      name: "uat",
      value: token,
      domain: "localhost",
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 86400,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  return { token, body };
}

/** Authenticated API request helper (for setup/teardown from specs). */
async function apiRequest(page, token, method, path, data) {
  const res = await page.request.fetch(`${BASE_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return res;
}

module.exports = { adminLogin, loginViaAPI, apiRequest, BASE_API, ADMIN_EMAIL, ADMIN_PASSWORD };
