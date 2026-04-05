import { ROLE } from "@/constants/role";
import z from "zod";

const user = z.object({
  name: z.string().min(1, "Nama pengguna wajib diisi"),
  email: z.email("Email tidak valid"),
  role: z.enum(
    Object.values(ROLE).filter((role) => role !== ROLE.MANAGER),
    {
      error: () => ({ message: "Role wajib dipilih" }),
    },
  ),
  nip: z.string(),
  password: z.string(),
});

export const USER_SCHEMA = { user };
