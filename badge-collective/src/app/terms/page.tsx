import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms and conditions that apply when you use The Badge Collective and place an order.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="24/06/2026">
      <p>
        These terms and conditions (&ldquo;Terms&rdquo;) govern your use of
        thebadgecollective.com (the &ldquo;Site&rdquo;) and the purchase of any
        products from us. By placing an order, you confirm that you accept these
        Terms. Please read them carefully before ordering.
      </p>

      <h2>1. About Us</h2>
      <p>
        This Site is operated by The Badge Collective (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;), a sole trader based in the United
        Kingdom.
      </p>
      <ul>
        <li>
          <strong>Business name:</strong> The Badge Collective
        </li>
        <li>
          <strong>Trading address:</strong> Not available at the moment
        </li>
        <li>
          <strong>Contact email:</strong>{" "}
          <a href="mailto:thebadgecollectiveuk@gmail.com">
            thebadgecollectiveuk@gmail.com
          </a>
        </li>
      </ul>
      <p>
        If you need to contact us for any reason, including questions,
        cancellations, or complaints, please email us at{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>
        .
      </p>

      <h2>2. Our Products</h2>
      <p>
        2.1. We sell brand new automotive badges and emblems. All items are
        supplied in new, unused condition.
      </p>
      <p>
        2.2. We make every effort to describe and photograph each item
        accurately. Colours and finishes may appear slightly different on screen
        depending on your device.
      </p>
      <p>
        2.3. All products are subject to availability. If an item is unavailable
        after you order, we will contact you and offer a replacement or a full
        refund.
      </p>

      <h2>3. Brand Names and Intellectual Property</h2>
      <p>
        3.1. Any manufacturer names, model names, logos, or trademarks (for
        example, references to specific vehicle marques) are used purely for
        identification and descriptive purposes, to indicate the vehicle or
        model a badge is compatible with or originates from.
      </p>
      <p>
        3.2. We are not affiliated with, authorised by, sponsored by, or
        endorsed by any vehicle manufacturer or trademark holder. All such
        trademarks remain the property of their respective owners.
      </p>
      <p>
        3.3. The products we sell are genuine or compatible parts supplied in
        brand new condition. We do not sell counterfeit goods.
      </p>
      <p>
        3.4. All content on this Site (text, graphics, images, layout, and
        branding belonging to The Badge Collective) is our property or licensed
        to us and may not be copied or reused for commercial purposes without
        our written permission.
      </p>

      <h2>4. Orders and Contract Formation</h2>
      <p>
        4.1. By placing an order you make an offer to buy the product(s) at the
        stated price.
      </p>
      <p>
        4.2. A contract is formed only when we send you an order confirmation
        email. If we cannot accept your order, we will tell you and will not
        charge you (or will refund any payment already taken).
      </p>
      <p>
        4.3. We reserve the right to refuse or cancel an order, including where
        an item has been mispriced or is no longer available.
      </p>

      <h2>5. Pricing and Payment</h2>
      <p>
        5.1. Prices are shown in pounds sterling (GBP). We are not currently VAT
        registered, so no VAT is added to our prices.
      </p>
      <p>
        5.2. Payment is processed securely via Stripe. We do not store your full
        card details.
      </p>
      <p>
        5.3. Payment is taken at the point of order. We are not responsible for
        any fees your bank or card provider may charge.
      </p>
      <p>
        5.4. If a product is listed at an incorrect price due to an error, we are
        not obliged to fulfil the order at that price and will notify you before
        processing.
      </p>

      <h2>6. Delivery</h2>
      <p>
        6.1. We deliver to addresses within the United Kingdom only. Orders are
        sent via Royal Mail.
      </p>
      <p>
        6.2. Estimated delivery times and costs are shown at checkout. These are
        estimates and are not guaranteed unless stated.
      </p>
      <p>
        6.3. Risk in the goods passes to you on delivery. Ownership passes to you
        once we have received full payment and the goods have been delivered.
      </p>
      <p>
        6.4. If your order has not arrived within a reasonable time, please
        contact us at{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>{" "}
        and we will help resolve it.
      </p>

      <h2>7. Your Right to Cancel (14-Day Cooling-Off Period)</h2>
      <p>
        7.1. Under the Consumer Contracts (Information, Cancellation and
        Additional Charges) Regulations 2013, if you are a consumer you have the
        right to cancel your order within 14 days of receiving the goods, without
        giving a reason.
      </p>
      <p>
        7.2. To cancel, email us at{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>{" "}
        with your order details within the 14-day period. You then have a further
        14 days to return the goods.
      </p>
      <p>
        7.3. You must return the goods in their original condition. For
        change-of-mind returns, you are responsible for the cost of return
        postage. We recommend using a tracked service, as the goods remain your
        responsibility until they reach us.
      </p>
      <p>
        7.4. We will refund you within 14 days of receiving the returned goods
        (or proof that you have sent them back). Refunds are made to your
        original payment method.
      </p>
      <p>
        7.5. We may reduce your refund to reflect any loss in value if the goods
        have been handled more than necessary to inspect them.
      </p>

      <h2>8. Faulty, Damaged, or Misdescribed Goods</h2>
      <p>
        8.1. Under the Consumer Rights Act 2015, goods we supply must be as
        described, fit for purpose, and of satisfactory quality.
      </p>
      <p>
        8.2. If an item is faulty, damaged on arrival, or not as described,
        please contact us within a reasonable time. You may be entitled to a
        repair, replacement, or refund.
      </p>
      <p>
        8.3. We will cover return postage costs for faulty, damaged, or
        misdescribed items.
      </p>
      <p>8.4. Nothing in these Terms affects your statutory rights as a consumer.</p>

      <h2>9. Limitation of Liability</h2>
      <p>
        9.1. We do not exclude or limit our liability where it would be unlawful
        to do so, including liability for death or personal injury caused by our
        negligence, or for fraud.
      </p>
      <p>
        9.2. Nothing in these Terms removes or reduces your statutory rights as a
        consumer. If any clause conflicts with your legal rights, your legal
        rights take precedence.
      </p>
      <p>
        9.3. We are not liable for losses that were not foreseeable, or for
        losses arising from misuse of a product (for example, improper fitting of
        a badge).
      </p>

      <h2>10. Privacy and Data</h2>
      <p>
        10.1. We process your personal data in accordance with our{" "}
        <a href="/privacy">Privacy Policy</a> and UK GDPR. Please review it to
        understand how we collect, use, and protect your information.
      </p>
      <p>
        10.2. Information you provide is used to process your order and, where you
        have consented, to send you marketing communications. You can opt out at
        any time.
      </p>

      <h2>11. Complaints</h2>
      <p>
        If you have a complaint, please email us at{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>{" "}
        and we will do our best to resolve it promptly and fairly.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of England and Wales, and any
        disputes will be subject to the non-exclusive jurisdiction of the courts
        of England and Wales.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. The version in force at the
        time you place your order applies to your purchase.
      </p>

      <p>
        <em>
          These terms are provided as a practical starting template based on UK
          consumer law. They are not a substitute for tailored legal advice. As
          the business grows, it is worth having a solicitor review them.
        </em>
      </p>
    </LegalPage>
  );
}
