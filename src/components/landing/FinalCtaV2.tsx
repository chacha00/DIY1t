import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCtaV2() {
  return (
    <section className="bg-gradient-to-br from-brand-blue-600 via-brand-blue-700 to-brand-teal-600 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/60">Get Started Today</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Your Next Favorite Pet Product<br />Is One Photo Away
        </h2>
        <p className="mt-4 text-lg text-white/70 leading-relaxed">
          Start with three free AI projects. No credit card. No sewing experience required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-brand-blue-700 shadow-xl hover:bg-brand-blue-50 transition-colors"
          >
            Start Building Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            View pricing →
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/50">
          Most members save enough on their first project to pay for an entire year of DIY1T.
        </p>
      </div>
    </section>
  );
}
