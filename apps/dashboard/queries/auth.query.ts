import { AUTH_SERVICE } from "@/services/auth.service";
import { queryOptions } from "@tanstack/react-query";

const userMeQuery = (cookie?: string) =>
  queryOptions({
    queryKey: ["current", "user"],
    queryFn: async () => await AUTH_SERVICE.getCurrentUser(cookie),
  });

export const AUTH_QUERY = { userMeQuery };
