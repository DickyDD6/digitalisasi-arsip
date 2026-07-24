import { http } from "@/lib/http";
import { AuthUser, LoginCredentials, LoginResponse } from "../types/auth.types";

export const authService = {
  async csrfCookie(): Promise<void> {
    await http.get("/sanctum/csrf-cookie");
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.csrfCookie();
    const res = await http.post<LoginResponse>("/api/auth/login", credentials);
    return res.data;
  },

  async logout(): Promise<{ message: string }> {
    try {
      const res = await http.post<{ message: string }>("/api/auth/logout");
      return res.data;
    } catch {
      return { message: "Logged out" };
    }
  },

  async me(): Promise<AuthUser | null> {
    try {
      const res = await http.get<{ data: AuthUser }>("/api/auth/me");
      return res.data?.data ?? (res.data as any)?.user ?? null;
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 419) {
        return null;
      }
      throw err;
    }
  },
};
