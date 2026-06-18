import * as React from "react";

import { cn } from "@/lib/utils";

/** Uppercase, wide-tracked eyebrow label. */
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("label-caps text-muted-foreground", className)} {...props} />;
}

/** Thin metallic divider line. */
function ChromeRule({ className }: { className?: string }) {
  return <div className={cn("chrome-rule", className)} aria-hidden="true" />;
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow + serif title + optional intro, used as a section header. */
function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="max-w-2xl font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <ChromeRule className={cn("max-w-[140px]", align === "left" && "ml-0")} />
      {intro ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export { Eyebrow, ChromeRule, SectionHeading };
