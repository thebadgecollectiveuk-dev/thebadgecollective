import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use The Badge Collective and place an order.",
};

// Template content. Owner: review with suitable advice before relying on it.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        These terms apply when you browse The Badge Collective and when you place
        an order with us. By using the site or buying from us, you agree to them.
      </p>

      <h2>Products</h2>
      <p>
        We sell premium, brand new car badges. We describe each badge as
        accurately as we can. Colours and finishes may vary slightly from
        photographs.
      </p>

      <h2>Pricing and orders</h2>
      <p>
        Prices are shown in pounds sterling and include any applicable taxes. We
        may update prices and availability at any time. An order is confirmed once
        you receive our confirmation email. If we cannot fulfil an order, we will
        tell you and refund any payment in full.
      </p>

      <h2>Shipping and returns</h2>
      <p>
        Shipping and returns are covered on our{" "}
        <a href="/shipping-returns">Shipping &amp; Returns</a> page, which forms
        part of these terms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content on this site, including text, images and branding, belongs to
        The Badge Collective unless stated otherwise. Marque names and logos belong
        to their respective owners and are used only to describe the products.
      </p>

      <h2>Liability</h2>
      <p>
        We take care to describe and pack every badge properly. To the extent the
        law allows, our liability for any order is limited to the amount you paid
        for it. Nothing in these terms limits your statutory rights as a consumer.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of England and Wales, and any disputes
        fall to the courts of England and Wales.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
