import { ROLE } from "@/constants";
import z from "zod";

export const addUserSchema = z.object({
  name: z.string().min(1, "Nama pengguna wajib diisi"),
  email: z.email("Email tidak valid"),
  role: z.union([
    z.string(),
    z.enum(
      Object.values(ROLE).filter((role) => role !== ROLE.MANAGER),
      {
        error: () => ({ message: "Role wajib dipilih" }),
      },
    ),
  ]),
  nip: z.string(),
  password: z.string(),
});
export const editUserSchema = addUserSchema.partial();

export type AddUserSchema = z.infer<typeof addUserSchema>;
export type EditUserSchema = z.infer<typeof editUserSchema>;

export const defaultValues: AddUserSchema | EditUserSchema = {
  name: "",
  email: "",
  role: "",
  nip: "",
  password: "",
};
