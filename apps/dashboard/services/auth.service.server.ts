import { http } from "@/lib/http";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
	const cookie = await cookies();

	const { data } = await http.get<ApiResponse<User>>("/api/auth/me", {
		headers: {
			cookie: cookie.toString(),
		},
	});
	return data;
};
