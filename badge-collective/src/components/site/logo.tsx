import Link from "next/link";

import { cn } from "@/lib/utils";

/** The circular maker's-mark emblem (concentric chrome rings + compass ticks). */
function Emblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-8 w-8 text-chrome", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="37" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <line x1="50" y1="5" x2="50" y2="14" />
        <line x1="50" y1="95" x2="50" y2="86" />
        <line x1="5" y1="50" x2="14" y2="50" />
        <line x1="95" y1="50" x2="86" y2="50" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

/** Full brand badge (roundel with wordmark baked in), links home. */
function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="The Badge Collective, home"
      className={cn(
        "group inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/brand-logo.svg"
        alt="The Badge Collective"
        width={48}
        height={48}
        className="h-12 w-12 transition-[filter] duration-300 group-hover:brightness-110"
      />
    </Link>
  );
}

export { Logo, Emblem };
