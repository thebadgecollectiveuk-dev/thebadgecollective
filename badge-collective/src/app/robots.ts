import type { MetadataRoute } from "next";

/** Keep the secret trade area out of search engines. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/trade/",
    },
  };
}
