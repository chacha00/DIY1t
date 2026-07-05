import { BackBar } from "@/components/ui/BackBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — DIY1T",
  description: "Terms and conditions for using DIY1T.",
};

export default function TermsPage() {
  return (
    <>
      <BackBar />
      <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: July 3, 2026</p>

      <div className="prose prose-slate mt-10 max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using DIY1T (&quot;Service&quot;) at diy1t.com you agree to be bound by these Terms &amp;
          Conditions. If you do not agree, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          DIY1T provides AI-generated do-it-yourself project guides based on images you upload. The guides are
          for informational and educational purposes only. We do not guarantee that any project will be
          completed successfully or safely by any particular user.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 13 years old to use this Service. By using the Service you represent that you
          meet this age requirement.
        </p>

        <h2>4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all
          activity that occurs under your account. Notify us immediately at info@diy1t.com if you suspect
          unauthorized access.
        </p>

        <h2>5. Credits and Subscriptions</h2>
        <p>
          Credits purchased are non-transferable and expire as described at the time of purchase. Subscription
          plans renew automatically at the end of each billing period unless cancelled. You may cancel at any
          time through your billing dashboard.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          DIY1T and its original content, features, and functionality are owned by DIY1T and protected by
          copyright and other intellectual property laws. AI-generated project guides are provided for your
          personal, non-commercial use. You may not resell, reproduce, or distribute generated content without
          written permission.
        </p>

        <h2>7. User-Uploaded Content</h2>
        <p>
          You retain ownership of images you upload. By uploading an image you grant DIY1T a limited licence
          to process the image solely for the purpose of generating your project guide. We do not sell or share
          your images with third parties.
        </p>

        <h2>8. Prohibited Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Upload images that contain illegal content or infringe third-party rights.</li>
          <li>Use the Service to generate guides for illegal or harmful projects.</li>
          <li>Attempt to reverse-engineer, scrape, or abuse the platform.</li>
          <li>Resell or redistribute AI-generated content commercially.</li>
        </ul>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranties of any kind. AI-generated guides may
          contain errors. Always exercise independent judgment and consult qualified professionals before
          undertaking any construction, electrical, plumbing, or other potentially hazardous project.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, DIY1T shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising from your use of the Service or any project
          undertaken in reliance on generated guides.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Oregon, United States, without regard to its
          conflict-of-law provisions.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. We will notify you of material changes by posting the
          updated Terms on this page and updating the date above. Continued use of the Service after changes
          constitutes acceptance.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:info@diy1t.com" className="text-orange-500 underline">
            info@diy1t.com
          </a>
          .
        </p>
      </div>
    </main>
    </>
  );
}
