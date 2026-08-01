"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EXAMPLES = [
  {
    name: "Dog Harness",
    emoji: "🐕",
    retailPrice: 65,
    diyPrice: 14,
    retailLabel: "Kong Comfort Harness",
    diyLabel: "Fleece + nylon webbing",
    difficulty: "Beginner",
    buildTime: "2 hrs",
    retailBg: "from-slate-100 to-slate-200",
    retailAccent: "#64748b",
    diyBg: "from-ds-emerald-50 to-ds-emerald-100",
    diyAccent: "#10b981",
  },
  {
    name: "Pet Bed",
    emoji: "🛏️",
    retailPrice: 95,
    diyPrice: 22,
    retailLabel: "FurHaven Calming Donut Bed",
    diyLabel: "Sherpa fleece + memory foam",
    difficulty: "Beginner",
    buildTime: "3 hrs",
    retailBg: "from-slate-100 to-slate-200",
    retailAccent: "#64748b",
    diyBg: "from-ds-emerald-50 to-ds-emerald-100",
    diyAccent: "#10b981",
  },
  {
    name: "Cat Sweater",
    emoji: "🐈",
    retailPrice: 42,
    diyPrice: 9,
    retailLabel: "Frisco Knit Turtleneck",
    diyLabel: "Acrylic yarn, size 6 needles",
    difficulty: "Intermediate",
    buildTime: "4 hrs",
    retailBg: "from-slate-100 to-slate-200",
    retailAccent: "#64748b",
    diyBg: "from-ds-emerald-50 to-ds-emerald-100",
    diyAccent: "#10b981",
  },
  {
    name: "Leash & Collar",
    emoji: "🦮",
    retailPrice: 38,
    diyPrice: 8,
    retailLabel: "Ruffwear Flat Out Collar",
    diyLabel: "Nylon webbing + brass hardware",
    difficulty: "Beginner",
    buildTime: "1 hr",
    retailBg: "from-slate-100 to-slate-200",
    retailAccent: "#64748b",
    diyBg: "from-ds-emerald-50 to-ds-emerald-100",
    diyAccent: "#10b981",
  },
];

function ProductCard({
  example,
}: {
  example: (typeof EXAMPLES)[0];
}) {
  const saved = example.retailPrice - example.diyPrice;
  const pct = Math.round((saved / example.retailPrice) * 100);

  return (
    <div className="group rounded-[24px] border border-slate-100 bg-white shadow-soft overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      {/* Photos side by side */}
      <div className="grid grid-cols-2">
        {/* Retail photo */}
        <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${example.retailBg} px-4 py-8 min-h-[160px]`}>
          <div className="absolute top-2 left-2">
            <span className="rounded-full bg-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-white">RETAIL</span>
          </div>
          <span className="text-5xl grayscale">{example.emoji}</span>
          <p className="mt-2 text-center text-[10px] text-slate-500 leading-tight px-1">{example.retailLabel}</p>
          <p className="mt-1.5 text-lg font-extrabold text-slate-700">${example.retailPrice}</p>
        </div>

        {/* DIY photo */}
        <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${example.diyBg} px-4 py-8 min-h-[160px]`}>
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-ds-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">DIY</span>
          </div>
          <span className="text-5xl">{example.emoji}</span>
          <p className="mt-2 text-center text-[10px] text-ds-emerald-700 leading-tight px-1">{example.diyLabel}</p>
          <p className="mt-1.5 text-lg font-extrabold text-ds-emerald-700">${example.diyPrice}</p>
        </div>
      </div>

      {/* Savings strip */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-ds-emerald-600 px-5 py-3">
        <div>
          <p className="text-xs font-semibold text-white/70">{example.name}</p>
          <p className="text-xs text-white/60">{example.difficulty} · {example.buildTime}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-yellow-300">Saved ${saved}</p>
          <p className="text-[10px] text-white/60">{pct}% off retail</p>
        </div>
      </div>
    </div>
  );
}

export function SeeItBuilt() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue-600">See It Built</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Retail vs. DIY — side by side
          </h2>
          <p className="mt-3 text-base text-slate-500">
            The same product. A fraction of the price. Made by you.
          </p>
        </div>

        {/* Tab selector (mobile) */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 sm:hidden scrollbar-none">
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                i === active ? "bg-brand-blue-600 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="sm:hidden">
          <ProductCard example={EXAMPLES[active]} />
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXAMPLES.map((example, i) => (
            <ProductCard key={i} example={example} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Upload a photo of <em>any</em> pet product and DIY Vision™ will show you how to make it.
          </p>
          <Link
            href="/register"
            className="ds-btn-primary inline-flex"
          >
            See what you can build
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
