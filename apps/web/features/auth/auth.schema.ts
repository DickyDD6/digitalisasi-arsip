import z from "zod";
import { LoginRequest } from "./auth.types";

export const LoginSchema: z.ZodType<LoginRequest, LoginRequest> = z.object({
	username: z
		.string()
		.refine((val) => val.trim(), { error: "Silahkan Masukkan Username Anda." }),
	password: z
		.string()
		.min(8, "Password harus berisi minimal 8 karakter.")
		.refine((val) => val.trim(), { error: "Silahkan Masukkan Password Anda." }),
});
