"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, SlidersHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldControl,
  FieldHint,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  applyMessageStyleTemplate,
  MESSAGE_STYLE_OPTIONS,
  type MessageStyleOption,
} from "@/features/seller-order-builder/lib/message-style-templates";
import {
  applyTemplateStarter,
  TEMPLATE_STARTER_CATEGORIES,
  type TemplateStarterCategory,
} from "@/features/seller-order-builder/lib/template-starters";
import {
  getFieldLabelById,
  resolveOrderedFieldIds,
} from "@/features/shared-order/lib/field-order";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

type SellerConfigSettingsProps = {
  config: SellerOrderConfig;
  destinationPhoneNumber: string;
  onChange: (config: SellerOrderConfig) => void;
};

type ToggleFieldProps = {
  checked: boolean;
  description: string;
  label: string;
  name: keyof Pick<
    SellerOrderConfig,
    "showPhoneNumber" | "showAddress" | "showNote"
  >;
  onChange: (name: ToggleFieldProps["name"], checked: boolean) => void;
};

function ToggleField({ checked, description, label, name, onChange }: ToggleFieldProps) {
  return (
    <Checkbox
      aria-label={label}
      checked={checked}
      description={description}
      label={label}
      onChange={(event) => onChange(name, event.target.checked)}
    />
  );
}

