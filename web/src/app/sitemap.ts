import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://dca.rocapp.eu";

// Pour l'instant seule la landing est complète et indexable. Les pages de
// contenu (méthode, Fear & Greed, MSCI World) sont des placeholders « bientôt »
// et seront ajoutées au sitemap une fois rédigées.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
