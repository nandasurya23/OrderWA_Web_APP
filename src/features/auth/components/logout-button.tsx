"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logoutSeller } from "@/features/auth/api/auth-api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutSeller();
      toast.success("Berhasil keluar");
      router.push("/auth/seller/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar. Coba lagi.");
    }
  }

  return (
    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => void handleLogout()}>
      <LogOut aria-hidden="true" className="h-4 w-4" />
      Keluar
    </Button>
  );
}
