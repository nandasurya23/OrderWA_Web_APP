import { SELLER_PLAN, resolveSellerPlanPolicy } from "@/server/config/seller-plan";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";

export async function getSellerPlanPolicyBySellerId(sellerId: string) {
  const account = await findSellerAccountById(sellerId);
  const plan = account?.plan ?? SELLER_PLAN.FREE;

  return resolveSellerPlanPolicy(plan);
}
