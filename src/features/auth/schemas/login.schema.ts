import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Masukkan email yang valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
