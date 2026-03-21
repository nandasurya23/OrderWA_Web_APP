import { z } from "zod";

import {
  isValidWhatsAppPhoneNumber,
  normalizePhoneNumber,
} from "@/features/shared-order/lib/normalize-phone-number";

export const sellerProfileSchema = z.object({
  sellerName: z.string().trim().min(2, "Nama seller minimal 2 karakter"),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Masukkan email yang valid"),
  storeName: z.string().trim().min(2, "Nama toko minimal 2 karakter"),
  destinationPhoneNumber: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi")
    .transform((value) => normalizePhoneNumber(value))
    .refine(
      (value) => isValidWhatsAppPhoneNumber(value),
      "Masukkan nomor WhatsApp yang valid",
    ),
  storeDescription: z
    .string()
    .trim()
    .max(180, "Deskripsi singkat maksimal 180 karakter")
    .optional()
    .transform((value) => value ?? ""),
});

export type SellerProfileFormValues = z.input<typeof sellerProfileSchema>;
export type SellerProfileValues = z.output<typeof sellerProfileSchema>;
