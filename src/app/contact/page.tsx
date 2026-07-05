import { Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | DIY1T",
  description: "Get in touch with the DIY1T team. We're here to help with your DIY pet project questions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-blue-600">
              Contact Us
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              We&apos;d love to hear from you
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Have a question about a project, need help with your account, or just want to say hi? Reach out — we&apos;re happy to help.
            </p>
          </div>

          {/* Contact cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* Email */}
            <a
              href="mailto:info@diy1t.com"
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-100 group-hover:bg-brand-blue-200 transition">
                <Mail className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Email us</p>
                <p className="mt-1 text-lg font-bold text-slate-900 group-hover:text-brand-blue-600 transition">
                  info@diy1t.com
                </p>
                <p className="mt-1 text-sm text-slate-400">Click to send us an email</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+15035920808"
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-teal-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal-100 group-hover:bg-brand-teal-200 transition">
                <Phone className="h-6 w-6 text-brand-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Call us</p>
                <p className="mt-1 text-lg font-bold text-slate-900 group-hover:text-brand-teal-600 transition">
                  (503) 592-0808
                </p>
                <p className="mt-1 text-sm text-slate-400">Click to call</p>
              </div>
            </a>

            {/* Hours */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-100">
                <Clock className="h-6 w-6 text-brand-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Response time</p>
                <p className="mt-1 text-lg font-bold text-slate-900">Within 24 hours</p>
                <p className="mt-1 text-sm text-slate-400">Monday – Friday</p>
              </div>
            </div>

            {/* Community */}
            <a
              href="/community"
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-orange-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-brand-orange-100 transition">
                <MessageSquare className="h-6 w-6 text-slate-500 group-hover:text-brand-orange-600 transition" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Community</p>
                <p className="mt-1 text-lg font-bold text-slate-900">Browse projects</p>
                <p className="mt-1 text-sm text-slate-400">Get inspired by other makers</p>
              </div>
            </a>
          </div>

          {/* Bottom note */}
          <p className="mt-10 text-center text-sm text-slate-400">
            For billing questions, visit your{" "}
            <a href="/dashboard/billing" className="text-brand-blue-600 hover:underline">
              billing dashboard
            </a>
            . For technical issues, include your project ID in the email so we can look it up quickly.
          </p>
        </div>
      </Container>
    </main>
  );
}
