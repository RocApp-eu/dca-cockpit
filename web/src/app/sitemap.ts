import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://dca.rocapp.eu";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Trailing slash : le site est en trailingSlash:true, les URLs servies en 200
    // ont le slash final (sans, c'est une redirection 307).
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/methode/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/fear-and-greed/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/msci-world/`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
