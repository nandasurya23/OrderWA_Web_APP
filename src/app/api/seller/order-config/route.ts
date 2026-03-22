import { NextRequest } from "next/server";
import { z } from "zod";

import { DEFAULT_SELLER_ORDER_CONFIG } from "@/features/shared-order/constants/order.constants";
import { requireSellerSession } from "@/server/auth/guards";
import { HttpError } from "@/server/http/errors";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import {
  findSellerOrderConfigBySellerId,
  upsertSellerOrderConfig,
} from "@/server/repositories/seller-order-config.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { syncLatestPublicLinkSnapshotForSellerConfig } from "@/server/services/public-order-link.service";

const sellerOrderConfigSchema = z.object({
  openingText: z.string().trim().min(1).max(120),
  closingText: z.string().trim().min(1).max(140),
  showPhoneNumber: z.boolean(),
  showAddress: z.boolean(),
  showNote: z.boolean(),
  customFields: z.array(
    z.object({
      id: z.string().trim().min(1).max(64),
      type: z.enum(["text", "textarea"]),
      required: z.boolean(),
      label: z.string().trim().min(1).max(60),
      placeholder: z.string().trim().max(120),
    }).strict(),
  ).max(10).default([]),
  fieldOrder: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
}).strict();

function mapConfigResponse(config: {
  openingText: string;
  closingText: string;
  showPhoneNumber: boolean;
  showAddress: boolean;
  showNote: boolean;
  customFields: Array<{
    id: string;
    type: "text" | "textarea";
    required: boolean;
    label: string;
    placeholder: string;
  }>;
  fieldOrder: string[];
}) {
  return {
    config: {
      ...config,
      destinationPhoneNumber: "",
    },
  };
}

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:order-config:get",
      limit: 80,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const config = await findSellerOrderConfigBySellerId(sellerId);

    if (!config) {
      return ok(
        mapConfigResponse({
          closingText: DEFAULT_SELLER_ORDER_CONFIG.closingText,
          openingText: DEFAULT_SELLER_ORDER_CONFIG.openingText,
          showAddress: DEFAULT_SELLER_ORDER_CONFIG.showAddress,
          showNote: DEFAULT_SELLER_ORDER_CONFIG.showNote,
          showPhoneNumber: DEFAULT_SELLER_ORDER_CONFIG.showPhoneNumber,
          customFields: DEFAULT_SELLER_ORDER_CONFIG.customFields,
          fieldOrder: DEFAULT_SELLER_ORDER_CONFIG.fieldOrder,
        }),
        200,
        context,
      );
    }

    return ok(
      mapConfigResponse({
        closingText: config.closingText,
        openingText: config.openingText,
        showAddress: config.showAddress,
        showNote: config.showNote,
        showPhoneNumber: config.showPhoneNumber,
        customFields: sellerOrderConfigSchema.shape.customFields.parse(config.customFields),
        fieldOrder: sellerOrderConfigSchema.shape.fieldOrder.parse(config.fieldOrder),
      }),
      200,
      context,
    );
  } catch (error) {
    return toErrorResponse(error, context);
  }
}

export async function PUT(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:order-config:update",
      limit: 25,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const body = sellerOrderConfigSchema.parse(await request.json());
    const config = await upsertSellerOrderConfig(sellerId, {
      closingText: body.closingText.trim(),
      openingText: body.openingText.trim(),
      showAddress: body.showAddress,
      showNote: body.showNote,
      showPhoneNumber: body.showPhoneNumber,
      customFields: body.customFields,
      fieldOrder: body.fieldOrder,
    });
    await syncLatestPublicLinkSnapshotForSellerConfig({
      sellerId,
      config: {
        closingText: config.closingText,
        openingText: config.openingText,
        showAddress: config.showAddress,
        showNote: config.showNote,
        showPhoneNumber: config.showPhoneNumber,
        customFields: sellerOrderConfigSchema.shape.customFields.parse(config.customFields),
        fieldOrder: sellerOrderConfigSchema.shape.fieldOrder.parse(config.fieldOrder),
      },
    });

    logAuditEvent({
      action: "seller.order-config.updated",
      metadata: {
        ip: context.ip,
      },
      requestId: context.requestId,
      sellerId,
    });

    return ok(
      mapConfigResponse({
        closingText: config.closingText,
        openingText: config.openingText,
        showAddress: config.showAddress,
        showNote: config.showNote,
        showPhoneNumber: config.showPhoneNumber,
        customFields: sellerOrderConfigSchema.shape.customFields.parse(config.customFields),
        fieldOrder: sellerOrderConfigSchema.shape.fieldOrder.parse(config.fieldOrder),
      }),
      200,
      context,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), context);
    }

    return toErrorResponse(error, context);
  }
}
