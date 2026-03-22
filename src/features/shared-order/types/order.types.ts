import type { z } from "zod";

import type { createOrderFormSchema } from "@/features/shared-order/schemas/order-form.schema";

export type SellerCustomField = {
  id: string;
  type: "text" | "textarea";
  required: boolean;
  label: string;
  placeholder: string;
};

export type SellerOrderConfig = {
  openingText: string;
  closingText: string;
  showPhoneNumber: boolean;
  showAddress: boolean;
  showNote: boolean;
  customFields: SellerCustomField[];
  fieldOrder: string[];
  destinationPhoneNumber: string;
};

export type OrderFormSchema = ReturnType<typeof createOrderFormSchema>;
export type OrderFormInputValues = z.input<OrderFormSchema>;
export type OrderFormValues = z.output<OrderFormSchema>;
