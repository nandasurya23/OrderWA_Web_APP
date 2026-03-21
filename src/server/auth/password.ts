import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(rawPassword: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(rawPassword, salt, KEY_LENGTH).toString("hex");
  return `s1:${salt}:${hash}`;
}

export function verifyPassword(rawPassword: string, storedValue: string) {
  const [version, salt, hash] = storedValue.split(":");

  if (version !== "s1" || !salt || !hash) {
    return false;
  }

  const attemptedHash = scryptSync(rawPassword, salt, KEY_LENGTH).toString("hex");
  return (
    attemptedHash.length === hash.length &&
    timingSafeEqual(Buffer.from(attemptedHash), Buffer.from(hash))
  );
}
