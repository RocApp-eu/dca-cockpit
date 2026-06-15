import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://dca.rocapp.eu";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Espaces privés / d'authentification : pas la peine de les crawler.
      disallow: ["/dashboard", "/login"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
