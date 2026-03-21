import { describe, expect, it } from "vitest";

import { HttpError } from "@/server/http/errors";
import { toErrorResponse } from "@/server/http/response";

describe("toErrorResponse", () => {
  it("includes meta in HttpError payload", async () => {
    const response = toErrorResponse(
      new HttpError("Plan limit reached", {
        code: "PLAN_LIMIT_REACHED",
        meta: {
          nextAvailableAt: "2026-03-23T00:00:00.000Z",
        },
        status: 409,
      }),
      {
        ip: "127.0.0.1",
        method: "POST",
        path: "/api/seller/order-links",
        requestId: "req-123",
        userAgent: "test",
      },
    );
    const payload = await response.json();

    expect(payload.error.code).toBe("PLAN_LIMIT_REACHED");
    expect(payload.error.meta.nextAvailableAt).toBe("2026-03-23T00:00:00.000Z");
    expect(payload.error.requestId).toBe("req-123");
  });
});
