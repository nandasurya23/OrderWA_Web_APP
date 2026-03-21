export type SellerProfile = {
  sellerId: string;
  sellerName: string;
  email: string;
  storeName: string;
  storeSlug: string;
  destinationPhoneNumber: string;
  storeDescription: string;
};

export type SellerProfileInput = {
  sellerName: string;
  email: string;
  storeName: string;
  destinationPhoneNumber: string;
  storeDescription: string;
};
