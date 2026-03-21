import { NextRequest } from "next/server";
import { z } from "zod";

import { requireSellerSession } from "@/server/auth/guards";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { enforceRateLimit } from "@/server/security/rate-limit";
import {
  createPublicOrderLinkWithSnapshot,
  getLatestPublicOrderLinkStatus,
} from "@/server/services/public-order-link.service";

const createOrderLinkSchema = z.object({
  snapshotConfig: z.object({
    openingText: z.string(),
    closingText: z.string(),
    showPhoneNumber: z.boolean(),
    showAddress: z.boolean(),
    showNote: z.boolean(),
    destinationPhoneNumber: z.string(),
  }).strict(),
}).strict();

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:order-links:status",
      limit: 60,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const status = await getLatestPublicOrderLinkStatus({
      origin: request.nextUrl.origin,
      sellerId,
    });

    return ok({ data: status }, 200, context);
  } catch (error) {
    return toErrorResponse(error, context);
  }
}

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:order-links:create",
      limit: 30,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const body = createOrderLinkSchema.parse(await request.json());
    const link = await createPublicOrderLinkWithSnapshot({
      origin: request.nextUrl.origin,
      sellerId,
      snapshotConfig: body.snapshotConfig,
    });

    logAuditEvent({
      action: "seller.order-link.created",
      metadata: {
        ip: context.ip,
        linkId: link.id,
      },
      requestId: context.requestId,
      sellerId,
    });

    return ok(
      {
        data: {
          createdAt: link.createdAt.toISOString(),
          expiresAt: link.expiresAt.toISOString(),
          id: link.id,
          isActive: link.isActive,
          url: link.url,
        },
      },
      201,
      context,
    );
  } catch (error) {
    if (!(error instanceof z.ZodError)) {
      logAuditEvent({
        action: "seller.order-link.create.failed",
        level: "warn",
        metadata: {
          ip: context.ip,
        },
        requestId: context.requestId,
      });
    }

    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), context);
    }

    return toErrorResponse(error, context);
  }
}
