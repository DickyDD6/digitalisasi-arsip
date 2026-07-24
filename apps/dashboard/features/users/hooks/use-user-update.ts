"use client";

import { userService } from "../services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserUpdate = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<UserSchema>) =>
      await userService.updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
