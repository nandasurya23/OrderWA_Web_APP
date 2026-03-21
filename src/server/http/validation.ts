import { z } from "zod";

import { HttpError } from "@/server/http/errors";

export function toValidationHttpError(error: z.ZodError) {
  return new HttpError("Data belum valid", {
    code: "VALIDATION_ERROR",
    fieldErrors: Object.fromEntries(
      error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
    ),
    status: 400,
  });
}
