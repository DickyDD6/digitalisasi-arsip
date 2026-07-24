import { queryOptions } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export const userQueries = {
  list: (params?: UserParams) =>
    queryOptions({
      queryKey: ["users", "list", params],
      queryFn: () => userService.getUsers(params),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["users", "detail", id],
      queryFn: () => userService.getUserById(id),
      enabled: !!id,
    }),

  statistics: () =>
    queryOptions({
      queryKey: ["users", "statistics"],
      queryFn: () => userService.getUsersStatistic(),
    }),
};
