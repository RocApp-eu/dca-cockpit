import type { Metadata } from "next";
import { ContentLayout } from "@/components/ContentLayout";

export const metadata: Metadata = {
  title: "La méthode DCA expliquée — DCA Cockpit",
  description:
    "Le DCA (investissement programmé) et le multiplicateur hebdomadaire de DCA Cockpit : investir plus quand le marché panique, moins quand il s'emballe. Formule publique et transparente.",
  alternates: { canonical: "/methode/" },
};

export default function MethodePage() {
  return (
    <ContentLayout
      kicker="La méthode"
      title={
        <>
          Le DCA, <em>en clair</em>.
        </>
      }
      lede="Le DCA est la façon la plus simple d'investir sans se faire piéger par ses émotions. DCA Cockpit lui ajoute une couche : investir un peu plus quand le marché a peur, un peu moins quand il s'emballe."
    >
      <h2>Qu&apos;est-ce que le DCA ?</h2>
      <p>
        DCA veut dire <strong>Dollar-Cost Averaging</strong>, soit
        l&apos;investissement programmé. Le principe est limpide : vous investissez
        un montant fixe, à intervalle régulier, quoi qu&apos;il arrive sur les
        marchés. 200 € le 5 de chaque mois, par exemple, dans un ETF mondial.
      </p>
      <p>
        L&apos;intérêt n&apos;est pas de deviner le bon moment, c&apos;est
        justement de <strong>ne plus avoir à le deviner</strong>. Quand les prix
        montent, votre versement achète moins de parts. Quand ils baissent, il en
        achète plus. Sur la durée, vous lissez votre prix d&apos;achat et vous
        retirez l&apos;émotion de l&apos;équation.
      </p>

      <h2>Le défaut du DCA « plat »</h2>
      <p>
        Le DCA classique verse toujours le même montant. C&apos;est sa force, mais
        aussi sa limite : il traite de la même façon un marché au sommet et un
        marché qui vient de chuter de 30 %. Or, historiquement, les meilleurs
        points d&apos;entrée sont précisément les moments de panique, quand tout le
        monde vend.
      </p>
      <p>
        L&apos;idée de DCA Cockpit : garder la discipline du versement automatique,
        mais <strong>moduler son intensité</strong> selon le contexte. Acheter
        davantage quand c&apos;est soldé, alléger quand c&apos;est cher.
      </p>

      <h2>Le multiplicateur hebdomadaire</h2>
      <p>
        Chaque dimanche, DCA Cockpit calcule un <strong>multiplicateur</strong>,
        compris entre <strong>×0,6 et ×2,0</strong>. Il s&apos;applique à votre
        versement habituel :
      </p>
      <ul>
        <li>
          Multiplicateur <strong>×1,6</strong> sur un versement de 50 € : vous
          investissez 80 € cette semaine.
        </li>
        <li>
          Multiplicateur <strong>×0,8</strong> : vous investissez 40 €.
        </li>
      </ul>
      <p>
        Le multiplicateur monte quand la peur et les baisses dominent, il descend
        quand l&apos;avidité et les sommets dominent.
      </p>

      <h2>La formule, publique</h2>
      <p>Deux entrées, toutes deux des données de marché publiques :</p>
      <ul>
        <li>
          <strong>L&apos;indice Fear &amp; Greed</strong> (moyenne sur 7 jours),
          qui mesure la peur ou l&apos;avidité du marché.
        </li>
        <li>
          <strong>Le drawdown du MSCI World</strong> sur 52 semaines, soit la
          baisse des actions mondiales par rapport à leur plus haut récent.
        </li>
      </ul>
      <p>
        Le résultat est ensuite <strong>lissé</strong> (60 % du calcul de la
        semaine, 40 % de la semaine précédente) pour éviter les variations
        brutales. Pas de modèle opaque, pas de boîte noire : le calcul est
        déterministe et auditable.
      </p>

      <h2>Pourquoi ça marche</h2>
      <p>
        Parce que ça transforme un réflexe difficile en automatisme. Acheter quand
        les marchés s&apos;effondrent va à l&apos;encontre de toutes vos émotions.
        Une règle simple, calculée à votre place, vous aide à faire ce que la
        plupart des investisseurs ne parviennent pas à faire : rester investi, et
        renforcer dans les creux.
      </p>
      <p>
        Le multiplicateur n&apos;est pas un conseil en investissement. C&apos;est
        un outil de discipline, fondé sur une règle transparente que vous gardez
        toujours le droit de suivre, ou non.
      </p>
    </ContentLayout>
  );
}
