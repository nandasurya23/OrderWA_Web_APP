import { NextResponse } from "next/server";

import { HttpError } from "@/server/http/errors";
import type { RequestContext } from "@/server/http/request-context";

type ErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string | undefined>;
    meta?: Record<string, unknown>;
    requestId?: string;
  };
};

function withRequestIdHeader(response: NextResponse, requestId?: string) {
  if (requestId) {
    response.headers.set("x-request-id", requestId);
  }

  return response;
}

export function ok<T>(data: T, status = 200, context?: RequestContext) {
  const response = NextResponse.json(data, { status });
  return withRequestIdHeader(response, context?.requestId);
}

export function toErrorResponse(error: unknown, context?: RequestContext) {
  if (error instanceof HttpError) {
    const body: ErrorBody = {
      error: {
        code: error.code,
        requestId: context?.requestId,
        message: error.message,
        fieldErrors: error.fieldErrors,
        meta: error.meta,
      },
    };

    const response = NextResponse.json(body, { status: error.status });

    if (error.code === "RATE_LIMITED") {
      const retryAfterRaw = error.fieldErrors?.retryAfterSeconds;

      if (retryAfterRaw) {
        response.headers.set("retry-after", retryAfterRaw);
      }
    }

    return withRequestIdHeader(response, context?.requestId);
  }

  const response = NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        requestId: context?.requestId,
        message: "Terjadi kesalahan pada server.",
      },
    } satisfies ErrorBody,
    { status: 500 },
  );

  return withRequestIdHeader(response, context?.requestId);
}
