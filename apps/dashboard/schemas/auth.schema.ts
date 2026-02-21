import z from "zod";

const login = z.object({
  email: z.email("Email Tidak Valid"),
  password: z.string(),
});

export const AUTH_SCHEMA = { login };
