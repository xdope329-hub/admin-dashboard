import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.API_PROD_URL || "http://localhost:5000",
  headers: {
    Accept: "application/json",
  },
});

const request = async ({ ...options }, router) => {
  client.defaults.headers.common.Authorization = `Bearer ${Cookies.get("uat") || ""}`;
  try {
    const response = await client(options);
    return response;
  } catch (error) {
    if (error?.response?.status == 401) {
      Cookies.remove("uat");
      Cookies.remove("ue");
      Cookies.remove("account");
      localStorage.clear();
      router && router.push("/auth/login");
    }
    throw error;
  }
};

export default request;
