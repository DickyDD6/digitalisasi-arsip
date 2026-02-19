import z from "zod";
import { LoginRequest } from "./auth.types";

export const LoginSchema: z.ZodType<LoginRequest, LoginRequest> = z.object({
	email: z
		.email()
		.refine((val) => val.trim(), { error: "Silahkan Masukkan Email Anda." }),
	password: z
		.string()
		.min(8, "Password harus berisi minimal 8 karakter.")
		.refine((val) => val.trim(), { error: "Silahkan Masukkan Password Anda." }),
});
