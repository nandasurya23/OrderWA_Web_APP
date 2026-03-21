import {
  isValidWhatsAppPhoneNumber,
  normalizePhoneNumber,
} from "@/features/shared-order/lib/normalize-phone-number";

export function getWhatsAppLink(
  phoneNumber: string | undefined,
  message: string,
) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (!isValidWhatsAppPhoneNumber(normalizedPhoneNumber)) {
    return null;
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}
