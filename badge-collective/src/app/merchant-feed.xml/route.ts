/**
 * Google Merchant Center product feed.
 *
 * Add https://thebadgecollective.com/merchant-feed.xml in Merchant Center as a
 * "scheduled fetch" feed and your products can show in Google Shopping's free
 * listings. It reads straight from Stripe, so prices and stock stay in sync.
 */
import { getProduct, getProducts } from "@/lib/products";
import { SITE_URL, crawlableImageUrl, productColour } from "@/lib/seo/site-url";

export const revalidate = 3600;

const SHIPPING_GBP = "3.99";

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const list = await getProducts();
  // Load each product in full so the feed price matches the "from" price on
  // the product page (pack and fitment products price differently).
  const products = (
    await Promise.all(list.map((p) => getProduct(p.id)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const items = products
    .map((p) => {
      const images = (p.images && p.images.length > 0 ? p.images : [p.image]).map(crawlableImageUrl);
      const extra = images
        .slice(1, 10)
        .map((img) => `      <g:additional_image_link>${esc(img)}</g:additional_image_link>`)
        .join("\n");
      const colour = productColour(p.name, p.color);
      return `    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.name.slice(0, 150))}</g:title>
      <g:description>${esc((p.description || p.name).slice(0, 5000))}</g:description>
      <g:link>${esc(`${SITE_URL}/shop/${p.id}`)}</g:link>
      <g:image_link>${esc(images[0])}</g:image_link>
${extra ? extra + "\n" : ""}      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${(p.unitAmount / 100).toFixed(2)} GBP</g:price>
      <g:condition>new</g:condition>
${colour ? `      <g:color>${esc(colour)}</g:color>\n` : ""}      <g:brand>The Badge Collective</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>Vehicle Parts &amp; Accessories &gt; Car Badges &amp; Emblems</g:product_type>
      <g:shipping>
        <g:country>GB</g:country>
        <g:service>Royal Mail</g:service>
        <g:price>${SHIPPING_GBP} GBP</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>The Badge Collective</title>
    <link>${SITE_URL}</link>
    <description>Aftermarket car badges, emblems and wheel centre caps, shipped across the UK.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
