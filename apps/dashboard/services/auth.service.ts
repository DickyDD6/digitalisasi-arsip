import { http } from "@/lib/http";

const login = async (payload: LoginRequest) => {
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

const getCurrentUser = async () => {
  const { data } = await http.get<ApiResponse<User>>("/api/auth/me");
  return data;
};

export const AUTH_SERVICE = { login, logout, getCurrentUser };
