"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
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
import { loginSeller } from "@/features/auth/api/auth-api";
import {
  type LoginFormValues,
  loginSchema,
} from "@/features/auth/schemas/login.schema";

type LoginFormProps = {
  nextPath?: string;
  mode?: "seller" | "admin";
};

export function LoginForm({ nextPath, mode = "seller" }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const redirectPath =
    nextPath && nextPath.startsWith("/")
      ? nextPath
      : mode === "admin"
      ? "/admin"
      : "/seller/setup";
  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const payload = await loginSeller(values, {
        expectedRole: mode === "admin" ? "ADMIN" : "SELLER",
      });
      toast.success("Berhasil masuk");
      const nextRedirect =
        nextPath && nextPath.startsWith("/")
          ? nextPath
          : payload.redirectPath && payload.redirectPath.startsWith("/")
          ? payload.redirectPath
          : redirectPath;
      router.push(nextRedirect);
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

      setSubmitError("Gagal masuk. Coba lagi.");
      toast.error("Gagal masuk. Coba lagi.");
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
          {mode === "admin" ? "Masuk ke workspace admin" : "Masuk ke workspace seller"}
        </h2>
        <p className="max-w-[42ch] text-sm leading-7 text-[var(--foreground-muted)]">
          {mode === "admin"
            ? "Gunakan akun admin untuk akses review request upgrade dan kontrol admin."
            : "Gunakan email dan kata sandi yang sudah terdaftar untuk lanjut ke setup."}
        </p>
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
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
            {mode === "seller" ? (
              <Link
                href="/auth/register"
                className="text-sm text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--accent)]"
              >
                Buat akun baru
              </Link>
            ) : null}
          </div>
          <FieldControl>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Minimal 6 karakter"
              {...register("password")}
            />
          </FieldControl>
          {errors.password ? <FieldError>{errors.password.message}</FieldError> : null}
        </Field>
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
        loadingText="Sedang masuk..."
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        {mode === "admin" ? "Masuk ke Admin" : "Masuk ke Dashboard"}
      </Button>
    </form>
  );
}
