import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Badge Collective collects, uses and protects your personal information.",
};

// Template content. Owner: review with suitable advice before relying on it.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This policy explains what personal information The Badge Collective
        collects, how we use it, and the choices you have. We only collect what we
        need to run the shop and fulfil your orders.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact details you give us, such as your name, email and phone number.</li>
        <li>Order and delivery details, such as your shipping address.</li>
        <li>Messages you send us by email or WhatsApp.</li>
        <li>Basic, non-identifying usage data that helps the site run.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your information to process and ship orders, to reply to your
        enquiries, and to keep records we are required to keep. We do not sell your
        information.
      </p>

      <h2>Sharing</h2>
      <p>
        We share information only with the services that help us operate, such as
        our payment processor and delivery partners, and only as far as they need
        it to do their job. We may also share information where the law requires.
      </p>

      <h2>Cookies</h2>
      <p>
        We keep cookies to a minimum and use them mainly to remember your bag and
        to keep the site working. We do not use advertising trackers.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK data protection law, you can ask to see the information we hold
        about you, ask us to correct it, or ask us to delete it. To make a request,
        contact us using the details below.
      </p>

      <h2>Retention</h2>
      <p>
        We keep order records for as long as we need them for accounting and legal
        reasons, and no longer than that.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy question or request, email{" "}
        <a href="mailto:thebadgecollectiveuk@gmail.com">
          thebadgecollectiveuk@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
