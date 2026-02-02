import { ROLE, USER_STATUS } from "@/shared/constants";
import z from "zod";

export const UserTableEditFormSchema = z.object({
	name: z.string().refine((val) => val.trim(), {
		message: "Nama wajib diisi",
	}),
	email: z.email().refine((val) => val.trim(), {
		message: "Email wajib diisi",
	}),
	password: z.string().refine((val) => val.trim(), {
		message: "Password wajib diisi",
	}),
	nip: z.string().refine((val) => val.trim(), {
		message: "NIP wajib diisi",
	}),
	role: z.enum(ROLE).refine((val) => val.trim(), {
		message: "Role wajib diisi",
	}),
	user_status: z.enum(USER_STATUS).refine((val) => val.trim(), {
		message: "Status wajib diisi",
	}),
});
