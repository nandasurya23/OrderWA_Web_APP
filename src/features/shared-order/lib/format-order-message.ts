import { FREE_WATERMARK_TEXT } from "@/features/shared-order/constants/order.constants";
import { resolveOrderedFields } from "@/features/shared-order/lib/field-order";
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
  const fieldLines = resolveOrderedFields(config)
    .map((field) => {
      if (field.kind === "custom") {
        const customValue = values.customFields?.[field.fieldId];

        if (!customValue) {
          return null;
        }

        return `${field.label.trim()}: ${customValue.trim()}`;
      }

      if (field.id === "customerName") {
        return `Nama: ${values.customerName.trim()}`;
      }

      if (field.id === "productName") {
        return `Produk: ${values.productName.trim()}`;
      }

      if (field.id === "quantity") {
        return `Jumlah: ${values.quantity} pcs`;
      }

      if (field.id === "phoneNumber" && values.phoneNumber) {
        return `No. HP: ${values.phoneNumber.trim()}`;
      }

      if (field.id === "address" && values.address) {
        return `Alamat: ${values.address.trim()}`;
      }

      if (field.id === "note" && values.note) {
        return `Catatan: ${values.note.trim()}`;
      }

      return null;
    })
    .filter((line): line is string => Boolean(line));

  const lines = [
    config.openingText.trim(),
    "",
    ...fieldLines,
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
