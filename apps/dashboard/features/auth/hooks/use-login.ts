"use client";

import { useAuth } from "./use-auth";

export const useLogin = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  return { mutateAsync: login, isPending: isLoggingIn, error: loginError };
};
