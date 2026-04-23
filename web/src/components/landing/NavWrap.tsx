"use client";

import { useEffect, useState, type ReactNode } from "react";

export function NavWrap({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>{children}</div>;
}
