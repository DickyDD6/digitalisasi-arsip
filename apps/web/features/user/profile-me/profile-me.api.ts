import { http } from "@/shared/lib";
import { ApiResponse } from "@/shared/types";
import { EditProfileMe } from "./widgets/edit-profile-me/edit-profile-me.types";

export const getProfileMe = async (): Promise<ApiResponse<EditProfileMe>> => {
	try {
		const { data } = await http.get<ApiResponse<EditProfileMe>>("/api/auth/me");

		return data;
	} catch (error) {
		process.env.NODE_ENV !== "production" && console.error(error);
		throw error;
	}
};
