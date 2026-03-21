import type { FieldErrorMap } from "@/lib/api/api-client";

export class HttpError extends Error {
  code: string;
  fieldErrors?: FieldErrorMap;
  meta?: Record<string, unknown>;
  status: number;

  constructor(
    message: string,
    options: {
      code: string;
      fieldErrors?: FieldErrorMap;
      meta?: Record<string, unknown>;
      status: number;
    },
  ) {
    super(message);
    this.name = "HttpError";
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
    this.meta = options.meta;
    this.status = options.status;
  }
}
