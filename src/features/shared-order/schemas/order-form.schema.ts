import { z } from "zod";

import { isValidWhatsAppPhoneNumber } from "@/features/shared-order/lib/normalize-phone-number";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const optionalPhoneNumber = optionalTrimmedString.refine(
  (value) => !value || isValidWhatsAppPhoneNumber(value),
  "Nomor belum valid.",
);

export function createOrderFormSchema(config: SellerOrderConfig) {
  return z.object({
    customerName: z
      .string()
      .trim()
      .min(2, "Nama customer minimal 2 karakter."),
    phoneNumber: config.showPhoneNumber ? optionalPhoneNumber : z.undefined().optional(),
    productName: z.string().trim().min(2, "Nama produk minimal 2 karakter."),
    quantity: z.coerce
      .number({
        error: "Jumlah harus berupa angka.",
      })
      .int("Jumlah harus bilangan bulat.")
      .positive("Jumlah harus lebih dari 0."),
    address: config.showAddress
      ? z.string().trim().min(5, "Alamat minimal 5 karakter.")
      : optionalTrimmedString,
    note: config.showNote ? optionalTrimmedString : z.undefined().optional(),
  });
}
