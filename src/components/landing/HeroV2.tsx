"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Play } from "lucide-react";

const STEPS = [
  { label: "Photo uploaded", icon: "📸", delay: 0 },
  { label: "AI detects seams", icon: "🔍", delay: 900 },
  { label: "Measuring dimensions", icon: "📐", delay: 1800 },
  { label: "Pattern generated", icon: "✂️", delay: 2700 },
  { label: "Materials listed", icon: "🧵", delay: 3600 },
];

export function HeroV2() {
  const [activeStep, setActiveStep] = useState(0);
  const [showSavings, setShowSavings] = useState(false);
  const [savingsCount, setSavingsCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => setActiveStep(i), s.delay));
    });
    timers.push(setTimeout(() => setShowSavings(true), 4400));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!showSavings) return;
    let count = 0;
    intervalRef.current = setInterval(() => {
      count += 3;
      if (count >= 79) { setSavingsCount(79); clearInterval(intervalRef.current!); return; }
      setSavingsCount(count);
    }, 18);
    return () => clearInterval(intervalRef.current!);
  }, [showSavings]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-blue-50 pt-16 pb-20 sm:pt-20 sm:pb-28">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-blue-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-brand-teal-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* LEFT */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-xs font-semibold text-brand-orange-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 animate-pulse" />
              AI-Powered Pet DIY — Free to Start
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Stop Paying Retail Prices<br />
              <span className="brand-gradient-text">for Pet Products</span>
            </h1>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Upload a photo of any harness, bed, sweater, toy, or accessory.<br />
              DIY1T instantly creates printable patterns, a shopping list, material costs, and step-by-step instructions.
            </p>

            <ul className="mt-5 space-y-2">
              {["Printable patterns sized to your pet", "Full shopping list with prices", "Step-by-step build instructions", "Average savings: $47 per project"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal-100 text-brand-teal-600 text-xs font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue-200 hover:bg-brand-blue-700 transition-all hover:-translate-y-0.5"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:border-brand-blue-300 hover:text-brand-blue-600 transition-colors"
              >
                <Play className="h-4 w-4 text-brand-orange-500" />
                Watch 60-Second Demo
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <strong className="text-slate-700">4.9/5</strong> rating
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span><strong className="text-slate-700">12,000+</strong> DIY projects generated</span>
              <span className="h-3 w-px bg-slate-200" />
              <span>Average savings <strong className="text-slate-700">$47/project</strong></span>
            </div>
          </div>

          {/* RIGHT — animated flow */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/60">
              {/* Steps */}
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-500 ${
                      i === activeStep
                        ? "bg-brand-blue-50 border border-brand-blue-200 scale-[1.02]"
                        : i < activeStep
                        ? "opacity-60"
                        : "opacity-20"
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className={`text-sm font-semibold ${i === activeStep ? "text-brand-blue-700" : "text-slate-600"}`}>
                      {step.label}
                    </span>
                    {i < activeStep && <span className="ml-auto text-brand-teal-500 text-xs font-bold">✓</span>}
                    {i === activeStep && (
                      <span className="ml-auto flex gap-0.5">
                        {[0,1,2].map(d => (
                          <span key={d} className="h-1.5 w-1.5 rounded-full bg-brand-blue-400 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Savings reveal */}
              <div className={`mt-4 rounded-2xl bg-gradient-to-br from-brand-teal-500 to-brand-blue-600 p-5 text-white transition-all duration-700 ${showSavings ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="grid grid-cols-3 text-center">
                  <div>
                    <p className="text-xs font-medium text-white/70">Retail</p>
                    <p className="mt-1 text-xl font-extrabold line-through opacity-70">$65</p>
                  </div>
                  <div className="border-x border-white/20">
                    <p className="text-xs font-medium text-white/70">DIY Cost</p>
                    <p className="mt-1 text-xl font-extrabold">$14</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">You Save</p>
                    <p className="mt-1 text-2xl font-extrabold text-yellow-300">{savingsCount}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-4 -top-4 rounded-2xl bg-brand-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg rotate-3">
              No sewing exp. needed!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
