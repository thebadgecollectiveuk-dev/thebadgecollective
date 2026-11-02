/** Canonical site URL, without a trailing slash. */
export const SITE_URL = "https://www.thebadgecollective.com";

/** Turn a relative path (e.g. "/products/x.jpg") into a full URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
