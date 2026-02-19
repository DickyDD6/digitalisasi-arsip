import { ApiResponse } from "@/shared/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getAllUsers, getUserById, User } from ".";

export const useGetAllUsers = (
	params?: { page?: number; per_page?: number },
	opts?: UseQueryOptions<ApiResponse<User[]>>,
) =>
	useQuery({
		queryKey: ["users", params],
		queryFn: async () => await getAllUsers(params),
		...opts,
	});

export const useGetUserById = (
	id: number,
	opts?: UseQueryOptions<ApiResponse<User>>,
) =>
	useQuery({
		queryKey: ["user", id],
		queryFn: async () => await getUserById(id),
		enabled: !!id,
		...opts,
	});
