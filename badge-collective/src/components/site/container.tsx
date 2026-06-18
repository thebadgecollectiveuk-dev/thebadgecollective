import * as React from "react";

import { cn } from "@/lib/utils";

/** Centered page container with consistent gutters. */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)} {...props} />
  );
}

export { Container };
