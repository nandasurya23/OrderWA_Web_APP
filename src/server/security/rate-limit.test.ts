import { NextRequest } from "next/server";
import { describe, expect, it, beforeEach } from "vitest";

import { HttpError } from "@/server/http/errors";
import { __resetRateLimitForTests, enforceRateLimit } from "@/server/security/rate-limit";

function createRequest(ip = "127.0.0.1") {
  return new NextRequest("http://localhost/api/auth/login", {
    headers: {
      "x-forwarded-for": ip,
    },
    method: "POST",
  });
}

describe("enforceRateLimit", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("allows requests under limit", () => {
    const request = createRequest();

    expect(() =>
      enforceRateLimit({
        key: "auth:login",
        limit: 2,
        request,
        windowMs: 60_000,
      }),
    ).not.toThrow();
  });

  it("throws HttpError 429 after limit exceeded", () => {
    const request = createRequest();

    enforceRateLimit({
      key: "auth:login",
      limit: 1,
      request,
      windowMs: 60_000,
    });

    let thrown: unknown;

    try {
      enforceRateLimit({
        key: "auth:login",
        limit: 1,
        request,
        windowMs: 60_000,
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(HttpError);
    expect((thrown as HttpError).status).toBe(429);
    expect((thrown as HttpError).code).toBe("RATE_LIMITED");
  });
});
