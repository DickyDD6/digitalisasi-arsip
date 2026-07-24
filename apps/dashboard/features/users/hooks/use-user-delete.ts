"use client";

import { userService } from "../services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", "table"] }),
  });
};

export const useUserDeleteMultiple = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUserMultiple,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", "table"] }),
  });
};
