"use client";

import { userService } from "../services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
