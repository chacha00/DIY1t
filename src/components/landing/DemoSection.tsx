"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const STEPS = [
  {
    step: "01",
    label: "Upload a Photo",
    headline: "Snap it. Upload it. Done.",
    desc: "Take a photo of any pet product — harness, bed, sweater, toy, collar — or paste a link from Amazon, Etsy, or Pinterest. DIY Vision™ handles the rest.",
    visual: {
      type: "upload",
      content: null,
    },
    accent: "#10b981",
  },
  {
    step: "02",
    label: "DIY Vision™ Analyzes",
    headline: "It reverse-engineers the product.",
    desc: "DIY Vision™ studies the seams, fabric, hardware, and dimensions. You'll see it working in real time — layer by layer, stitch by stitch.",
    visual: {
      type: "analysis",
      content: null,
    },
    accent: "#059669",
  },
  {
    step: "03",
    label: "Get Your Pattern",
    headline: "Print and cut — ready in seconds.",
    desc: "You get a full printable pattern sized to your pet, a complete materials list with prices, and step-by-step build instructions. Average savings: $47.",
    visual: {
      type: "result",
      content: null,
    },
    accent: "#f59e0b",
  },
];

const ANALYSIS_LINES = [
  { label: "Looking closely at the stitching...", delay: 0 },
  { label: "Identifying fabric type...", delay: 900 },
  { label: "Detecting hardware & closures...", delay: 1800 },
  { label: "Calculating exact dimensions...", delay: 2600 },
  { label: "Figuring out how this was built...", delay: 3400 },
  { label: "Calculating cheapest way to recreate...", delay: 4100 },
];

function UploadVisual() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-48 h-48 rounded-3xl border-4 border-dashed border-ds-emerald-300 bg-ds-emerald-50 flex flex-col items-center justify-center gap-3 shadow-inner">
        <span className="text-5xl">📸</span>
        <p className="text-xs font-semibold text-ds-emerald-700 text-center px-4">Drop a photo or paste a product URL</p>
      </div>
      <div className="flex gap-2 mt-2">
        {["Amazon", "Etsy", "Pinterest"].map((s) => (
          <span key={s} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">{s}</span>
        ))}
      </div>
    </div>
  );
}

function AnalysisVisual() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setVisibleLines([]);
    setDone(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay));
    });
    timers.push(setTimeout(() => setDone(true), 5000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-xs mx-auto rounded-2xl bg-gradient-to-br from-brand-blue-700 to-brand-teal-600 p-5 text-white shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👁️</span>
        <span className="text-sm font-bold">DIY Vision™</span>
        {!done && (
          <span className="ml-auto flex gap-1">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </span>
        )}
        {done && <span className="ml-auto text-xs font-bold text-yellow-300">✓ Done</span>}
      </div>
      <div className="space-y-2">
        {ANALYSIS_LINES.map((line, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all duration-500 ${
              visibleLines.includes(i) ? "bg-white/10 opacity-100" : "opacity-0"
            }`}
          >
            {visibleLines.includes(i) && (
              <span className="text-ds-emerald-400 font-bold shrink-0">✓</span>
            )}
            <span className="text-white/80">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultVisual() {
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {/* Pattern thumbnail */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-ds-emerald-50 border border-ds-emerald-100 flex items-center justify-center text-2xl shrink-0">🧵</div>
        <div>
          <p className="text-sm font-bold text-slate-900">Dog Harness Pattern</p>
          <p className="text-xs text-slate-500 mt-0.5">4 pieces • Beginner • Print-ready</p>
          <span className="mt-1 inline-block rounded-full bg-ds-emerald-100 px-2 py-0.5 text-[10px] font-bold text-ds-emerald-700">PDF Ready</span>
        </div>
      </div>
      {/* Cost comparison */}
      <div className="rounded-2xl bg-gradient-to-r from-ds-emerald-500 to-ds-emerald-700 p-4 text-white flex items-center justify-between">
        <div className="text-center">
          <p className="text-[10px] text-white/60 uppercase tracking-wide">Retail</p>
          <p className="text-lg font-extrabold line-through opacity-60">$65</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/60 uppercase tracking-wide">Your Cost</p>
          <p className="text-lg font-extrabold">$14</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/60 uppercase tracking-wide">You Save</p>
          <p className="text-xl font-extrabold text-yellow-300">$51</p>
        </div>
      </div>
      {/* Materials */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <p className="text-xs font-bold text-slate-700 mb-2">Materials List</p>
        {[
          ["Fleece fabric (1/2 yd)", "$4.50"],
          ["Nylon webbing (2 ft)", "$2.00"],
          ["Buckle + D-rings", "$3.50"],
          ["Thread", "$1.00"],
        ].map(([item, price]) => (
          <div key={item} className="flex justify-between text-xs text-slate-600 py-1 border-b border-slate-50 last:border-0">
            <span>{item}</span>
            <span className="font-semibold">{price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DemoSection() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPlay = () => {
    setPlaying(true);
    setCurrent(0);
  };

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        if (c >= STEPS.length - 1) {
          setPlaying(false);
          clearInterval(timerRef.current!);
          return c;
        }
        return c + 1;
      });
    }, 5500);
    return () => clearInterval(timerRef.current!);
  }, [playing]);

  const prev = () => { setPlaying(false); setCurrent((c) => Math.max(0, c - 1)); };
  const next = () => { setPlaying(false); setCurrent((c) => Math.min(STEPS.length - 1, c + 1)); };

  const step = STEPS[current];

  return (
    <section id="demo" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue-600">60-Second Walkthrough</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            See exactly how it works
          </h2>
          <p className="mt-3 text-base text-slate-500">
            From photo to printable pattern in three steps.
          </p>
        </div>

        {/* Demo player */}
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs font-medium text-slate-400">diy1t.com — DIY Vision™ Demo</span>
            </div>
            <button
              onClick={playing ? () => setPlaying(false) : startPlay}
              className="flex items-center gap-1.5 rounded-full bg-brand-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-blue-700 transition-colors"
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {playing ? "Pause" : "Play"}
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-0 border-b border-slate-100">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setCurrent(i); }}
                className={`flex-1 py-3 px-4 text-xs font-semibold transition-all border-b-2 ${
                  i === current
                    ? "border-brand-blue-500 text-brand-blue-700 bg-brand-blue-50"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="mr-1.5 font-mono text-[10px] opacity-60">{s.step}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 min-h-[360px]">

            {/* Left — text */}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-fit mb-4">
                Step {step.step}
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {step.headline}
              </h3>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                {step.desc}
              </p>

              {/* Nav */}
              <div className="mt-8 flex items-center gap-3">
                <button onClick={prev} disabled={current === 0} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-brand-blue-400 hover:text-brand-blue-600 disabled:opacity-30 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <button key={i} onClick={() => { setPlaying(false); setCurrent(i); }} className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-brand-blue-500" : "w-2 bg-slate-200 hover:bg-slate-300"}`} />
                  ))}
                </div>
                <button onClick={next} disabled={current === STEPS.length - 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-brand-blue-400 hover:text-brand-blue-600 disabled:opacity-30 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right — visual */}
            <div className="flex items-center justify-center bg-slate-50 p-8 border-t border-slate-100 lg:border-t-0 lg:border-l">
              {current === 0 && <UploadVisual />}
              {current === 1 && <AnalysisVisual key={current} />}
              {current === 2 && <ResultVisual />}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
