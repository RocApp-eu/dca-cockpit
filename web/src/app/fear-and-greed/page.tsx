import type { Metadata } from "next";
import { ContentLayout } from "@/components/ContentLayout";

export const metadata: Metadata = {
  title: "L'indice Fear & Greed expliqué — DCA Cockpit",
  description:
    "Ce que mesure l'indice Fear & Greed (peur et avidité), comment le lire de 0 à 100, et pourquoi DCA Cockpit l'utilise pour piloter votre versement hebdomadaire.",
  alternates: { canonical: "/fear-and-greed/" },
};

export default function FearAndGreedPage() {
  return (
    <ContentLayout
      kicker="Comprendre"
      title={
        <>
          L&apos;indice <em>Fear &amp; Greed</em>.
        </>
      }
      lede="Un thermomètre de l'émotion des marchés, de 0 (peur extrême) à 100 (avidité extrême). C'est l'une des deux entrées du multiplicateur DCA Cockpit."
    >
      <h2>Qu&apos;est-ce que c&apos;est ?</h2>
      <p>
        L&apos;indice <strong>Fear &amp; Greed</strong> (peur et avidité) résume en
        un seul chiffre, de 0 à 100, l&apos;état d&apos;esprit dominant des
        investisseurs. Plus il est bas, plus le marché a peur. Plus il est haut,
        plus il est avide.
      </p>
      <p>
        Il est calculé à partir de plusieurs ingrédients : la volatilité, la
        dynamique des prix, les volumes, la demande pour les valeurs refuges. DCA
        Cockpit utilise la version <strong>crypto</strong> de l&apos;indice, qui a
        l&apos;avantage d&apos;être publique, mise à jour quotidiennement, et très
        réactive aux émotions de marché.
      </p>

      <h2>Comment le lire</h2>
      <ul>
        <li>
          <strong>0 à 25 — Peur extrême.</strong> Les investisseurs vendent sous le
          coup de l&apos;émotion. Historiquement, souvent un bon moment pour
          renforcer.
        </li>
        <li>
          <strong>25 à 45 — Peur.</strong> Le marché est prudent, sur la défensive.
        </li>
        <li>
          <strong>45 à 55 — Neutre.</strong> Ni euphorie ni panique.
        </li>
        <li>
          <strong>55 à 75 — Avidité.</strong> L&apos;optimisme prend le dessus.
        </li>
        <li>
          <strong>75 à 100 — Avidité extrême.</strong> Le marché s&apos;emballe.
          Prudence : c&apos;est souvent là que les excès se forment.
        </li>
      </ul>

      <h2>Pourquoi on l&apos;utilise</h2>
      <p>
        Il y a une vieille règle de bon sens en investissement, attribuée à Warren
        Buffett : <strong>avoir peur quand les autres sont avides, et être avide
        quand les autres ont peur</strong>. C&apos;est exactement ce que l&apos;indice
        permet d&apos;automatiser.
      </p>
      <p>
        Dans le calcul de DCA Cockpit, on prend la <strong>moyenne sur 7 jours</strong>{" "}
        pour éviter de réagir à un simple coup de stress d&apos;une journée. Plus
        cette moyenne est basse (peur), plus votre multiplicateur monte. Plus elle
        est haute (avidité), plus il descend.
      </p>
      <p>
        L&apos;indice n&apos;est pas une boule de cristal : il ne prédit pas les
        marchés. Il décrit l&apos;émotion ambiante. Et c&apos;est précisément contre
        cette émotion qu&apos;une règle automatique vous protège.
      </p>
    </ContentLayout>
  );
}
