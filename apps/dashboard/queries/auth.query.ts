import { AUTH_SERVICE } from "@/services/auth.service";
import { queryOptions } from "@tanstack/react-query";

const userMeQuery = () =>
  queryOptions({
    queryKey: ["current", "user"],
    queryFn: async () => await AUTH_SERVICE.getCurrentUser(),
  });

export const AUTH_QUERY = { userMeQuery };
