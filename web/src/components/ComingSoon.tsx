import Link from "next/link";

export function ComingSoon({
  kicker,
  title,
  description,
  backHref = "/",
  backLabel = "Retour à l'accueil",
}: {
  kicker: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-card">
        <span className="cs-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href={backHref} className="cs-back">
          ← {backLabel}
        </Link>
      </div>
    </div>
  );
}
