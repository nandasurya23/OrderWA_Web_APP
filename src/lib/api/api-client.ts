export type FieldErrorMap = Record<string, string | undefined>;

export class ApiClientError extends Error {
  code?: string;
  status: number;
  fieldErrors?: FieldErrorMap;
  meta?: Record<string, unknown>;

  constructor(
    message: string,
    options?: {
      code?: string;
      fieldErrors?: FieldErrorMap;
      meta?: Record<string, unknown>;
      status?: number;
    },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = options?.code;
    this.status = options?.status ?? 400;
    this.fieldErrors = options?.fieldErrors;
    this.meta = options?.meta;
  }
}

type ApiErrorPayload = {
  error?: {
    code?: string;
    fieldErrors?: FieldErrorMap;
    message?: string;
    meta?: Record<string, unknown>;
  };
};

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  const fallbackMessage = "Terjadi kesalahan pada server.";

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    throw new ApiClientError(payload.error?.message ?? fallbackMessage, {
      code: payload.error?.code,
      fieldErrors: payload.error?.fieldErrors,
      meta: payload.error?.meta,
      status: response.status,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(fallbackMessage, {
      status: response.status,
    });
  }
}
