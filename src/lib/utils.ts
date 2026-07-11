export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(" ");
}

export const EXPRESS_SURCHARGE_AED = Number(
  process.env.EXPRESS_SURCHARGE_AED ?? 99
);

export const EXPRESS_SURCHARGE_USD = Number(
  process.env.EXPRESS_SURCHARGE_USD ?? 27
);

export const APP_ID_REGEX = /^VIS-\d{4}-[A-Z0-9]{6}$/;

export function generateAppId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    suffix += chars[byte % chars.length];
  }
  return `VIS-${year}-${suffix}`;
}

export function formatAed(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE")}`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/**
 * AED is always the primary currency. When `showUsd` is on, appends the USD
 * equivalent as a parenthetical — AED and USD are configured independently
 * per visa type (not auto-converted), so both must be supplied.
 */
export function formatDualPrice(showUsd: boolean, aed: number, usd: number): string {
  return showUsd ? `${formatAed(aed)} (~${formatUsd(usd)})` : formatAed(aed);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
