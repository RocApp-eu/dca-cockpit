"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type MobileNavValue = { open: boolean; setOpen: (v: boolean) => void };

const MobileNavContext = createContext<MobileNavValue | undefined>(undefined);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav(): MobileNavValue {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    throw new Error("useMobileNav doit être utilisé dans <MobileNavProvider>");
  }
  return ctx;
}
