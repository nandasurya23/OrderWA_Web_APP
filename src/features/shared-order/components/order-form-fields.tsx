"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  NotebookPen,
  Package,
  Phone,
  User,
} from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeIn } from "@/lib/motion";
import { resolveOrderedFieldIds } from "@/features/shared-order/lib/field-order";
import type {
  OrderFormInputValues,
  SellerOrderConfig,
} from "@/features/shared-order/types/order.types";

type OrderFormFieldsProps = {
  config: SellerOrderConfig;
  errors: FieldErrors<OrderFormInputValues>;
  register: UseFormRegister<OrderFormInputValues>;
};

function AnimatedFieldError({ message }: Readonly<{ message?: string }>) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={fadeIn.transition}
          className="text-sm leading-6 text-[var(--danger)]"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export function OrderFormFields({
  config,
  errors,
  register,
}: OrderFormFieldsProps) {
  function renderCustomField(customFieldId: string) {
    const customField = config.customFields.find((field) => field.id === customFieldId);

    if (!customField) {
      return null;
    }

    const customFieldErrors =
      (errors.customFields as Record<string, { message?: string } | undefined> | undefined) ?? {};
    const fieldError = customFieldErrors[customField.id];

    return (
      <div
        key={`custom:${customField.id}`}
        className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5"
      >
        <Field>
          <FieldLabel htmlFor={`custom-${customField.id}`}>
            {customField.label}
            {customField.required ? " *" : ""}
          </FieldLabel>
          <FieldControl>
            {customField.type === "textarea" ? (
              <Textarea
                id={`custom-${customField.id}`}
                placeholder={customField.placeholder}
                {...register(`customFields.${customField.id}` as const)}
              />
            ) : (
              <Input
                id={`custom-${customField.id}`}
                placeholder={customField.placeholder}
                {...register(`customFields.${customField.id}` as const)}
              />
            )}
          </FieldControl>
          <AnimatedFieldError message={fieldError?.message} />
        </Field>
      </div>
    );
  }

  function renderBuiltInField(fieldId: string) {
    if (fieldId === "customerName") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="customerName">Nama</FieldLabel>
            <FieldControl>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
                />
                <Input
                  id="customerName"
                  className="pl-11"
                  placeholder="Contoh: Surya"
                  {...register("customerName")}
                />
              </div>
            </FieldControl>
            <AnimatedFieldError message={errors.customerName?.message} />
          </Field>
        </div>
      );
    }

    if (fieldId === "productName") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="productName">Nama produk</FieldLabel>
            <FieldControl>
              <div className="relative">
                <Package
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
                />
                <Input
                  id="productName"
                  className="pl-11"
                  placeholder="Contoh: Kaos Hitam"
                  {...register("productName")}
                />
              </div>
            </FieldControl>
            <AnimatedFieldError message={errors.productName?.message} />
          </Field>
        </div>
      );
    }

    if (fieldId === "quantity") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="quantity">Jumlah</FieldLabel>
            <FieldControl>
              <Input
                id="quantity"
                inputMode="numeric"
                placeholder="Contoh: 2"
                {...register("quantity")}
              />
            </FieldControl>
            <AnimatedFieldError message={errors.quantity?.message} />
          </Field>
        </div>
      );
    }

    if (fieldId === "phoneNumber") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="phoneNumber">Nomor HP</FieldLabel>
            <FieldControl>
              <div className="relative">
                <Phone
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
                />
                <Input
                  id="phoneNumber"
                  className="pl-11"
                  inputMode="tel"
                  placeholder="08123456789"
                  {...register("phoneNumber")}
                />
              </div>
            </FieldControl>
            <AnimatedFieldError message={errors.phoneNumber?.message} />
          </Field>
        </div>
      );
    }

    if (fieldId === "address") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="address">Alamat</FieldLabel>
            <FieldControl>
              <div className="relative">
                <MapPin
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-5 h-4 w-4 text-[var(--foreground-muted)]"
                />
                <Textarea
                  id="address"
                  className="pl-11"
                  placeholder="Tulis alamat lengkap"
                  {...register("address")}
                />
              </div>
            </FieldControl>
            <AnimatedFieldError message={errors.address?.message} />
          </Field>
        </div>
      );
    }

    if (fieldId === "note") {
      return (
        <div key={fieldId} className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="note">Catatan</FieldLabel>
            <FieldControl>
              <div className="relative">
                <NotebookPen
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-5 h-4 w-4 text-[var(--foreground-muted)]"
                />
                <Textarea
                  id="note"
                  className="min-h-28 pl-11"
                  placeholder="Tambahan untuk seller, jika perlu"
                  {...register("note")}
                />
              </div>
            </FieldControl>
            <AnimatedFieldError message={errors.note?.message} />
          </Field>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="space-y-6">
      {resolveOrderedFieldIds(config).map((fieldId) =>
        fieldId.startsWith("custom:")
          ? renderCustomField(fieldId.replace("custom:", ""))
          : renderBuiltInField(fieldId),
      )}
    </div>
  );
}
