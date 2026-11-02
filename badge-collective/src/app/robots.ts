import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site-url";

/** Let Google's crawlers in explicitly, keep private pages out of search. */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/trade/", "/cart", "/checkout/"];
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", disallow: privatePaths },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "*", allow: "/", disallow: [...privatePaths, "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
