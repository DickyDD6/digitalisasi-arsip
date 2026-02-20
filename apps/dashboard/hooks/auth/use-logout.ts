"use client";

import { AUTH_SERVICE } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AUTH_SERVICE.logout,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["current", "user"] }),
	});
};
