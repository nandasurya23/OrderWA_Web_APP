export type AuthSession = {
  sellerId: string;
  email: string;
};

export type AuthSeller = {
  sellerId: string;
  sellerName: string;
  email: string;
  storeName: string;
  destinationPhoneNumber: string;
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
};

export type StoredSellerAccount = {
  id: string;
  sellerName: string;
  email: string;
  password: string;
  createdAt: string;
};
