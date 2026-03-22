import { getSellerPlanPolicyBySellerId } from "@/server/services/seller-plan.service";
import type { SellerFeatureGates } from "@/server/config/seller-plan";

export async function getSellerFeatureGatesBySellerId(sellerId: string) {
  const policy = await getSellerPlanPolicyBySellerId(sellerId);
  return policy.featureGates;
}

export function hasSellerFeature(
  featureGates: SellerFeatureGates,
  feature: keyof SellerFeatureGates,
) {
  return featureGates[feature];
}
