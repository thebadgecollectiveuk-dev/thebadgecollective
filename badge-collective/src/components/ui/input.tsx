import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-sm border border-input bg-[#0e0e0e] px-3.5 py-2 text-sm text-foreground transition-colors duration-300 placeholder:text-muted-foreground/70 focus-visible:border-chrome/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
