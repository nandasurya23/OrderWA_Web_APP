import { FREE_WATERMARK_TEXT } from "@/features/shared-order/constants/order.constants";
import { resolveOrderedFieldIds } from "@/features/shared-order/lib/field-order";
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
  const fieldLines = resolveOrderedFieldIds(config)
    .map((fieldId) => {
      if (fieldId === "customerName") {
        return `Nama: ${values.customerName.trim()}`;
      }

      if (fieldId === "productName") {
        return `Produk: ${values.productName.trim()}`;
      }

      if (fieldId === "quantity") {
        return `Jumlah: ${values.quantity} pcs`;
      }

      if (fieldId === "phoneNumber" && values.phoneNumber) {
        return `No. HP: ${values.phoneNumber.trim()}`;
      }

      if (fieldId === "address" && values.address) {
        return `Alamat: ${values.address.trim()}`;
      }

      if (fieldId === "note" && values.note) {
        return `Catatan: ${values.note.trim()}`;
      }

      if (fieldId.startsWith("custom:")) {
        const customId = fieldId.replace("custom:", "");
        const customField = config.customFields.find((field) => field.id === customId);
        const customValue = values.customFields?.[customId];

        if (!customField || !customValue) {
          return null;
        }

        return `${customField.label.trim()}: ${customValue.trim()}`;
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
