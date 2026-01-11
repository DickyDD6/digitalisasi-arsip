import z from "zod";

export const RejectArchiveSchema = z.object({
	note: z
		.string()
		.min(1, "Catatan Penolakan Wajib Diisi!")
		.max(500, "Catatan Terlalu Panjang."),
});

export type RejectArchiveInput = z.infer<typeof RejectArchiveSchema>;
