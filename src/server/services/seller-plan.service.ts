import {
  SELLER_PLAN,
  resolveEffectiveSellerPlan,
  resolveSellerPlanPolicy,
} from "@/server/config/seller-plan";
import { prisma } from "@/server/db/prisma";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";

export async function getSellerPlanPolicyBySellerId(sellerId: string) {
  const [account, dbNowRows] = await Promise.all([
    findSellerAccountById(sellerId),
    prisma.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`,
  ]);
  const now = dbNowRows[0]?.now ?? new Date();
  const plan = resolveEffectiveSellerPlan({
    plan: account?.plan ?? SELLER_PLAN.FREE,
    proValidUntil: account?.proValidUntil,
    now,
  });

  return resolveSellerPlanPolicy(plan);
}
