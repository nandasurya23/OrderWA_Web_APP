export const SELLER_PLAN = {
  FREE: "FREE",
  PRO: "PRO",
} as const;

export type SellerPlan = (typeof SELLER_PLAN)[keyof typeof SELLER_PLAN];

export type SellerFeatureGates = {
  watermarkRemoval: boolean;
  multipleActiveLinks: boolean;
  advancedCustomization: boolean;
};

export type SellerPlanPolicy = {
  code: SellerPlan;
  linkGenerateWindowMs: number;
  linkExpiryMs: number;
  featureGates: SellerFeatureGates;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const POLICY_BY_PLAN: Record<SellerPlan, SellerPlanPolicy> = {
  FREE: {
    code: SELLER_PLAN.FREE,
    linkGenerateWindowMs: DAY_MS,
    linkExpiryMs: DAY_MS,
    featureGates: {
      watermarkRemoval: false,
      multipleActiveLinks: false,
      advancedCustomization: false,
    },
  },
  PRO: {
    code: SELLER_PLAN.PRO,
    linkGenerateWindowMs: 0,
    linkExpiryMs: DAY_MS,
    featureGates: {
      watermarkRemoval: true,
      multipleActiveLinks: true,
      advancedCustomization: true,
    },
  },
};

export function resolveSellerPlanPolicy(plan: string | null | undefined): SellerPlanPolicy {
  if (!plan) {
    return POLICY_BY_PLAN.FREE;
  }

  if (plan === SELLER_PLAN.FREE || plan === SELLER_PLAN.PRO) {
    return POLICY_BY_PLAN[plan];
  }

  return POLICY_BY_PLAN.FREE;
}
