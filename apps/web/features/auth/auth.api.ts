import { http } from "@/shared/lib";
import { LoginRequest, LoginResponse } from "./auth.types";
import { ApiResponse } from "@/shared/types";

const getCsrfToken = async (): Promise<void> => {
	try {
		await http.get("/sanctum/csrf-cookie");
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
	}
};

export const login = async (
	payload: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
	try {
		await getCsrfToken();

		const { data } = await http.post<ApiResponse<LoginResponse>>(
			"/api/auth/login",
			payload,
		);

		return data;
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
		throw error;
	}
};

export const logout = async (): Promise<ApiResponse> => {
	try {
		const { data } = await http.post<ApiResponse>("/api/auth/logout");

		return data;
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
		throw error;
	}
};
