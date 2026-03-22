export const ACCOUNT_ROLE = {
  ADMIN: "ADMIN",
  SELLER: "SELLER",
} as const;

export type AccountRole = (typeof ACCOUNT_ROLE)[keyof typeof ACCOUNT_ROLE];

export function resolveAccountRole(role: string | null | undefined): AccountRole {
  return role === ACCOUNT_ROLE.ADMIN ? ACCOUNT_ROLE.ADMIN : ACCOUNT_ROLE.SELLER;
}
