"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { isAxiosError } from "axios";
import { ApiError } from "@/shared/types";
import { login } from "@/features/auth";

export const useLogin = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: login,
		mutationKey: ["auth-login"],
		onSuccess: async (data) => {
			toast.success(data.message ?? "Login successful");
			await queryClient.invalidateQueries({ queryKey: ["current-user"] });
			router.replace("/dashboard");
		},
		onError: (error) => {
			if (isAxiosError<ApiError>(error))
				toast.error(error.response?.data.message ?? "An error occurred");
		},
	});
};
