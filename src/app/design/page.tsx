import Link from "next/link";
import { ArrowRight, Play, Star, Zap, Heart, Shield, Sparkles } from "lucide-react";
import { ButtonV2 } from "@/components/dsv2/ButtonV2";
import { CardV2 } from "@/components/dsv2/CardV2";

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ds-slate-50)", color: "var(--ds-slate-900)", fontFamily: "var(--font-sans)" }}>

      {/* Header bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-ds-emerald-500 px-2.5 py-1 text-xs font-bold text-white" style={{ background: "var(--ds-emerald-500)" }}>V2 Preview</span>
          <span className="text-sm font-semibold text-slate-700">DIY1T Design System V2</span>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-700">← V1 (current)</Link>
          <span className="text-xs text-slate-300">|</span>
          <span className="text-xs font-semibold text-emerald-600" style={{ color: "var(--ds-emerald-600)" }}>V2 (preview)</span>
        </div>
      </div>

      {/* ── SECTION: Colors ── */}
      <Section title="Color Palette" subtitle="Emerald primary · Amber accent · Slate neutrals">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {[
            { name: "Emerald 500", hex: "#10B981", var: "--ds-emerald-500", text: "white" },
            { name: "Emerald 600", hex: "#059669", var: "--ds-emerald-600", text: "white" },
            { name: "Emerald 100", hex: "#D1FAE5", var: "--ds-emerald-100", text: "#047857" },
            { name: "Amber 500", hex: "#F59E0B", var: "--ds-amber-500", text: "white" },
            { name: "Slate 900", hex: "#0F172A", var: "--ds-slate-900", text: "white" },
            { name: "Slate 200", hex: "#E2E8F0", var: "--ds-slate-200", text: "#0f172a" },
            { name: "Off-white", hex: "#F8FAFC", var: "--ds-slate-50", text: "#0f172a", border: true },
          ].map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-16" style={{ background: `var(${c.var})`, border: c.border ? "1px solid #e2e8f0" : undefined }} />
              <div className="bg-white p-3">
                <p className="text-xs font-bold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION: Typography ── */}
      <Section title="Typography" subtitle="Bold headlines · Short paragraphs · Generous whitespace" bg="white">
        <div className="space-y-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Hero Headline</p>
            <p className="text-5xl font-extrabold tracking-tight" style={{ color: "var(--ds-slate-900)", lineHeight: 1.1 }}>
              Turn Any Pet Product<br /><span className="ds-gradient-text">Into a DIY Project</span>
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Supporting Headline</p>
            <p className="text-2xl font-bold" style={{ color: "var(--ds-slate-800)" }}>AI that turns photos into professional DIY plans in under a minute.</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Body Text</p>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: "var(--ds-slate-600)" }}>
              Upload a photo of any harness, dog bed, sweater, toy, or accessory. DIY Vision™ analyzes construction, materials, and dimensions — then generates a complete build plan with printable patterns.
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Caption / Label</p>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ds-emerald-600)" }}>AI-Powered Pet DIY</p>
          </div>
        </div>
      </Section>

      {/* ── SECTION: Buttons ── */}
      <Section title="Buttons" subtitle="52px height · 16px radius · 200ms hover lift">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonV2 href="/register" variant="primary">
            Start Free <ArrowRight className="h-4 w-4" />
          </ButtonV2>
          <ButtonV2 href="#" variant="secondary">
            <Play className="h-4 w-4" style={{ color: "var(--ds-emerald-500)" }} />
            Watch Demo
          </ButtonV2>
          <ButtonV2 href="/pricing" variant="amber">
            <Sparkles className="h-4 w-4" />
            Go Pro
          </ButtonV2>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Comparison</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs text-slate-500">V1 (current)</p>
              <div className="flex gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-700 transition-colors">
                  Start Free
                </Link>
                <Link href="#" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-blue-300 transition-colors">
                  Watch Demo
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-slate-500">V2 (new)</p>
              <div className="flex gap-3">
                <ButtonV2 href="/register" variant="primary" className="!h-10 !px-5 !text-sm">Start Free</ButtonV2>
                <ButtonV2 href="#" variant="secondary" className="!h-10 !px-5 !text-sm">Watch Demo</ButtonV2>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION: Cards ── */}
      <Section title="Cards" subtitle="20px radius · Soft shadow · Hover lift + shadow" bg="white">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: "💰", title: "Save Money", desc: "See exactly how much you'll save before buying a single piece of fabric.", color: "var(--ds-emerald-50)", iconBg: "var(--ds-emerald-100)", iconColor: "var(--ds-emerald-700)" },
            { icon: "⚡", title: "Save Time", desc: "Skip hours of searching YouTube and Pinterest. Get a complete plan in 60 seconds.", color: "var(--ds-amber-50)", iconBg: "var(--ds-amber-100)", iconColor: "var(--ds-amber-600)" },
            { icon: "📏", title: "Perfect Fit", desc: "Every pattern scales to your pet's exact measurements. No guessing.", color: "#f0fdf4", iconBg: "var(--ds-emerald-100)", iconColor: "var(--ds-emerald-700)" },
          ].map((c) => (
            <CardV2 key={c.title} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: c.iconBg }}>
                {c.icon}
              </div>
              <h3 className="font-bold" style={{ color: "var(--ds-slate-900)" }}>{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ds-slate-500)" }}>{c.desc}</p>
            </CardV2>
          ))}
        </div>
      </Section>

      {/* ── SECTION: Hero V2 mockup ── */}
      <Section title="Hero Section" subtitle="Left: headline + CTA · Right: animated AI flow">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
          {/* Nav strip */}
          <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
            <span className="text-lg font-extrabold tracking-tight" style={{ color: "var(--ds-slate-900)" }}>
              DIY1T<span style={{ color: "var(--ds-emerald-500)" }}>.</span>
            </span>
            <div className="hidden items-center gap-6 text-sm font-medium sm:flex" style={{ color: "var(--ds-slate-600)" }}>
              {["Features", "Examples", "Pricing", "Community", "Blog"].map(l => <span key={l}>{l}</span>)}
            </div>
            <div className="flex gap-2">
              <span className="rounded-xl border border-slate-200 px-4 py-1.5 text-sm font-semibold" style={{ color: "var(--ds-slate-700)" }}>Log In</span>
              <span className="rounded-xl px-4 py-1.5 text-sm font-bold text-white" style={{ background: "var(--ds-emerald-500)" }}>Start Free</span>
            </div>
          </div>

          {/* Hero body */}
          <div className="grid items-center gap-8 px-8 py-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--ds-emerald-50)", color: "var(--ds-emerald-700)", border: "1px solid var(--ds-emerald-200)" }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--ds-emerald-500)" }} />
                AI-Powered Pet DIY — Free to Start
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight" style={{ color: "var(--ds-slate-900)" }}>
                Stop Paying Retail Prices<br />
                <span className="ds-gradient-text">for Pet Products</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--ds-slate-500)" }}>
                Upload a photo. Get printable patterns, shopping list, material costs, and step-by-step instructions in under 60 seconds.
              </p>
              <div className="mt-6 flex gap-3">
                <span className="ds-btn-primary cursor-default">Start Free <ArrowRight className="inline h-4 w-4" /></span>
                <span className="ds-btn-secondary cursor-default"><Play className="inline h-4 w-4" style={{ color: "var(--ds-emerald-500)" }} /> Watch Demo</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--ds-slate-400)" }}>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> <strong style={{ color: "var(--ds-slate-700)" }}>4.9/5</strong></span>
                <span><strong style={{ color: "var(--ds-slate-700)" }}>12,000+</strong> projects</span>
                <span>Avg. savings <strong style={{ color: "var(--ds-slate-700)" }}>$47</strong></span>
              </div>
            </div>

            {/* Animated mockup */}
            <div className="rounded-2xl p-5 shadow-inner" style={{ background: "var(--ds-slate-50)" }}>
              <div className="space-y-2.5">
                {["📸 Photo uploaded", "🔍 AI detects seams", "📐 Measuring dimensions", "✂️ Pattern generated", "🧵 Materials listed"].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm" style={{
                    background: i === 3 ? "var(--ds-emerald-50)" : "white",
                    border: i === 3 ? "1px solid var(--ds-emerald-200)" : "1px solid var(--ds-slate-100)",
                    color: i === 3 ? "var(--ds-emerald-700)" : "var(--ds-slate-600)",
                    fontWeight: i === 3 ? 700 : 400,
                  }}>{s}{i < 3 && <span className="ml-auto text-xs" style={{ color: "var(--ds-emerald-500)" }}>✓</span>}</div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, var(--ds-emerald-500), var(--ds-emerald-700))" }}>
                <div className="grid grid-cols-3 text-center text-sm">
                  <div><p className="text-xs opacity-70">Retail</p><p className="font-bold line-through opacity-70">$65</p></div>
                  <div className="border-x border-white/20"><p className="text-xs opacity-70">DIY</p><p className="font-bold">$14</p></div>
                  <div><p className="text-xs opacity-70">Save</p><p className="text-lg font-extrabold text-yellow-300">79%</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION: Animations spec ── */}
      <Section title="Animation Language" subtitle="Purposeful motion that communicates progress" bg="white">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { title: "Upload", steps: ["Photo scales in gently", "Border glows emerald", "Checkmark appears"], icon: "📤" },
            { title: "AI Analysis", steps: ["✓ Detecting materials", "✓ Measuring dimensions", "✓ Creating pattern", "✓ Calculating cost", "✓ Optimizing fit"], icon: "🔍" },
            { title: "Results", steps: ["Pattern fades in", "Materials fades in", "Savings counter", "Instructions slide up", "Download pulses"], icon: "✨" },
          ].map((a) => (
            <CardV2 key={a.title} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <p className="font-bold" style={{ color: "var(--ds-slate-900)" }}>{a.title}</p>
              </div>
              <ul className="space-y-1.5">
                {a.steps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm" style={{ color: "var(--ds-slate-500)" }}>
                    <span className="mt-0.5 text-xs" style={{ color: "var(--ds-emerald-500)" }}>→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardV2>
          ))}
        </div>
      </Section>

      {/* ── SECTION: Brand voice ── */}
      <Section title="Brand Voice" subtitle="Intelligent · Friendly · Encouraging">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "❌ Before (generic)", text: "AI analyzing image…", bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
            { label: "✅ After (V2 voice)", text: "DIY Vision is analyzing your project…", bg: "var(--ds-emerald-50)", border: "var(--ds-emerald-200)", color: "var(--ds-emerald-700)" },
            { label: "❌ Before", text: "Project generated successfully.", bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
            { label: "✅ After", text: "Great choice! We found a way to build this for about $14 instead of $65.", bg: "var(--ds-emerald-50)", border: "var(--ds-emerald-200)", color: "var(--ds-emerald-700)" },
          ].map((v) => (
            <div key={v.label} className="rounded-2xl border p-4" style={{ background: v.bg, borderColor: v.border }}>
              <p className="mb-1 text-xs font-semibold" style={{ color: v.color }}>{v.label}</p>
              <p className="text-sm font-medium" style={{ color: v.color }}>"{v.text}"</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-8 py-6 text-center text-xs" style={{ color: "var(--ds-slate-400)" }}>
        Design System V2 Preview — not live yet. <Link href="/" className="font-semibold" style={{ color: "var(--ds-emerald-600)" }}>View live site →</Link>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, bg }: { title: string; subtitle: string; children: React.ReactNode; bg?: string }) {
  return (
    <section className="ds-section px-4 sm:px-8" style={{ background: bg ?? "var(--ds-slate-50)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ds-emerald-600)" }}>{title}</p>
          <p className="mt-1 text-2xl font-extrabold" style={{ color: "var(--ds-slate-900)" }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
