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

const currentUser = async () => {
  const { data } = await http.get<ApiResponse<User>>("/api/auth/me");
  return data;
};

export const AUTH_SERVICE = { login, logout, currentUser };
