"use client";

import { USER_SERVICE } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserDeleteMultiple = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: USER_SERVICE.deleteUserMultiple,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", "table"] }),
  });
};
