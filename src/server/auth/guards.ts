import type { NextRequest } from "next/server";

import { HttpError } from "@/server/http/errors";
import { getSessionSellerId } from "@/server/auth/session";

export async function requireSellerSession(request: NextRequest) {
  const sellerId = await getSessionSellerId(request);

  if (!sellerId) {
    throw new HttpError("Sesi login sudah berakhir", {
      code: "AUTH_REQUIRED",
      status: 401,
    });
  }

  return sellerId;
}
