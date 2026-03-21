export function normalizePhoneNumber(value: string | undefined | null) {
  if (!value) {
    return "";
  }

  const digitsOnlyValue = value.replace(/\D+/g, "");

  if (!digitsOnlyValue) {
    return "";
  }

  if (digitsOnlyValue.startsWith("00")) {
    return digitsOnlyValue.slice(2);
  }

  if (digitsOnlyValue.startsWith("0")) {
    return `62${digitsOnlyValue.slice(1)}`;
  }

  if (digitsOnlyValue.startsWith("8")) {
    return `62${digitsOnlyValue}`;
  }

  return digitsOnlyValue;
}

export function isValidWhatsAppPhoneNumber(value: string | undefined | null) {
  const normalizedPhoneNumber = normalizePhoneNumber(value);

  return normalizedPhoneNumber.length >= 10 && normalizedPhoneNumber.length <= 15;
}
