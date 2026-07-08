"use client";

import { useState, useCallback } from "react";
import { Calculator, TrendingUp, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

const PLATFORMS = [
  { id: "etsy", label: "Etsy", txnRate: 0.065, fixed: 0.20, paymentRate: 0.03 },
  { id: "amazon", label: "Amazon Handmade", txnRate: 0.15, fixed: 0, paymentRate: 0 },
  { id: "none", label: "Direct / no platform", txnRate: 0, fixed: 0, paymentRate: 0 },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface Props {
  materialCostCents: number;
  estimatedTimeMinutes: number;
  title: string;
}

export function PricingCalculator({ materialCostCents, estimatedTimeMinutes, title }: Props) {
  const [hourlyRate, setHourlyRate] = useState(25);
  const [marginPct, setMarginPct] = useState(30);
  const [shippingDollars, setShippingDollars] = useState(6);
  const [platform, setPlatform] = useState<PlatformId>("etsy");
  const [copied, setCopied] = useState(false);

  const plat = PLATFORMS.find(p => p.id === platform)!;
  const materialDollars = materialCostCents / 100;
  const laborDollars = (hourlyRate * estimatedTimeMinutes) / 60;
  const subtotal = materialDollars + laborDollars + shippingDollars;
  const fees = plat.fixed + subtotal * (plat.txnRate + plat.paymentRate);
  const breakEven = subtotal + fees;
  const margin = marginPct / 100;

  const standardPrice = Math.round(breakEven / (1 - margin) * 100) / 100;
  const valuePrice = Math.round(breakEven / (1 - Math.max(0.08, margin - 0.12)) * 100) / 100;
  const premiumPrice = Math.round(breakEven / (1 - Math.min(0.72, margin + 0.14)) * 100) / 100;

  const standardMarginActual = Math.round((1 - breakEven / standardPrice) * 100);
  const valueMarginActual = Math.round((1 - breakEven / valuePrice) * 100);
  const premiumMarginActual = Math.round((1 - breakEven / premiumPrice) * 100);

  const earnPerSale = (standardPrice - breakEven).toFixed(2);
  const earnPerMonth10 = ((standardPrice - breakEven) * 10).toFixed(0);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(`$${standardPrice.toFixed(2)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [standardPrice]);

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <Calculator className="h-4.5 w-4.5 text-brand-blue-500" />
        Pricing calculator
        <span className="ml-auto rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-700">
          Pro
        </span>
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">Set your hourly rate and margin to find the right sell price for <span className="font-medium text-slate-600">{title}</span>.</p>

      <div className="mt-5 space-y-4">
        {/* Sliders */}
        {[
          { id: "rate", label: "Hourly rate", min: 10, max: 100, step: 1, val: hourlyRate, set: setHourlyRate, display: `$${hourlyRate}/hr` },
          { id: "margin", label: "Target margin", min: 10, max: 70, step: 1, val: marginPct, set: setMarginPct, display: `${marginPct}%` },
          { id: "shipping", label: "Shipping cost", min: 0, max: 40, step: 1, val: shippingDollars, set: setShippingDollars, display: `$${shippingDollars}` },
        ].map(({ id, label, min, max, step, val, set, display }) => (
          <div key={id}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{label}</span>
              <span className="font-semibold text-slate-700">{display}</span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(+e.target.value)}
              className="w-full accent-brand-blue-600"
            />
          </div>
        ))}

        {/* Platform */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Selling platform</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  platform === p.id
                    ? "bg-brand-blue-100 text-brand-blue-700"
                    : "border border-slate-200 text-slate-500 hover:border-brand-blue-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="mt-5 space-y-1.5 rounded-2xl bg-slate-50 px-4 py-3 text-xs">
        {[
          ["Materials", fmt(materialCostCents)],
          ["Labor", `$${laborDollars.toFixed(2)}`],
          ["Shipping", `$${shippingDollars.toFixed(2)}`],
          ["Platform fees", `$${fees.toFixed(2)}`],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between text-slate-500">
            <span>{label}</span><span>{val}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-200 pt-1.5 font-semibold text-slate-700">
          <span>Break-even</span><span>${breakEven.toFixed(2)}</span>
        </div>
      </div>

      {/* Price tiers */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Value", price: valuePrice, margin: valueMarginActual, active: false },
          { label: "Standard", price: standardPrice, margin: standardMarginActual, active: true },
          { label: "Premium", price: premiumPrice, margin: premiumMarginActual, active: false },
        ].map(({ label, price, margin: m, active }) => (
          <div
            key={label}
            className={`rounded-2xl border p-3 text-center ${
              active
                ? "border-brand-blue-300 bg-brand-blue-50"
                : "border-slate-100 bg-white"
            }`}
          >
            <p className={`text-xs font-semibold ${active ? "text-brand-blue-600" : "text-slate-400"}`}>
              {label}{active ? " ✓" : ""}
            </p>
            <p className={`mt-0.5 text-lg font-bold ${active ? "text-brand-blue-700" : "text-slate-700"}`}>
              ${price.toFixed(0)}
            </p>
            <p className={`text-[11px] ${active ? "text-brand-blue-500" : "text-slate-400"}`}>{m}% margin</p>
          </div>
        ))}
      </div>

      {/* Earnings summary */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
        <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-xs text-emerald-700">
          At ${standardPrice.toFixed(2)} standard price — you earn <strong>${earnPerSale}</strong> per sale.
          At 10 sales/month that&apos;s <strong>${earnPerMonth10}</strong>.
        </p>
        <button onClick={copy} className="ml-auto shrink-0 text-emerald-600 hover:text-emerald-800">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </Card>
  );
}
