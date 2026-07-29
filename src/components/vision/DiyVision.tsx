"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Loader2, DollarSign, Clock, Wrench, Sparkles,
  TrendingDown, ChevronRight, RotateCcw, ShoppingBag, Package,
} from "lucide-react";

interface VisionResult {
  product_name: string;
  product_category: string;
  retail_price_low_cents: number;
  retail_price_high_cents: number;
  diy_cost_low_cents: number;
  diy_cost_high_cents: number;
  difficulty: string;
  build_time_minutes: number;
  materials_count: number;
  key_materials: string[];
  savings_headline: string;
  can_diy: boolean;
  cannot_diy_reason?: string;
}

function fmt(cents: number) {
  return `$${Math.round(cents / 100)}`;
}

function fmtRange(low: number, high: number) {
  if (Math.abs(high - low) < 500) return fmt(Math.round((low + high) / 2));
  return `${fmt(low)}–${fmt(high)}`;
}

function fmtTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-teal-100 text-teal-700",
  Intermediate: "bg-orange-100 text-orange-700",
  Advanced: "bg-red-100 text-red-700",
};

export function DiyVision() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePhoto(file: File) {
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      // Upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();
      setPhotoUrl(url);

      // Vision scan
      const scanRes = await fetch("/api/vision-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: url }),
      });
      if (!scanRes.ok) throw new Error("Scan failed");
      const data: VisionResult = await scanRes.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Try a clearer photo of the product.");
    } finally {
      setScanning(false);
    }
  }

  function reset() {
    setPhotoUrl(null);
    setResult(null);
    setError(null);
  }

  function startBuilding() {
    if (!result) return;
    const params = new URLSearchParams({
      vision_product: result.product_name,
      vision_category: result.product_category,
    });
    router.push(`/dashboard/new?${params.toString()}`);
  }

  const savingsCents = result
    ? Math.round((result.retail_price_low_cents + result.retail_price_high_cents) / 2) -
      Math.round((result.diy_cost_low_cents + result.diy_cost_high_cents) / 2)
    : 0;
  const savingsPct = result
    ? Math.round(
        (savingsCents /
          Math.round((result.retail_price_low_cents + result.retail_price_high_cents) / 2)) *
          100
      )
    : 0;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">DIY Vision</h1>
        <p className="mt-1 text-sm text-slate-500">
          Point your camera at any product. See how much you&apos;d save building it yourself.
        </p>
      </div>

      {/* Camera / upload trigger */}
      {!result && (
        <div
          onClick={() => !scanning && fileRef.current?.click()}
          className={`relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all
            ${scanning ? "border-brand-blue-300 bg-brand-blue-50" : "border-slate-200 bg-slate-50 hover:border-brand-blue-300 hover:bg-brand-blue-50/50"}`}
        >
          {photoUrl && !result ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Scanned product" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          ) : null}

          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            {scanning ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue-100">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-brand-blue-700">Analyzing product…</p>
                  <p className="mt-1 text-sm text-brand-blue-500">AI is calculating your savings</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-soft">
                  <Camera className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Take a photo or upload</p>
                  <p className="mt-1 text-sm text-slate-400">Works best with a clear product shot</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handlePhoto(f);
          e.target.value = "";
        }}
      />

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Results card */}
      {result && (
        <div className="space-y-4">
          {/* Product photo + header */}
          <div className="relative overflow-hidden rounded-3xl">
            {photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={result.product_name} className="w-full object-cover" style={{ maxHeight: 220 }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">{result.product_category}</p>
              <p className="mt-0.5 text-xl font-extrabold text-white">{result.product_name}</p>
            </div>
          </div>

          {/* Savings hero */}
          {result.can_diy && (
            <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-brand-blue-600 p-5 text-white">
              <div className="flex items-center gap-2 text-teal-100">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Potential savings</span>
              </div>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-5xl font-extrabold">{fmt(savingsCents)}</span>
                <span className="mb-1.5 text-lg font-bold text-teal-200">({savingsPct}% off)</span>
              </div>
              <p className="mt-2 text-sm text-teal-100">{result.savings_headline}</p>
            </div>
          )}

          {!result.can_diy && (
            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="font-semibold text-slate-700">This one&apos;s tricky to DIY</p>
              <p className="mt-1 text-sm text-slate-500">{result.cannot_diy_reason}</p>
            </div>
          )}

          {/* Price comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Retail price</span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold text-slate-900">
                {fmtRange(result.retail_price_low_cents, result.retail_price_high_cents)}
              </p>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-1.5 text-teal-500">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">DIY cost</span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold text-teal-700">
                {fmtRange(result.diy_cost_low_cents, result.diy_cost_high_cents)}
              </p>
            </div>
          </div>

          {/* Details row */}
          <div className="flex flex-wrap gap-2">
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${DIFFICULTY_COLOR[result.difficulty] ?? "bg-slate-100 text-slate-600"}`}>
              {result.difficulty}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Clock className="h-3 w-3" />
              {fmtTime(result.build_time_minutes)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Wrench className="h-3 w-3" />
              {result.materials_count} materials
            </span>
          </div>

          {/* Key materials */}
          {result.key_materials?.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Key materials</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.key_materials.map((m) => (
                  <span key={m} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3">
            {result.can_diy && (
              <button
                onClick={startBuilding}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-blue-700"
              >
                <Sparkles className="h-4 w-4" />
                Start Building
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Scan another
            </button>
          </div>
        </div>
      )}

      {/* Tip */}
      {!result && !scanning && (
        <div className="rounded-2xl bg-brand-orange-50 px-4 py-3">
          <p className="text-xs font-semibold text-brand-orange-700">💡 Pro tip</p>
          <p className="mt-0.5 text-xs text-brand-orange-600">
            Works great in pet stores, craft stores, or anywhere you see something and think &quot;I could make that.&quot;
          </p>
        </div>
      )}
    </div>
  );
}
