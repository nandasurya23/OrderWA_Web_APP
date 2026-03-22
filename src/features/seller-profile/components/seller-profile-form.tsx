"use client";

import { useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SellerPlanBadge } from "@/components/shared/seller-plan-badge";
import {
  Field,
  FieldControl,
  FieldError,
  FieldHint,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError } from "@/lib/api/api-client";
import { useSellerProfile } from "@/features/seller-profile/hooks/use-seller-profile";
import {
  sellerProfileSchema,
  type SellerProfileFormValues,
} from "@/features/seller-profile/schemas/seller-profile.schema";

export function SellerProfileForm() {
  const { errorMessage, isLoading, isSaving, profile, refresh, saveProfile } =
    useSellerProfile();
  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileSchema),
    mode: "onChange",
    defaultValues: {
      sellerName: "",
      email: "",
      storeName: "",
      destinationPhoneNumber: "",
      storeDescription: "",
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      sellerName: profile.sellerName,
      email: profile.email,
      storeName: profile.storeName,
      destinationPhoneNumber: profile.destinationPhoneNumber,
      storeDescription: profile.storeDescription,
    });
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveProfile(sellerProfileSchema.parse(values));
      toast.success("Profil seller berhasil disimpan");
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.fieldErrors?.email) {
          setError("email", { message: error.fieldErrors.email });
        }

        toast.error(error.message);
        return;
      }

      toast.error("Gagal menyimpan profil seller");
    }
  });

  if (isLoading) {
    return (
      <Card className="space-y-4 rounded-[2rem]">
        <div className="flex items-center gap-3">
          <LoaderCircle
            aria-hidden="true"
            className="h-5 w-5 animate-spin text-[var(--accent)]"
          />
          <p className="text-sm text-[var(--foreground-muted)]">
            Sedang memuat profil seller...
          </p>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="space-y-5 rounded-[2rem]">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
            Profil seller belum tersedia
          </h2>
          <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            {errorMessage ??
              "Profil tidak bisa dimuat sekarang. Coba muat ulang halaman ini."}
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refresh()}>
          Coba Lagi
        </Button>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-3">
        <Button type="submit" form="seller-profile-form" size="default" disabled={!isValid || !isDirty}>
          Aksi Utama: Simpan Profil
        </Button>
        <Button href="/seller/setup" size="default" variant="secondary">
          Buka Setup Form
        </Button>
        <Button href="/seller" size="default" variant="ghost">
          Lihat Dashboard
        </Button>
      </div>

      <Card className="space-y-4 rounded-[1.8rem]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              Plan Saat Ini
            </p>
            <div className="mt-2">
              <SellerPlanBadge />
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[2rem]">
      <form id="seller-profile-form" className="space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
            Profil Seller
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
            Lengkapi identitas toko kamu
          </h2>
          <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            Data ini dipakai untuk login seller, pengaturan toko, dan nomor
            WhatsApp tujuan pada link form customer.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sellerName">Nama seller</FieldLabel>
              <FieldControl>
                <Input id="sellerName" {...register("sellerName")} />
              </FieldControl>
              {errors.sellerName ? <FieldError>{errors.sellerName.message}</FieldError> : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldControl>
                <Input
                  id="email"
                  autoComplete="email"
                  {...register("email")}
                />
              </FieldControl>
              {errors.email ? <FieldError>{errors.email.message}</FieldError> : null}
            </Field>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="storeName">Nama toko</FieldLabel>
              <FieldControl>
                <Input id="storeName" {...register("storeName")} />
              </FieldControl>
              {errors.storeName ? <FieldError>{errors.storeName.message}</FieldError> : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="destinationPhoneNumber">Nomor WhatsApp tujuan</FieldLabel>
              <FieldControl>
                <Input
                  id="destinationPhoneNumber"
                  inputMode="tel"
                  placeholder="Contoh: 08123456789"
                  {...register("destinationPhoneNumber")}
                />
              </FieldControl>
              {errors.destinationPhoneNumber ? (
                <FieldError>{errors.destinationPhoneNumber.message}</FieldError>
              ) : (
                <FieldHint>
                  Nomor ini akan dipakai customer saat membuka WhatsApp seller.
                </FieldHint>
              )}
            </Field>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="storeSlug">Public store slug</FieldLabel>
            <FieldControl>
              <Input id="storeSlug" readOnly value={profile.storeSlug} />
            </FieldControl>
            <FieldHint>
              Link customer:{" "}
              <Link
                href={`/konfirmasi-pesanan/${profile.storeSlug}`}
                className="break-all font-semibold text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
              >
                /konfirmasi-pesanan/{profile.storeSlug}
              </Link>
            </FieldHint>
          </Field>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
          <Field>
            <FieldLabel htmlFor="storeDescription">Deskripsi toko singkat</FieldLabel>
            <FieldControl>
              <Textarea
                id="storeDescription"
                className="min-h-28"
                placeholder="Ceritakan singkat jenis produk atau layanan toko kamu"
                {...register("storeDescription")}
              />
            </FieldControl>
            {errors.storeDescription ? (
              <FieldError>{errors.storeDescription.message}</FieldError>
            ) : (
              <FieldHint>Boleh dikosongkan kalau belum perlu.</FieldHint>
            )}
          </Field>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(244,247,251,0.9)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="large"
            disabled={!isValid || !isDirty}
            isLoading={isSaving}
            loadingText="Sedang menyimpan..."
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            Simpan Profil
          </Button>
          <p className="max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
            {errorMessage
              ? errorMessage
              : "Pastikan nomor WhatsApp tujuan aktif karena akan dipakai customer saat mengirim order."}
          </p>
        </div>
      </form>
      </Card>
    </section>
  );
}
