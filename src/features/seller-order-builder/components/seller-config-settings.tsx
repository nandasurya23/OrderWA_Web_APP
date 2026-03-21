"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldControl,
  FieldHint,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
      </div>
    </Card>
  );
}
