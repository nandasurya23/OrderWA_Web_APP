import type { SellerCustomField, SellerOrderConfig } from "@/features/shared-order/types/order.types";

export const TEMPLATE_STARTER_CATEGORIES = [
  "food",
  "fashion",
  "service",
  "preorder",
] as const;

export type TemplateStarterCategory = (typeof TEMPLATE_STARTER_CATEGORIES)[number];

type TemplateStarterRule = {
  openingText: string;
  closingText: string;
  customFields: SellerCustomField[];
};

const STARTER_RULES: Record<TemplateStarterCategory, TemplateStarterRule> = {
  food: {
    openingText: "Halo kak, saya mau pesan menu berikut:",
    closingText: "Mohon diproses ya kak. Terima kasih.",
    customFields: [
      {
        id: "starter-food-variant",
        type: "text",
        required: true,
        label: "Varian / rasa",
        placeholder: "Contoh: Pedas level 2",
      },
      {
        id: "starter-food-delivery-note",
        type: "textarea",
        required: false,
        label: "Catatan pengantaran",
        placeholder: "Contoh: Titip di satpam",
      },
    ],
  },
  fashion: {
    openingText: "Halo kak, saya mau order produk fashion berikut:",
    closingText: "Mohon konfirmasi stok dan proses ordernya ya. Terima kasih.",
    customFields: [
      {
        id: "starter-fashion-size",
        type: "text",
        required: true,
        label: "Ukuran",
        placeholder: "Contoh: M / 30 / 39",
      },
      {
        id: "starter-fashion-color",
        type: "text",
        required: true,
        label: "Warna",
        placeholder: "Contoh: Hitam",
      },
    ],
  },
  service: {
    openingText: "Halo kak, saya ingin booking layanan berikut:",
    closingText: "Mohon info jadwal yang tersedia ya. Terima kasih.",
    customFields: [
      {
        id: "starter-service-schedule",
        type: "text",
        required: true,
        label: "Jadwal diinginkan",
        placeholder: "Contoh: Senin, 10.00",
      },
      {
        id: "starter-service-details",
        type: "textarea",
        required: false,
        label: "Detail kebutuhan",
        placeholder: "Tulis kebutuhan layanan secara singkat",
      },
    ],
  },
  preorder: {
    openingText: "Halo kak, saya mau ikut preorder:",
    closingText: "Mohon dicatat untuk batch preorder berikutnya. Terima kasih.",
    customFields: [
      {
        id: "starter-preorder-batch",
        type: "text",
        required: true,
        label: "Batch preorder",
        placeholder: "Contoh: Batch 3",
      },
      {
        id: "starter-preorder-note",
        type: "textarea",
        required: false,
        label: "Catatan preorder",
        placeholder: "Contoh: Siap tunggu hingga estimasi kirim",
      },
    ],
  },
};

export function applyTemplateStarter(
  config: SellerOrderConfig,
  category: TemplateStarterCategory,
): SellerOrderConfig {
  const starter = STARTER_RULES[category];

  return {
    ...config,
    openingText: starter.openingText,
    closingText: starter.closingText,
    customFields: starter.customFields,
    fieldOrder: [],
  };
}
