import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_PROD_URL || "http://localhost:5000";
const ACCESS_COOKIE = "uat";
const REFRESH_COOKIE = "urt";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

// Session helpers - shared with the admin's login pages so token storage
// stays consistent.
export function saveSession(payload = {}) {
  const at = payload.access_token || payload.token;
  const rt = payload.refresh_token;
  if (at) Cookies.set(ACCESS_COOKIE, at, { path: "/", expires: 7 });
  if (rt) Cookies.set(REFRESH_COOKIE, rt, { path: "/", expires: 30 });
}
export function clearSession() {
  Cookies.remove(ACCESS_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_COOKIE, { path: "/" });
  if (typeof window !== "undefined") {
    try { localStorage.removeItem("account"); } catch {}
  }
}

// One in-flight refresh promise so a burst of 401s only produces one refresh
// call, not one per request.
let refreshInFlight = null;

async function doRefresh() {
  if (refreshInFlight) return refreshInFlight;
  const rt = Cookies.get(REFRESH_COOKIE);
  if (!rt) return null;
  refreshInFlight = (async () => {
    try {
      const res = await axios.post(`${BASE_URL}/refresh`, { refresh_token: rt });
      saveSession(res?.data || {});
      return (res?.data?.access_token || res?.data?.token) || null;
    } catch {
      clearSession();
      return null;
    } finally {
      setTimeout(() => { refreshInFlight = null; }, 0);
    }
  })();
  return refreshInFlight;
}

// Attach the access token on every outgoing request.
client.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_COOKIE);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh-on-401 - retry the original request once with a fresh access token.
client.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error?.config || {};
    const status = error?.response?.status;
    const url = String(original.url || "");
    const isAuthCall = /\/(login|register|refresh|logout)(\?|$)/.test(url);

    if (status === 401 && !original._retried && !isAuthCall && Cookies.get(REFRESH_COOKIE)) {
      original._retried = true;
      const newAccess = await doRefresh();
      if (newAccess) {
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return client(original);
      }
    }
    return Promise.reject(error);
  }
);

// Public request(): same signature admin code has been using, plus a redirect
// to /auth/login when the refresh dance ultimately fails.
const request = async ({ ...options }, router) => {
  try {
    return await client(options);
  } catch (error) {
    if (error?.response?.status === 401) {
      clearSession();
      Cookies.remove("ue");
      Cookies.remove("account");
      router && router.push("/auth/login");
    }
    throw error;
  }
};

export default request;
