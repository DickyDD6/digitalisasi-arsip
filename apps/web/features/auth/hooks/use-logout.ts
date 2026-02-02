"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { logout } from "@/features/auth";
import { toast } from "sonner";

export const useLogout = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: logout,
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: ["current-user"] });
			toast.success(data.message ?? "Logout successful");
			router.replace("/login");
		},
	});
};
