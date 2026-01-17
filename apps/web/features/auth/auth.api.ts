import { http } from "@/shared/lib";
import { LoginRequest, LoginResponse } from "./auth.types";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
	const { data, status } = await http.post("/user/login", payload);

	if (status !== 200) throw new Error("LogIn Failed!");

	return {
		id: data.id,
		username: data.username,
		// role adapter, karna sekarang pakai dummyjson jadi saya konversi manual disini
		// role uploader belum ada karna di dummyjson hanya ada 3 role yaitu admin, moderator dan user
		// TODO: sesuaikan dengan backend jika backend restful api sudah ready
		role:
			data.role === "admin"
				? "MANAGER"
				: data.role === "moderator"
					? "QC"
					: "SBAP",
		accessToken: data.accessToken,
	};
};
