import { queryOptions } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const authQueries = {
  userMe: () =>
    queryOptions({
      queryKey: ["auth", "me"],
      queryFn: async () => {
        const user = await authService.me();
        return user ?? null;
      },
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
};
