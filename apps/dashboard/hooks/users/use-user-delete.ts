"use client";

import { USER_SERVICE } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserDelete = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: USER_SERVICE.deleteUser,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["users", "table"] }),
	});
};
