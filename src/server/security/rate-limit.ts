import type { NextRequest } from "next/server";

import { HttpError } from "@/server/http/errors";

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const bucket = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function cleanupIfNeeded(now: number) {
  if (bucket.size < 1000) {
    return;
  }

  for (const [key, value] of bucket.entries()) {
    if (value.expiresAt <= now) {
      bucket.delete(key);
    }
  }
}

export function enforceRateLimit(options: {
  key: string;
  limit: number;
  request: NextRequest;
  windowMs: number;
}) {
  const now = Date.now();
  cleanupIfNeeded(now);

  const clientIp = getClientIp(options.request);
  const identifier = `${options.key}:${clientIp}`;
  const current = bucket.get(identifier);

  if (!current || current.expiresAt <= now) {
    bucket.set(identifier, {
      count: 1,
      expiresAt: now + options.windowMs,
    });
    return;
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((current.expiresAt - now) / 1000);

    throw new HttpError("Terlalu banyak permintaan. Coba lagi sebentar.", {
      code: "RATE_LIMITED",
      fieldErrors: {
        retryAfterSeconds: String(Math.max(retryAfterSeconds, 1)),
      },
      status: 429,
    });
  }

  current.count += 1;
  bucket.set(identifier, current);
}

export function __resetRateLimitForTests() {
  bucket.clear();
}
