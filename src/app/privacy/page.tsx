import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | DIY1T",
  description: "How DIY1T collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-slate-400">Last updated: July 4, 2026</p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">

              <section>
                <h2 className="text-base font-bold text-slate-900">1. Who We Are</h2>
                <p className="mt-2">
                  DIY1T (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates diy1t.com, an AI-powered platform that generates DIY build plans from photos. Our contact email is{" "}
                  <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline">info@diy1t.com</a>{" "}
                  and our phone number is{" "}
                  <a href="tel:+15035920808" className="text-brand-blue-600 hover:underline">(503) 592-0808</a>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li><strong>Account information:</strong> Your name and email address when you register.</li>
                  <li><strong>Photos you upload:</strong> Images you submit to generate DIY projects. These are stored securely on Cloudinary.</li>
                  <li><strong>Pet information:</strong> Breed, weight, and measurements you optionally enter in your pet profile.</li>
                  <li><strong>Payment information:</strong> Processed securely by Stripe. We never store your full card number.</li>
                  <li><strong>Usage data:</strong> Pages visited, features used, and project generation history to improve the service.</li>
                  <li><strong>Device information:</strong> Browser type, IP address, and operating system for security and analytics.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">3. How We Use Your Information</h2>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>To generate and deliver your DIY project plans.</li>
                  <li>To process payments and manage your subscription or credit balance.</li>
                  <li>To send you account-related emails (receipts, project notifications, password resets).</li>
                  <li>To improve the AI model and platform features.</li>
                  <li>To respond to your support requests.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">4. Photos and AI Processing</h2>
                <p className="mt-2">
                  Photos you upload are sent to OpenAI&apos;s GPT-4o API for analysis. OpenAI processes these images to generate your DIY plan. We do not use your photos to train AI models. Photos are stored on Cloudinary and linked to your account. We do not sell or share your photos with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">5. Cookies</h2>
                <p className="mt-2">
                  We use essential cookies to keep you logged in and maintain your session. We also use analytics cookies (via Vercel Analytics) to understand how users navigate the site. You can disable non-essential cookies in your browser settings. A cookie notice will appear on your first visit.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">6. Data Sharing</h2>
                <p className="mt-2">We share your data only with the following trusted service providers:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li><strong>Supabase</strong> — database and authentication</li>
                  <li><strong>Cloudinary</strong> — image storage</li>
                  <li><strong>OpenAI</strong> — AI project generation</li>
                  <li><strong>Stripe</strong> — payment processing</li>
                  <li><strong>Vercel</strong> — website hosting and analytics</li>
                </ul>
                <p className="mt-2">We do not sell your personal information to any third party.</p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">7. Data Retention</h2>
                <p className="mt-2">
                  We retain your account data and projects for as long as your account is active. You may request deletion of your account and data at any time by emailing{" "}
                  <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline">info@diy1t.com</a>.
                  Uploaded photos are deleted from storage within 30 days of account deletion.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">8. Your Rights</h2>
                <p className="mt-2">You have the right to:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Access the personal data we hold about you.</li>
                  <li>Correct inaccurate information.</li>
                  <li>Request deletion of your data.</li>
                  <li>Export your project data.</li>
                  <li>Opt out of marketing emails at any time using the unsubscribe link.</li>
                </ul>
                <p className="mt-2">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline">info@diy1t.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">9. Children&apos;s Privacy</h2>
                <p className="mt-2">
                  DIY1T is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">10. Security</h2>
                <p className="mt-2">
                  We use industry-standard security measures including HTTPS encryption, secure authentication via Supabase, and row-level security on all database access. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">11. Governing Law</h2>
                <p className="mt-2">
                  This Privacy Policy is governed by the laws of the State of Oregon, United States.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">12. Changes to This Policy</h2>
                <p className="mt-2">
                  We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the site. Continued use of DIY1T after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">13. Contact</h2>
                <p className="mt-2">
                  Questions about this Privacy Policy? Contact us at{" "}
                  <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline">info@diy1t.com</a>{" "}
                  or{" "}
                  <a href="tel:+15035920808" className="text-brand-blue-600 hover:underline">(503) 592-0808</a>.
                </p>
              </section>

            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
