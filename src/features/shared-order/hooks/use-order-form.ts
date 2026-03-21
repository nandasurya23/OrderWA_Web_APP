"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { createOrderFormSchema } from "@/features/shared-order/schemas/order-form.schema";
import type {
  OrderFormInputValues,
  OrderFormValues,
  SellerOrderConfig,
} from "@/features/shared-order/types/order.types";

export function useOrderForm(
  config: SellerOrderConfig,
): UseFormReturn<OrderFormInputValues, unknown, OrderFormValues> {
  const schema = useMemo(() => createOrderFormSchema(config), [config]);
  const defaultValues = useMemo<OrderFormInputValues>(
    () => ({
      customerName: "",
      phoneNumber: "",
      productName: "",
      quantity: 1,
      address: "",
      note: "",
    }),
    [],
  );

  return useForm<OrderFormInputValues, unknown, OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });
}
