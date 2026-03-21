"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiClientError } from "@/lib/api/api-client";
import { registerSeller } from "@/features/auth/api/auth-api";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/features/auth/schemas/register.schema";

type RegisterFormProps = {
  nextPath?: string;
};

export function RegisterForm({ nextPath }: RegisterFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const redirectPath =
    nextPath && nextPath.startsWith("/") ? nextPath : "/seller/profile";
  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      sellerName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await registerSeller({
        sellerName: values.sellerName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Akun seller berhasil dibuat");
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.fieldErrors?.email) {
          setError("email", { message: error.fieldErrors.email });
        }

        setSubmitError(error.message);
        toast.error(error.message);
        return;
      }

      setSubmitError("Gagal membuat akun. Coba lagi.");
      toast.error("Gagal membuat akun. Coba lagi.");
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
          Daftarkan akun seller
        </h2>
        <p className="max-w-[44ch] text-sm leading-7 text-[var(--foreground-muted)]">
          Setelah akun dibuat, kamu bisa lanjut ke profile dan setup flow order.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
        <Field>
          <FieldLabel htmlFor="sellerName">Nama seller</FieldLabel>
          <FieldControl>
            <Input
              id="sellerName"
              placeholder="Contoh: Surya"
              autoComplete="name"
              {...register("sellerName")}
            />
          </FieldControl>
          {errors.sellerName ? <FieldError>{errors.sellerName.message}</FieldError> : null}
        </Field>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldControl>
            <Input
              id="email"
              placeholder="nama@tokomu.com"
              autoComplete="email"
              {...register("email")}
            />
          </FieldControl>
          {errors.email ? <FieldError>{errors.email.message}</FieldError> : null}
        </Field>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
            <FieldControl>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                {...register("password")}
              />
            </FieldControl>
            {errors.password ? <FieldError>{errors.password.message}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Ulangi kata sandi</FieldLabel>
            <FieldControl>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                {...register("confirmPassword")}
              />
            </FieldControl>
            {errors.confirmPassword ? (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            ) : null}
          </Field>
        </div>
      </div>

      {submitError ? (
        <div className="rounded-[1.2rem] border border-[var(--danger)] bg-[var(--danger-muted)] px-4 py-3 text-sm leading-6 text-[var(--danger)]">
          {submitError}
        </div>
      ) : null}

      <Button
        size="large"
        type="submit"
        className="w-full"
        disabled={!isValid}
        isLoading={isSubmitting}
        loadingText="Sedang membuat akun..."
      >
        <UserPlus aria-hidden="true" className="h-4 w-4" />
        Buat Akun
      </Button>
    </form>
  );
}
