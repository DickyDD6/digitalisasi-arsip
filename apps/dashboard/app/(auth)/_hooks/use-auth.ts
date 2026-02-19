"use client";

import { getCsrfToken } from "@/lib/csrf";
import { http } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  LoginErrorDataResponse,
  LoginErrorsResponse,
  LoginRequest,
  LoginResponse,
} from "../_lib/types";

export const useAuth = () => {
  const queryClient = useQueryClient();

  return {
    login: useMutation<
      AxiosResponse<ApiResponse<LoginResponse>>,
      AxiosError<ApiError<LoginErrorsResponse, LoginErrorDataResponse>>,
      { payload: LoginRequest }
    >({
      mutationFn: async ({ payload }) => {
        await getCsrfToken();
        return await http.post<ApiResponse<LoginResponse>>(
          "/api/auth/login",
          payload,
        );
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      },
    }),
    logout: useMutation<AxiosResponse<ApiResponse>, AxiosError<ApiError>>({
      mutationFn: async () => await http.post<ApiResponse>("/api/auth/logout"),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      },
    }),
  };
};
