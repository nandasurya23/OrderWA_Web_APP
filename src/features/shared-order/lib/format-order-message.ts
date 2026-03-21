import { FREE_WATERMARK_TEXT } from "@/features/shared-order/constants/order.constants";
import type {
  OrderFormValues,
  SellerOrderConfig,
} from "@/features/shared-order/types/order.types";

type FormatOrderMessageOptions = {
  config: SellerOrderConfig;
};

export function formatOrderMessage(
  values: OrderFormValues,
  options: FormatOrderMessageOptions,
) {
  const { config } = options;
  const lines = [
    config.openingText.trim(),
    "",
    `Nama: ${values.customerName.trim()}`,
    config.showPhoneNumber && values.phoneNumber
      ? `No. HP: ${values.phoneNumber.trim()}`
      : null,
    `Produk: ${values.productName.trim()}`,
    `Jumlah: ${values.quantity} pcs`,
    config.showAddress && values.address
      ? `Alamat: ${values.address.trim()}`
      : null,
    config.showNote && values.note ? `Catatan: ${values.note.trim()}` : null,
    "",
    config.closingText.trim(),
    "",
    FREE_WATERMARK_TEXT,
  ];

  return lines
    .filter((line) => line !== null && line !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
