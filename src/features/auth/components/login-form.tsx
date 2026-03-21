"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
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
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const redirectPath =
    nextPath && nextPath.startsWith("/") ? nextPath : "/seller/setup";
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
    try {
      await loginSeller(values);
      toast.success("Berhasil masuk");
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.fieldErrors?.email) {
          setError("email", { message: error.fieldErrors.email });
        }

        toast.error(error.message);
        return;
      }

      toast.error("Gagal masuk. Coba lagi.");
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
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
            <Link
              href="/auth/register"
              className="text-sm text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--accent)]"
            >
              Belum punya akun?
            </Link>
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

      <Button
        size="large"
        type="submit"
        className="w-full"
        disabled={!isValid}
        isLoading={isSubmitting}
        loadingText="Sedang masuk..."
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        Masuk
      </Button>
    </form>
  );
}
