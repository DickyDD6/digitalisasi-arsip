import { getCsrfToken } from "@/lib/csrf";
import { http } from "@/lib/http";

const login = async (payload: LoginRequest) => {
  await getCsrfToken();

  const { data } = await http.post<ApiResponse<LoginResponse>>(
    "/api/auth/login",
    payload,
  );
  return data;
};

const logout = async () => {
  const { data } = await http.post<ApiResponse>("/api/auth/logout");
  return data;
};

const getCurrentUser = async (cookie?: string) => {
  const { data } = await http.get<ApiResponse<User>>("/api/auth/me", {
    headers: {
      Cookie: cookie,
    },
  });
  return data;
};

export const AUTH_SERVICE = { login, logout, getCurrentUser };
