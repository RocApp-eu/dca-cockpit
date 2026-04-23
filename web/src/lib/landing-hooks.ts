"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anime une valeur numérique de 0 vers `target` au montage et à chaque
 * changement de `target`. Easing easeOutQuart, RAF-piloté.
 */
export function useAnimatedNumber(target: number, duration = 1100, decimals = 1) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const toRef = useRef(target);

  useEffect(() => {
    fromRef.current = val;
    toRef.current = target;
    startRef.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const e = 1 - Math.pow(1 - p, 4); // easeOutQuart
      const v = fromRef.current + (toRef.current - fromRef.current) * e;
      setVal(+v.toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals]);

  return val;
}

/**
 * Observe les éléments `[data-reveal]` et ajoute `is-revealed` à l'entrée
 * dans le viewport. À appeler une seule fois au niveau page.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-revealed");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
