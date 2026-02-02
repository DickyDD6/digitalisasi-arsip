import { http } from "@/shared/lib";
import { ApiResponse } from "@/shared/types";
import { User } from ".";

export const getAllUsers = async (params?: {
	page?: number;
	per_page?: number;
}): Promise<ApiResponse<User[]>> => {
	try {
		const { data } = await http.get<ApiResponse<User[]>>("/api/users", {
			params,
		});
		return data;
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
		throw error;
	}
};

export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
	try {
		const { data } = await http.get<ApiResponse<User>>(`/api/users/${id}`);
		return data;
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
		throw error;
	}
};
