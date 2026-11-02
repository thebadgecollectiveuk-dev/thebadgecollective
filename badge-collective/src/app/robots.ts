import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site-url";

/** Keep the secret trade area and checkout pages out of search engines. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/trade/", "/cart", "/checkout/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
