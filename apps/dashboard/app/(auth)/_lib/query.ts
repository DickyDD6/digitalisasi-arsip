import { http } from "@/lib/http";
import { queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const me = queryOptions({
  queryKey: ["current-user"],
  queryFn: async () => {
    try {
      const { data } = await http.get<ApiResponse<User>>("/api/auth/me");

      return data;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err?.response?.status === 401) {
          return null;
        }

        if (process.env.NODE_ENV !== "production") {
          console.error("Auth check error:", err?.message || err);
        }
      }
    }
  },
});
