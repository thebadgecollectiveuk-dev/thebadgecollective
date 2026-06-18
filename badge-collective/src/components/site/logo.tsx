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

/** Full brand lockup: emblem + stacked serif/sans wordmark, links home. */
function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="The Badge Collective, home"
      className={cn(
        "group inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Emblem className="transition-[filter] duration-300 group-hover:brightness-110" />
      <span className="flex flex-col leading-none">
        <span className="text-chrome font-serif text-[1.05rem] font-semibold uppercase tracking-[0.06em]">
          The Badge
        </span>
        <span className="mt-[3px] text-[0.55rem] font-medium uppercase tracking-[0.42em] text-muted-foreground">
          Collective
        </span>
      </span>
    </Link>
  );
}

export { Logo, Emblem };