export function SellerConfigSettings({
  config,
  destinationPhoneNumber,
  onChange,
}: SellerConfigSettingsProps) {
  const [selectedMessageStyle, setSelectedMessageStyle] =
    useState<MessageStyleOption>("ringkas");
  const [selectedStarterCategory, setSelectedStarterCategory] =
    useState<TemplateStarterCategory>("food");

  function createFieldId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `cf_${crypto.randomUUID()}`;
    }

    return `cf_${Date.now().toString(36)}`;
  }

  function handleTextChange(
    key: keyof Pick<
      SellerOrderConfig,
      "closingText" | "openingText"
    >,
    value: string,
  ) {
    onChange({
      ...config,
      [key]: value,
    });
  }

  function handleToggleChange(
    key: ToggleFieldProps["name"],
    value: boolean,
  ) {
    onChange({
      ...config,
      [key]: value,
    });
  }

  function handleAddCustomField() {
    const fieldId = createFieldId();
    onChange({
      ...config,
      customFields: [
        ...config.customFields,
        {
          id: fieldId,
          type: "text",
          required: false,
          label: "Field baru",
          placeholder: "",
        },
      ],
      fieldOrder: [...config.fieldOrder, `custom:${fieldId}`],
    });
  }

  function handleCustomFieldChange(
    fieldId: string,
    key: "label" | "placeholder" | "required" | "type",
    value: string | boolean,
  ) {
    onChange({
      ...config,
      customFields: config.customFields.map((field) =>
        field.id === fieldId ? { ...field, [key]: value } : field,
      ),
    });
  }

  function handleRemoveCustomField(fieldId: string) {
    onChange({
      ...config,
      customFields: config.customFields.filter((field) => field.id !== fieldId),
      fieldOrder: config.fieldOrder.filter((item) => item !== `custom:${fieldId}`),
    });
  }

  function moveFieldOrder(fieldId: string, direction: "up" | "down") {
    const ordered = resolveOrderedFieldIds(config);
    const currentIndex = ordered.findIndex((item) => item === fieldId);

    if (currentIndex < 0) {
      return;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= ordered.length) {
      return;
    }

    const next = [...ordered];
    const temp = next[currentIndex];
    next[currentIndex] = next[nextIndex];
    next[nextIndex] = temp;

    onChange({
      ...config,
      fieldOrder: next,
    });
  }

  function handleApplyStarter() {
    onChange(applyTemplateStarter(config, selectedStarterCategory));
  }

  function handleApplyMessageStyle() {
    onChange(applyMessageStyleTemplate(config, selectedMessageStyle));
  }

  const messageStyleOptions = MESSAGE_STYLE_OPTIONS.map((style) => ({
    label: style,
    value: style,
  }));
  const starterCategoryOptions = TEMPLATE_STARTER_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  }));
  const customFieldTypeOptions = [
    { label: "Text", value: "text" as const },
    { label: "Textarea", value: "textarea" as const },
  ];

  return (
    <Card className="space-y-8 rounded-[2rem]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
            <SlidersHorizontal
              aria-hidden="true"
              className="h-5 w-5 text-[var(--accent)]"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
              Pengaturan
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
              Atur isi pesan order
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
          Ubah sapaan, penutup, dan field yang ingin ditampilkan di form
          customer. Nomor WhatsApp tujuan diambil dari profil seller.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">Style Pesan</p>
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
              Pakai template pembuka dan penutup sesuai tone pesan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Field className="flex-1">
              <FieldLabel htmlFor="messageStyle">Pilih style</FieldLabel>
              <FieldControl>
                <Select
                  id="messageStyle"
                  ariaLabel="Pilih style pesan"
                  options={messageStyleOptions}
                  value={selectedMessageStyle}
                  onChange={(value) => setSelectedMessageStyle(value)}
                />
              </FieldControl>
            </Field>
            <Button onClick={handleApplyMessageStyle} size="default" variant="secondary" className="w-full sm:w-auto">
              Terapkan Style
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">Template Starter</p>
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
              Pilih kategori bisnis untuk pakai saran field dan teks pembuka/penutup.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Field className="flex-1">
              <FieldLabel htmlFor="starterCategory">Kategori bisnis</FieldLabel>
              <FieldControl>
                <Select
                  id="starterCategory"
                  ariaLabel="Pilih kategori bisnis"
                  options={starterCategoryOptions}
                  value={selectedStarterCategory}
                  onChange={(value) => setSelectedStarterCategory(value)}
                />
              </FieldControl>
            </Field>
            <Button onClick={handleApplyStarter} size="default" variant="secondary" className="w-full sm:w-auto">
              Terapkan Starter
            </Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="space-y-5">
            <Field>
              <FieldLabel htmlFor="openingText">Teks pembuka</FieldLabel>
              <FieldControl>
                <Input
                  id="openingText"
                  maxLength={120}
                  onChange={(event) =>
                    handleTextChange("openingText", event.target.value)
                  }
                  placeholder="Contoh: Halo kak, saya mau order:"
                  value={config.openingText}
                />
              </FieldControl>
            </Field>
            <Field>
              <FieldLabel htmlFor="closingText">Teks penutup</FieldLabel>
              <FieldControl>
                <Input
                  id="closingText"
                  maxLength={140}
                  onChange={(event) =>
                    handleTextChange("closingText", event.target.value)
                  }
                  placeholder="Contoh: Mohon diproses ya kak. Terima kasih."
                  value={config.closingText}
                />
              </FieldControl>
            </Field>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="destinationPhoneNumber">Nomor WhatsApp tujuan</FieldLabel>
            <FieldControl>
              <Input
                id="destinationPhoneNumber"
                readOnly
                value={destinationPhoneNumber}
                placeholder="Isi dulu di halaman profil seller"
              />
            </FieldControl>
            <FieldHint>
              Nomor ini diambil dari{" "}
              <Link
                href="/seller/profile"
                className="font-semibold text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
              >
                profil seller
              </Link>
              .
            </FieldHint>
          </Field>
        </div>

        <div className="space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <ToggleField
            checked={config.showPhoneNumber}
            description="Tampilkan kolom nomor HP di form dan hasil pesan."
            label="Tampilkan nomor HP"
            name="showPhoneNumber"
            onChange={handleToggleChange}
          />
          <ToggleField
            checked={config.showAddress}
            description="Tampilkan kolom alamat di form dan hasil pesan."
            label="Tampilkan alamat"
            name="showAddress"
            onChange={handleToggleChange}
          />
          <ToggleField
            checked={config.showNote}
            description="Tampilkan kolom catatan di form dan hasil pesan."
            label="Tampilkan catatan"
            name="showNote"
            onChange={handleToggleChange}
          />
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">Urutan Field Form</p>
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
              Atur urutan field dengan tombol atas dan bawah.
            </p>
          </div>
          <div className="space-y-2">
            {resolveOrderedFieldIds(config).map((fieldId, index, all) => (
              <div
                key={fieldId}
                className="flex items-center justify-between gap-2 rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              >
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">
                  {getFieldLabelById(config, fieldId)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled={index === 0}
                    onClick={() => moveFieldOrder(fieldId, "up")}
                    aria-label={`Naikkan urutan ${getFieldLabelById(config, fieldId)}`}
                  >
                    <ChevronUp aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled={index === all.length - 1}
                    onClick={() => moveFieldOrder(fieldId, "down")}
                    aria-label={`Turunkan urutan ${getFieldLabelById(config, fieldId)}`}
                  >
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Field Kustom</p>
              <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                Tambah field text atau textarea sederhana untuk kebutuhan form.
              </p>
            </div>
            <Button
              onClick={handleAddCustomField}
              size="default"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={config.customFields.length >= 10}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Tambah Field
            </Button>
          </div>
          {config.customFields.length >= 10 ? (
            <p className="text-sm text-[var(--foreground-muted)]">
              Maksimal 10 field kustom.
            </p>
          ) : null}

          {config.customFields.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">
              Belum ada field kustom.
            </p>
          ) : (
            <div className="space-y-4">
              {config.customFields.map((field) => (
                <div
                  key={field.id}
                  className="space-y-4 rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor={`field-label-${field.id}`}>Label</FieldLabel>
                      <FieldControl>
                        <Input
                          id={`field-label-${field.id}`}
                          maxLength={60}
                          value={field.label}
                          onChange={(event) =>
                            handleCustomFieldChange(field.id, "label", event.target.value)
                          }
                        />
                      </FieldControl>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`field-type-${field.id}`}>Tipe field</FieldLabel>
                      <FieldControl>
                        <Select
                          id={`field-type-${field.id}`}
                          ariaLabel={`Pilih tipe field untuk ${field.label}`}
                          options={customFieldTypeOptions}
                          value={field.type}
                          onChange={(value) => handleCustomFieldChange(field.id, "type", value)}
                        />
                      </FieldControl>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor={`field-placeholder-${field.id}`}>Placeholder</FieldLabel>
                    <FieldControl>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={`field-placeholder-${field.id}`}
                          className="min-h-24"
                          maxLength={120}
                          value={field.placeholder}
                          onChange={(event) =>
                            handleCustomFieldChange(
                              field.id,
                              "placeholder",
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <Input
                          id={`field-placeholder-${field.id}`}
                          maxLength={120}
                          value={field.placeholder}
                          onChange={(event) =>
                            handleCustomFieldChange(
                              field.id,
                              "placeholder",
                              event.target.value,
                            )
                          }
                        />
                      )}
                    </FieldControl>
                  </Field>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Checkbox
                      aria-label={`Wajib diisi ${field.label}`}
                      checked={field.required}
                      description="Field ini wajib diisi customer."
                      label="Required"
                      onChange={(event) =>
                        handleCustomFieldChange(field.id, "required", event.target.checked)
                      }
                    />
                    <Button
                      onClick={() => handleRemoveCustomField(field.id)}
                      size="default"
                      variant="ghost"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
