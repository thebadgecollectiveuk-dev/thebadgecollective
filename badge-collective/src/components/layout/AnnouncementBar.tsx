import Link from "next/link";

import { whatsappUrl } from "@/lib/site";

/**
 * Slim site-wide bar prompting bulk-order enquiries. Links to WhatsApp when a
 * number is configured, otherwise to the contact page.
 */
export function AnnouncementBar() {
  const wa = whatsappUrl(
    "Hi Badge Collective, I'm interested in a bulk order. ",
  );
  const linkClass =
    "font-medium text-chrome underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline";

  return (
    <div className="border-b border-border bg-surface/60">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs text-muted-foreground sm:text-sm">
        Looking for a bulk order?{" "}
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Message us privately for custom pricing
          </a>
        ) : (
          <Link href="/contact?subject=Bulk%20order" className={linkClass}>
            Contact us privately for custom pricing
          </Link>
        )}
      </p>
    </div>
  );
}
