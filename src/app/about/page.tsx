import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hammer, Scissors, Heart, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | DIY1T",
  description: "Learn about DIY1T — the AI-powered platform that turns photos into step-by-step DIY pet project plans.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl space-y-10">

          {/* Hero */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue-500">
              <Hammer className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              See It. Build It. Make It Yourself.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              DIY1T is an AI-powered platform that turns any photo of a pet item into a complete, step-by-step DIY build plan — so anyone can make quality pet gear on a budget.
            </p>
          </div>

          {/* Mission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Pet supplies are expensive. A simple harness can cost $60. A dog bed can run $100 or more. We believe pet owners shouldn&apos;t have to choose between quality gear and their budget.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              DIY1T makes it possible for anyone — beginner or experienced maker — to recreate high-quality pet items at home for a fraction of the retail price. Upload a photo, get a professional build plan, and start making.
            </p>
          </div>

          {/* What we do */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">What DIY1T Does</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: <Zap className="h-5 w-5 text-brand-blue-600" />,
                  bg: "bg-brand-blue-100",
                  title: "AI-Powered Analysis",
                  body: "Our AI examines your photo to identify the construction method — sewing, knitting, or crochet — and generates instructions that match exactly what is in the image.",
                },
                {
                  icon: <Scissors className="h-5 w-5 text-brand-teal-600" />,
                  bg: "bg-brand-teal-100",
                  title: "Complete Build Plans",
                  body: "Every project includes a materials list with prices, pattern pieces with dimensions, step-by-step instructions, and a size chart for your pet.",
                },
                {
                  icon: <Heart className="h-5 w-5 text-brand-orange-600" />,
                  bg: "bg-brand-orange-100",
                  title: "Made for Pet Owners",
                  body: "Add your pet&apos;s measurements and the AI customizes the pattern to fit. From harnesses to beds to sweaters — if it exists, you can build it.",
                },
                {
                  icon: <Hammer className="h-5 w-5 text-slate-600" />,
                  bg: "bg-slate-100",
                  title: "Budget Friendly",
                  body: "Most projects cost $5–$40 in materials. The average DIY1T user saves 70% compared to buying the same item at retail.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Get in Touch</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              We love hearing from our community of makers. Whether you have a question, a project to share, or feedback on how we can improve — reach out anytime.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>📧 <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline">info@diy1t.com</a></p>
              <p>📞 <a href="tel:+15035920808" className="text-brand-blue-600 hover:underline">(503) 592-0808</a></p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-brand-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-600 transition">
                Contact Us
              </Link>
              <Link href="/faq" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Read FAQ
              </Link>
              <Link href="/register" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Start Free
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </main>
  );
}
