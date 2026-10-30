"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Prints the current page (used for the trade invoice → "Save as PDF"). */
export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <Button variant="outline" onClick={() => window.print()} className="print:hidden">
      <Printer /> {label}
    </Button>
  );
}
