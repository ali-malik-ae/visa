"use client";

import { createContext, useContext } from "react";

interface CurrencyContextValue {
  /** AED is always shown. When true (set by the admin, site-wide), the USD equivalent is also shown. */
  showUsd: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue>({ showUsd: false });

/** Value comes from the admin's site-wide setting, resolved server-side — not a per-visitor preference. */
export function CurrencyProvider({
  showUsd,
  children,
}: {
  showUsd: boolean;
  children: React.ReactNode;
}) {
  return (
    <CurrencyContext.Provider value={{ showUsd }}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
