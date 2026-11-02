/** Canonical site URL, without a trailing slash. */
export const SITE_URL = "https://www.thebadgecollective.com";

/** Turn a relative path (e.g. "/products/x.jpg") into a full URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Serve a product photo from our own domain (via Next's image optimiser)
 * instead of Stripe's file host, so Google's image crawler can always fetch it.
 */
export function crawlableImageUrl(pathOrUrl: string): string {
  if (!/^https?:\/\//.test(pathOrUrl)) return absoluteUrl(pathOrUrl);
  return `${SITE_URL}/_next/image?url=${encodeURIComponent(pathOrUrl)}&w=1200&q=75`;
}

const COLOUR_WORDS = [
  "gloss black", "matte black", "black", "chrome", "silver", "grey", "gray",
  "gold", "white", "red", "blue", "green", "carbon",
];

/** Colour for Google Shopping: Stripe metadata first, otherwise read it from the title. */
export function productColour(name: string, metaColour?: string | null): string | null {
  if (metaColour) return metaColour;
  const lower = name.toLowerCase();
  const found = COLOUR_WORDS.filter((c) => lower.includes(c))
    // drop "black" if "gloss black" already matched, etc.
    .filter((c, _i, all) => !all.some((o) => o !== c && o.includes(c)));
  if (found.length === 0) return null;
  return found
    .sort((a, b) => lower.indexOf(a) - lower.indexOf(b))
    .slice(0, 3)
    .map((c) => c.replace(/\b\w/g, (m) => m.toUpperCase()))
    .join("/");
}
