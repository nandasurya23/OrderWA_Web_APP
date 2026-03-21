import { describe, expect, it } from "vitest";

import { ApiClientError, parseApiResponse } from "@/lib/api/api-client";

describe("parseApiResponse", () => {
  it("maps backend error meta into ApiClientError.meta", async () => {
    const response = new Response(
      JSON.stringify({
        error: {
          code: "PLAN_LIMIT_REACHED",
          message: "Free plan hanya bisa membuat 1 link tiap 24 jam.",
          meta: {
            nextAvailableAt: "2026-03-23T00:00:00.000Z",
          },
        },
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 409,
      },
    );

    let thrown: unknown;

    try {
      await parseApiResponse(response);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(ApiClientError);
    expect((thrown as ApiClientError).code).toBe("PLAN_LIMIT_REACHED");
    expect((thrown as ApiClientError).meta?.nextAvailableAt).toBe(
      "2026-03-23T00:00:00.000Z",
    );
  });
});
