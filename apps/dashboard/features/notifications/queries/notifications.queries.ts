import { queryOptions } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";

export const notificationQueries = {
  all: ["notifications"] as const,
  list: () =>
    queryOptions({
      queryKey: [...notificationQueries.all, "list"],
      queryFn: () => notificationsService.getNotifications(),
      staleTime: 1000 * 60 * 2,
    }),
};
