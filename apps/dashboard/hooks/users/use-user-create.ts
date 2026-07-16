"use client";

import { USER_SERVICE } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: USER_SERVICE.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
