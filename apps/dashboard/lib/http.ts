import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      delete http.defaults.headers.common.Authorization;

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("HTTP Error:", error);
    }

    return Promise.reject(error);
  },
);

http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});
