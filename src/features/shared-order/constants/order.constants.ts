import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

export const FREE_WATERMARK_TEXT = "(dibuat dengan OrderWA)";
export const SELLER_ORDER_CONFIG_STORAGE_KEY = "orderwa-seller-order-config";

export const DEFAULT_SELLER_ORDER_CONFIG: SellerOrderConfig = {
  openingText: "Halo kak, saya mau order:",
  closingText: "Mohon diproses ya kak. Terima kasih 🙏",
  showPhoneNumber: true,
  showAddress: true,
  showNote: true,
  destinationPhoneNumber: "",
};

export const SELLER_PREVIEW_VALUES = {
  customerName: "Surya",
  phoneNumber: "08123456789",
  productName: "Kaos Hitam",
  quantity: 2,
  address: "Denpasar",
  note: "Kirim sore",
};
