import { prisma } from "@/server/db/prisma";
import {
  PRO_PRICE_IDR,
  SELLER_PLAN,
  resolveEffectiveSellerPlan,
} from "@/server/config/seller-plan";
import { HttpError } from "@/server/http/errors";
import {
  createSellerUpgradeRequest,
  findPendingUpgradeRequestBySellerId,
  findUpgradeRequestById,
  findUpgradeRequestByIdWithDb,
  listUpgradeRequests,
  updateUpgradeRequestReview,
} from "@/server/repositories/seller-upgrade-request.repo";
import { findSellerAccountById, updateSellerAccountPlan } from "@/server/repositories/seller-account.repo";

function addOneCalendarMonth(input: Date) {
  const next = new Date(input);
  next.setMonth(next.getMonth() + 1);
  return next;
}

export async function createProUpgradeRequestForSeller(sellerId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${sellerId}))`;

    const account = await findSellerAccountById(sellerId, tx);

    if (!account) {
      throw new HttpError("Akun seller tidak ditemukan.", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const dbNowRows = await tx.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`;
    const now = dbNowRows[0]?.now ?? new Date();
    const effectivePlan = resolveEffectiveSellerPlan({
      plan: account.plan,
      proValidUntil: account.proValidUntil,
      now,
    });

    if (effectivePlan === SELLER_PLAN.PRO) {
      throw new HttpError("Pro masih aktif. Upgrade baru belum diperlukan.", {
        code: "PRO_ALREADY_ACTIVE",
        status: 409,
      });
    }

    const existingPending = await findPendingUpgradeRequestBySellerId(
      sellerId,
      SELLER_PLAN.PRO,
      tx,
    );

    if (existingPending) {
      return {
        created: false,
        request: existingPending,
      };
    }

    const request = await createSellerUpgradeRequest({
      sellerId,
      planCode: SELLER_PLAN.PRO,
      priceAmount: PRO_PRICE_IDR,
      db: tx,
    });

    return {
      created: true,
      request,
    };
  });
}

export async function getPendingProUpgradeRequestForSeller(sellerId: string) {
  const request = await findPendingUpgradeRequestBySellerId(sellerId, SELLER_PLAN.PRO);
  return request;
}

export async function getUpgradeRequests(status?: "pending" | "approved" | "rejected") {
  return listUpgradeRequests(status);
}

export async function reviewProUpgradeRequest(input: {
  requestId: string;
  decision: "approved" | "rejected";
  reviewNote?: string;
}) {
  const request = await findUpgradeRequestById(input.requestId);

  if (!request) {
    throw new HttpError("Request upgrade tidak ditemukan.", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  if (request.status !== "pending") {
    throw new HttpError("Request sudah diproses sebelumnya.", {
      code: "REQUEST_ALREADY_REVIEWED",
      status: 409,
    });
  }

  if (input.decision === "rejected") {
    const reviewed = await updateUpgradeRequestReview(request.id, {
      reviewNote: input.reviewNote,
      reviewedAt: new Date(),
      status: "rejected",
    });

    return {
      request: reviewed,
      sellerPlan: null,
    };
  }

  return prisma.$transaction(async (tx) => {
    const latestRequest = await findUpgradeRequestByIdWithDb(request.id, tx);

    if (!latestRequest) {
      throw new HttpError("Request upgrade tidak ditemukan.", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    if (latestRequest.status !== "pending") {
      throw new HttpError("Request sudah diproses sebelumnya.", {
        code: "REQUEST_ALREADY_REVIEWED",
        status: 409,
      });
    }

    const latestAccount = await findSellerAccountById(latestRequest.sellerId, tx);

    if (!latestAccount) {
      throw new HttpError("Akun seller tidak ditemukan.", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const effectivePlan = resolveEffectiveSellerPlan({
      plan: latestAccount.plan,
      proValidUntil: latestAccount.proValidUntil,
    });

    if (effectivePlan === SELLER_PLAN.PRO) {
      throw new HttpError("Seller sudah memiliki Pro aktif.", {
        code: "PRO_ALREADY_ACTIVE",
        status: 409,
      });
    }

    const dbNowRows = await tx.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`;
    const now = dbNowRows[0]?.now ?? new Date();
    const proValidUntil = addOneCalendarMonth(now);

    const [reviewedRequest, account] = await Promise.all([
      updateUpgradeRequestReview(latestRequest.id, {
        reviewNote: input.reviewNote,
        reviewedAt: now,
        status: "approved",
      }, tx),
      updateSellerAccountPlan(latestRequest.sellerId, {
        plan: SELLER_PLAN.PRO,
        proValidUntil,
      }, tx),
    ]);

    return {
      request: reviewedRequest,
      sellerPlan: {
        plan: account.plan,
        proValidUntil: account.proValidUntil,
      },
    };
  });
}
