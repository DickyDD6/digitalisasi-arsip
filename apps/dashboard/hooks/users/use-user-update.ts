"use client";

import { USER_SERVICE } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserUpdate = (id: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: Partial<UserSchema>) =>
			await USER_SERVICE.updateUser(id, payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});
};
