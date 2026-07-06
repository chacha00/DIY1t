"use client";

import Image from "next/image";
import { Sparkles, Zap, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  { label: "Upload Photo", icon: "📸", detail: "Dog harness photo" },
  { label: "AI Analyzes", icon: "🔍", detail: "Vision + pattern gen" },
  { label: "Pattern Ready", icon: "📐", detail: "Printable template" },
  { label: "Build It", icon: "✂️", detail: "Step-by-step guide" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-0 sm:pt-24">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-blue-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-brand-orange-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-teal-100 opacity-50 blur-3xl" />
      </div>

      <Container>
        {/* Top text */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge color="teal">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Pet DIY Generator
          </Badge>

          {/* AI badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue-200 bg-brand-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue-600">
              <Zap className="h-3 w-3 fill-brand-blue-500" />
              Powered by AI Vision
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-xs font-semibold text-brand-orange-600">
              <Star className="h-3 w-3 fill-brand-orange-400" />
              4.9 rating
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn Any Pet Product Into a{" "}
            <span className="brand-gradient-text">DIY Project</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            Upload a photo of a harness, dog bed, sweater, leash, toy or pet accessory and receive an original DIY plan with materials, costs, printable templates, and step-by-step instructions.
          </p>

          <p className="mt-3 text-base font-semibold text-slate-700">
            Save up to 80%, customize the fit for your pet, and build with confidence.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href="/register" size="lg">
              <Sparkles className="h-4.5 w-4.5" />
              Start Free — 3 Projects
            </LinkButton>
            <LinkButton href="#examples" variant="outline" size="lg">
              See Real Examples
            </LinkButton>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            No credit card required · Free plan includes 3 complete projects
          </p>
        </div>

        {/* Hero visual — app mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-t-3xl border border-slate-200 bg-white shadow-soft-lg overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-3 flex-1 rounded-full bg-slate-200 px-4 py-1 text-xs text-slate-400">
                diy1t.com/dashboard/new
              </div>
            </div>

            {/* App content */}
            <div className="grid gap-0 lg:grid-cols-2">
              {/* Left: Upload side */}
              <div className="border-r border-slate-100 p-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Your Photo</h3>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/images/harness3.jpg"
                    alt="Chocolate Labradoodle wearing a black padded vest harness"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                      📸 Uploaded: dog-harness3.jpg
                    </span>
                  </div>
                </div>

                {/* AI scanning animation */}
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand-blue-50 p-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-brand-blue-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-brand-blue-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-brand-blue-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <p className="text-xs font-medium text-brand-blue-600">AI analyzing padded vest harness, webbing straps &amp; D-ring placement…</p>
                </div>
              </div>

              {/* Right: Results side */}
              <div className="p-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Your DIY Plan</h3>

                {/* Pattern preview */}
                <div className="relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-100 p-4">
                  {/* Fake pattern lines */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Pattern Pieces — Padded Vest Harness</span>
                    <span className="rounded bg-brand-teal-100 px-2 py-0.5 text-xs font-semibold text-brand-teal-700">PDF Ready</span>
                  </div>
                  <svg viewBox="0 0 280 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Chest panel */}
                    <rect x="10" y="10" width="110" height="70" rx="8" fill="none" stroke="#1267c4" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <text x="65" y="38" textAnchor="middle" fontSize="9" fill="#1267c4" fontWeight="600">CHEST VEST</text>
                    <text x="65" y="50" textAnchor="middle" fontSize="7.5" fill="#64748b">Cut 2 — 12" × 8"</text>
                    <text x="65" y="62" textAnchor="middle" fontSize="7" fill="#94a3b8">Padded mesh + lining</text>
                    {/* Shoulder strap */}
                    <rect x="135" y="15" width="130" height="35" rx="6" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <text x="200" y="30" textAnchor="middle" fontSize="9" fill="#0d9488" fontWeight="600">SHOULDER STRAP</text>
                    <text x="200" y="42" textAnchor="middle" fontSize="7.5" fill="#64748b">Cut 2 — 14" × 1.5"</text>
                    {/* Belly strap */}
                    <rect x="135" y="65" width="130" height="28" rx="6" fill="none" stroke="#fb7e22" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <text x="200" y="81" textAnchor="middle" fontSize="9" fill="#fb7e22" fontWeight="600">BELLY STRAP</text>
                    <text x="200" y="91" textAnchor="middle" fontSize="7.5" fill="#64748b">Cut 1 — 13" × 1.5"</text>
                    {/* Seam allowance note */}
                    <text x="10" y="125" fontSize="6.5" fill="#94a3b8">* All seam allowances ⅝" unless noted</text>
                    <text x="10" y="135" fontSize="6.5" fill="#94a3b8">* Scale to print at 100% — do not resize</text>
                  </svg>
                </div>

                {/* Materials strip */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { label: "Black padded mesh fabric", cost: "$6.50" },
                    { label: "1.5\" gray nylon webbing", cost: "$3.20" },
                    { label: "Side-release buckles ×2", cost: "$2.80" },
                    { label: "Front D-ring + thread", cost: "$2.00" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                      <span className="text-slate-600">{m.label}</span>
                      <span className="font-semibold text-brand-teal-600">{m.cost}</span>
                    </div>
                  ))}
                </div>

                {/* Savings badge */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-teal-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-brand-teal-600">Total DIY Cost</p>
                    <p className="text-lg font-extrabold text-brand-teal-700">$14.50</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Retail price</p>
                    <p className="text-sm font-semibold line-through text-slate-400">$65.00</p>
                  </div>
                  <div className="rounded-xl bg-brand-teal-500 px-3 py-2 text-center text-white">
                    <p className="text-xs font-semibold">You save</p>
                    <p className="text-lg font-extrabold">79%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process steps below mockup */}
        <div className="mx-auto mt-0 max-w-5xl">
          <div className="grid grid-cols-4 divide-x divide-slate-100 rounded-b-3xl border-x border-b border-slate-200 bg-slate-50">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-1 px-4 py-4 text-center">
                <span className="text-xl">{step.icon}</span>
                <p className="text-xs font-bold text-slate-700">{step.label}</p>
                <p className="text-xs text-slate-400">{step.detail}</p>
                {i < STEPS.length - 1 && (
                  <div className="absolute hidden" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-8 pb-12 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-500">
          {["🐶 Harnesses", "🛏️ Dog Beds", "🧶 Sweaters", "🎾 Toys", "🦮 Leashes", "🐱 Cat Accessories", "🐴 Horse Gear"].map(l => (
            <span key={l} className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-soft">{l}</span>
          ))}
        </div>
      </Container>
    </section>
  );
}
