import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Flat-rate UK shipping at £2.70, dispatched within two working days. 14-day returns on unused badges in original condition.",
};

// Template content. Owner: review against your final policy before launch.
export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & Returns" updated="June 2026">
      <h2>Shipping</h2>
      <p>
        We ship across the United Kingdom at a <strong>flat rate of £2.70</strong>{" "}
        per order. Orders are dispatched within <strong>two working days</strong>,
        and most arrive within two to five working days of dispatch.
      </p>
      <p>
        You will receive an email confirmation when your order is placed, and a
        further note once it has been sent. We currently ship to UK addresses
        only.
      </p>

      <h2>Returns</h2>
      <p>
        If a badge is not right for you, you may return it within{" "}
        <strong>14 days of receipt</strong>. To be eligible, the item must be{" "}
        <strong>unused and in its original condition and packaging</strong>.
      </p>
      <ul>
        <li>Contact us first so we can confirm your return and the address.</li>
        <li>Return postage is paid by the buyer.</li>
        <li>
          We recommend a tracked service, as we cannot refund items that do not
          reach us.
        </li>
      </ul>
      <p>
        Once your return arrives and has been checked, we will refund the price
        of the badge to your original payment method. Original shipping charges
        are non-refundable unless the item arrived faulty or incorrect.
      </p>

      <h2>Faulty or incorrect items</h2>
      <p>
        If something arrives damaged or not as described, message us within 14
        days and we will put it right, either with a replacement or a full
        refund including postage.
      </p>

      <h2>Questions</h2>
      <p>
        For anything to do with shipping or returns, email{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>{" "}
        or message us on WhatsApp.
      </p>
    </LegalPage>
  );
}
