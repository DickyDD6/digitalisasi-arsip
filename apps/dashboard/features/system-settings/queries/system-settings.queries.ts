import { queryOptions } from "@tanstack/react-query";
import { systemSettingsService } from "../services/system-settings.service";

export const systemSettingsQueries = {
  all: ["system-settings"] as const,
  settings: () =>
    queryOptions({
      queryKey: [...systemSettingsQueries.all, "config"],
      queryFn: () => systemSettingsService.getSettings(),
      staleTime: 1000 * 60 * 5,
    }),
};
