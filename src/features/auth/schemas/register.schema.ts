import { z } from "zod";

export const registerSchema = z
  .object({
    sellerName: z.string().trim().min(2, "Nama seller minimal 2 karakter"),
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi")
      .email("Masukkan email yang valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Ulangi kata sandi kamu"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Kata sandi belum sama",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
