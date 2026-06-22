/** Static brand facts, used across the site. */
export const SITE = {
  name: "The Badge Collective",
  email: "thebadgecollectiveuk@gmail.com",
  domain: "thebadgecollective.com",
  region: "United Kingdom",
  shipping: "£2.70 flat UK",
} as const;

// WhatsApp number comes from the environment. wa.me wants digits only, so we
// strip anything else. Owner adds NEXT_PUBLIC_WHATSAPP_NUMBER after deployment.
const RAW_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

/** True once a usable WhatsApp number is configured. */
export const hasWhatsApp = RAW_WHATSAPP.length > 0;

/** Build a wa.me link with a prefilled message, or null when not configured. */
export function whatsappUrl(message = "Hi Badge Collective, "): string | null {
  if (!hasWhatsApp) return null;
  return `https://wa.me/${RAW_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
