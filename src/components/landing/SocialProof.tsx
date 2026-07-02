import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const STATS = [
  { value: "$47", label: "Average project savings" },
  { value: "71%", label: "Average cost reduction" },
  { value: "23 min", label: "Average plan generation" },
  { value: "4.9★", label: "Average user rating" },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    pet: "2 dogs — a Corgi and a Labrador",
    emoji: "🐶",
    text: "I uploaded a $65 harness photo and got a complete pattern with every measurement in 30 seconds. Made it for $11. Fits my Corgi perfectly because it used her actual measurements.",
    rating: 5,
  },
  {
    name: "Jamie T.",
    pet: "3 cats",
    emoji: "🐱",
    text: "Finally a tool that gives me a real materials list with amounts, not just 'you'll need some fabric.' The shopping list with cost estimates is exactly what I needed.",
    rating: 5,
  },
  {
    name: "Rachel K.",
    pet: "Quarter Horse",
    emoji: "🐴",
    text: "Horse accessories are so expensive. DIY1T gave me a full leg wrap pattern scaled to my horse's measurements. Saved over $200 on a set of four. The PDF is so clear.",
    rating: 5,
  },
];

const COMMUNITY_BUILDS = [
  { emoji: "🧶", label: "Cable-knit sweater", user: "@crafty.corgi" },
  { emoji: "🦮", label: "Adjustable harness", user: "@diy.dogsofig" },
  { emoji: "🛏️", label: "Bolster dog bed", user: "@paws.and.thread" },
  { emoji: "🎾", label: "Tug toy set", user: "@makerdog" },
  { emoji: "🐱", label: "Cat climbing wall", user: "@catdad.makes" },
  { emoji: "🐴", label: "Saddle pad cover", user: "@stablecrafter" },
];

export function SocialProof() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Community"
          title="Makers love DIY1T"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-soft">
              <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-orange-400 text-brand-orange-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-50 text-lg">
                  {t.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="mb-5 text-center text-sm font-semibold text-slate-400 uppercase tracking-wide">From the Community</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {COMMUNITY_BUILDS.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-soft">
                <span className="text-3xl">{b.emoji}</span>
                <p className="text-xs font-semibold text-slate-700">{b.label}</p>
                <p className="text-xs text-slate-400">{b.user}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
