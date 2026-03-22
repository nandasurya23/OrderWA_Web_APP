import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

export const MESSAGE_STYLE_OPTIONS = ["ringkas", "formal", "santai"] as const;

export type MessageStyleOption = (typeof MESSAGE_STYLE_OPTIONS)[number];

type MessageStyleTemplate = {
  openingText: string;
  closingText: string;
};

const MESSAGE_STYLE_TEMPLATES: Record<MessageStyleOption, MessageStyleTemplate> = {
  ringkas: {
    openingText: "Halo kak, saya mau order:",
    closingText: "Mohon diproses ya. Terima kasih.",
  },
  formal: {
    openingText: "Halo, saya ingin melakukan pemesanan sebagai berikut:",
    closingText: "Mohon bantu diproses. Terima kasih atas bantuannya.",
  },
  santai: {
    openingText: "Halo kak, aku mau pesen ini ya:",
    closingText: "Siap ditunggu kabarnya. Makasih kak.",
  },
};

export function applyMessageStyleTemplate(
  config: SellerOrderConfig,
  style: MessageStyleOption,
): SellerOrderConfig {
  const template = MESSAGE_STYLE_TEMPLATES[style];

  return {
    ...config,
    openingText: template.openingText,
    closingText: template.closingText,
  };
}
