export type AuthSession = {
  sellerId: string;
  email: string;
};

export type AuthSeller = {
  sellerId: string;
  sellerName: string;
  email: string;
  role: "SELLER" | "ADMIN";
  storeName: string | null;
  destinationPhoneNumber: string | null;
  plan: string;
  proValidUntil: string | null;
};

export type RegisterSellerInput = {
  sellerName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginSellerInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  seller: AuthSeller;
  redirectPath?: string;
};

export type StoredSellerAccount = {
  id: string;
  sellerName: string;
  email: string;
  password: string;
  createdAt: string;
};
