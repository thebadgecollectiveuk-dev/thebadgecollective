/**
 * Brand categories. Products are sorted into a brand by matching these
 * keywords against the product title (case-insensitive). No server deps here,
 * so this is safe to import from client components.
 */
export type Brand = { slug: string; label: string; keywords: string[] };

export const BRANDS: Brand[] = [
  { slug: "bmw", label: "BMW", keywords: ["bmw", "m sport", "m140i", "m135i"] },
  { slug: "mercedes", label: "Mercedes", keywords: ["mercedes", "amg"] },
  { slug: "lamborghini", label: "Lamborghini", keywords: ["lamborghini", "lambo"] },
  { slug: "audi", label: "Audi", keywords: ["audi"] },
  { slug: "porsche", label: "Porsche", keywords: ["porsche"] },
  { slug: "mini", label: "MINI", keywords: ["mini"] },
  { slug: "volkswagen", label: "Volkswagen", keywords: ["volkswagen", "vw"] },
  { slug: "range-rover", label: "Range Rover", keywords: ["range rover"] },
  { slug: "land-rover", label: "Land Rover", keywords: ["land rover", "defender", "discovery"] },
];

/** Return the brand slug matching a product name, or null. */
export function brandForName(name: string): string | null {
  const n = name.toLowerCase();
  for (const b of BRANDS) {
    if (b.keywords.some((k) => n.includes(k))) return b.slug;
  }
  return null;
}
