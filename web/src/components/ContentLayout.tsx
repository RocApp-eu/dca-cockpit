import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "./dashboard/LogoMark";

export function ContentLayout({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="content-wrap">
      <header className="content-top">
        <Link href="/" className="content-logo">
          <LogoMark />
          DCA Cockpit
        </Link>
        <Link href="/dashboard" className="content-cta-top">
          Accéder au cockpit →
        </Link>
      </header>

      <article className="content-article">
        <span className="content-kicker">{kicker}</span>
        <h1 className="content-title">{title}</h1>
        <p className="content-lede">{lede}</p>
        {children}
      </article>

      <div className="content-foot">
        <h3>Prêt à passer à l&apos;action ?</h3>
        <p>Recevez chaque semaine votre multiplicateur DCA, gratuitement.</p>
        <Link href="/dashboard" className="content-foot-cta">
          Voir le signal de la semaine
        </Link>
      </div>
    </div>
  );
}
