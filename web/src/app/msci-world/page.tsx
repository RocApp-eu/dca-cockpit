import type { Metadata } from "next";
import { ContentLayout } from "@/components/ContentLayout";

export const metadata: Metadata = {
  title: "Le MSCI World expliqué — DCA Cockpit",
  description:
    "Ce qu'est l'indice MSCI World (1 500 entreprises, 23 pays développés), la notion de drawdown 52 semaines, et pourquoi DCA Cockpit s'en sert comme jauge de décote.",
  alternates: { canonical: "/msci-world/" },
};

export default function MsciWorldPage() {
  return (
    <ContentLayout
      kicker="Comprendre"
      title={
        <>
          Le <em>MSCI World</em>.
        </>
      }
      lede="L'indice de référence des actions mondiales. Son recul par rapport à son plus haut récent, le « drawdown », est la seconde entrée du multiplicateur DCA Cockpit."
    >
      <h2>Qu&apos;est-ce que le MSCI World ?</h2>
      <p>
        Le <strong>MSCI World</strong> est un indice boursier qui regroupe environ{" "}
        <strong>1 500 grandes et moyennes entreprises</strong>, réparties dans{" "}
        <strong>23 pays développés</strong> (États-Unis, Japon, France, Royaume-Uni,
        Allemagne, etc.). C&apos;est, en pratique, le baromètre le plus suivi de la
        santé des marchés actions mondiaux.
      </p>
      <p>
        Beaucoup d&apos;investisseurs particuliers s&apos;y exposent via un{" "}
        <strong>ETF</strong> (un fonds qui réplique l&apos;indice) comme le iShares
        Core MSCI World ou l&apos;Amundi MSCI World. En une seule ligne, vous
        détenez un petit morceau de l&apos;économie mondiale.
      </p>

      <h2>La force : la diversification</h2>
      <p>
        L&apos;intérêt du MSCI World, c&apos;est qu&apos;il ne mise sur aucune
        entreprise ni aucun pays en particulier. Si une société fait faillite, elle
        ne pèse qu&apos;une fraction de l&apos;indice. Cette diversification réduit
        le risque sans vous demander d&apos;être un expert des marchés.
      </p>

      <h2>Le drawdown, en clair</h2>
      <p>
        Le <strong>drawdown</strong> mesure la baisse d&apos;un actif par rapport à
        son <strong>plus haut récent</strong>. Un drawdown de −8 % signifie que
        l&apos;indice a reculé de 8 % depuis son sommet des dernières semaines.
      </p>
      <p>
        DCA Cockpit regarde le drawdown sur <strong>52 semaines</strong> (un an).
        Plus la baisse est profonde, plus les actions mondiales sont, en quelque
        sorte, « en solde » par rapport à leur récent sommet. C&apos;est un signal
        objectif de décote, sans pari sur l&apos;avenir.
      </p>

      <h2>Pourquoi on l&apos;utilise</h2>
      <p>
        Là où l&apos;indice Fear &amp; Greed capte l&apos;<strong>émotion</strong>,
        le drawdown capte le <strong>prix</strong>. Combiner les deux donne un
        signal plus robuste : on renforce quand les marchés ont à la fois peur{" "}
        <em>et</em> ont déjà nettement baissé.
      </p>
      <p>
        Concrètement, plus le drawdown du MSCI World est profond, plus votre
        multiplicateur de la semaine monte. Quand l&apos;indice est au plus haut, le
        drawdown est nul et cette composante n&apos;ajoute rien : inutile de se
        précipiter quand tout est cher.
      </p>
    </ContentLayout>
  );
}
