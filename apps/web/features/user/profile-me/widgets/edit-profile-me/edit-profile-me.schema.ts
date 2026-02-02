import z from "zod";

export const EditProfileMeSchema = z.object({
	fullname: z.string().refine((val) => val.trim(), {
		error: "Silahkan Masukkan Nama Lengkap Anda.",
	}),
	email: z.email().refine((val) => val.trim(), {
		error: "Silahkan Masukkan Email Anda.",
	}),
	phone: z.string().refine((val) => val.trim(), {
		error: "Silahkan Masukkan Nomor Telepon Anda.",
	}),
	department: z.string().refine((val) => val.trim(), {
		error: "Silahkan Masukkan Prodi Anda.",
	}),
});
