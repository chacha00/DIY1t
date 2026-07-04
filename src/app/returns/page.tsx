import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy — DIY1T",
  description: "DIY1T refund and cancellation policy.",
};

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Return &amp; Refund Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: July 3, 2026</p>

      <div className="prose prose-slate mt-10 max-w-none">
        <h2>Digital Products</h2>
        <p>
          DIY1T sells digital services — AI-generated project guides and credits. Because these are delivered
          instantly and cannot be returned like physical goods, all sales are generally final.
        </p>

        <h2>Credit Purchases</h2>
        <p>
          Credits are non-refundable once purchased. If a generation fails due to a technical error on our
          side, the credit used for that generation will be restored to your account automatically. If it is
          not, contact us within 7 days and we will investigate.
        </p>

        <h2>Subscription Plans</h2>
        <ul>
          <li>
            <strong>Monthly plans</strong> — you may cancel at any time. You will retain access until the end
            of the current billing period. We do not prorate partial months.
          </li>
          <li>
            <strong>Annual plans</strong> — you may cancel at any time. If you cancel within 7 days of your
            initial purchase and have generated fewer than 3 projects, we will issue a full refund upon
            request.
          </li>
        </ul>

        <h2>Requesting a Refund</h2>
        <p>
          To request a refund email{" "}
          <a href="mailto:hello@diy1t.com" className="text-orange-500 underline">
            hello@diy1t.com
          </a>{" "}
          with your account email and a brief description of the issue. We will respond within 2 business days.
        </p>

        <h2>Exceptions</h2>
        <p>
          We reserve the right to refuse refunds where accounts have violated our Terms &amp; Conditions or
          where the request is made in bad faith.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The date at the top of this page will reflect the most
          recent revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions?{" "}
          <a href="mailto:hello@diy1t.com" className="text-orange-500 underline">
            hello@diy1t.com
          </a>
        </p>
      </div>
    </main>
  );
}
