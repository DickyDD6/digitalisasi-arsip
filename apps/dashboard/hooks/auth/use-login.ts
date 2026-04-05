"use client";

import { AUTH_SERVICE } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AUTH_SERVICE.login,
    onSuccess: (res) => {
      console.log(res);
      const token = res.data.token;
      const user = res.data.user;

      if (token) {
        localStorage.setItem("token", String(token));
      }

      if (user) {
        queryClient.setQueryData(["current", "user"], user);
      }
    },
  });
};
