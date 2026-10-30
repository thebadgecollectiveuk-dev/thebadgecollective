"use client";

import * as React from "react";
import { Download, Printer, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/format";

export type InvoiceData = {
  id: string;
  business: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string[];
  lines: { name: string; qty: number; total: number }[];
  shipping: number;
  total: number;
  date: string;
};

export function InvoiceActions({ invoice }: { invoice: InvoiceData }) {
  const [building, setBuilding] = React.useState(false);

  const handleDownload = async () => {
    setBuilding(true);
    try {
      // Load jsPDF only when the button is clicked, so it never weighs down
      // the page for people who don't download.
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const left = 18;
      const right = 192;
      let y = 24;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("The Badge Collective", left, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("Trade invoice", left, y + 6);
      doc.text(`Order ${invoice.id}`, right, y, { align: "right" });
      doc.text(invoice.date, right, y + 6, { align: "right" });
      doc.setTextColor(30);

      y += 16;
      doc.setDrawColor(200);
      doc.line(left, y, right, y);
      y += 10;

      // Billed to / Ship to
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("BILLED TO", left, y);
      doc.text("SHIP TO", 110, y);
      doc.setTextColor(30);
      doc.setFontSize(10);
      let by = y + 6;
      const billed = [invoice.business, invoice.name, invoice.email, invoice.phone].filter(
        (x): x is string => Boolean(x),
      );
      billed.forEach((l) => {
        doc.text(l, left, by);
        by += 5;
      });
      let sy = y + 6;
      invoice.address.forEach((l) => {
        doc.text(l, 110, sy);
        sy += 5;
      });

      y = Math.max(by, sy) + 8;
      doc.setDrawColor(200);
      doc.line(left, y, right, y);
      y += 8;

      // Table header
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("ITEM", left, y);
      doc.text("QTY", 150, y, { align: "right" });
      doc.text("TOTAL", right, y, { align: "right" });
      doc.setTextColor(30);
      doc.setFontSize(10);
      y += 6;

      invoice.lines.forEach((l) => {
        doc.text(l.name.slice(0, 60), left, y);
        doc.text(String(l.qty), 150, y, { align: "right" });
        doc.text(formatGBP(l.total), right, y, { align: "right" });
        y += 6;
      });

      y += 2;
      doc.setDrawColor(200);
      doc.line(left, y, right, y);
      y += 7;

      doc.setTextColor(120);
      doc.text("Shipping (Royal Mail)", left, y);
      doc.setTextColor(30);
      doc.text(invoice.shipping === 0 ? "Free" : formatGBP(invoice.shipping), right, y, {
        align: "right",
      });
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Total paid", left, y);
      doc.text(formatGBP(invoice.total), right, y, { align: "right" });
      doc.setFont("helvetica", "normal");

      y += 14;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "Thank you for your order. Trade prices are confidential. thebadgecollective.com",
        left,
        y,
      );

      doc.save(`badge-collective-invoice-${invoice.id}.pdf`);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <Button onClick={handleDownload} disabled={building}>
        {building ? <Loader2 className="animate-spin" /> : <Download />}
        {building ? "Preparing…" : "Download PDF"}
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        <Printer /> Print
      </Button>
    </div>
  );
}
