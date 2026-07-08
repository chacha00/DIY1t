"use client";

import { useState } from "react";
import { Copy, Check, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Stats {
  total_clicks: number;
  total_signups: number;
  total_conversions: number;
  total_earned_cents: number;
  pending_cents: number;
  this_month_cents: number;
  this_month_conversions: number;
}

interface Referral {
  id: string;
  clicked_at: string;
  signed_up_at: string | null;
  converted_at: string | null;
  plan: string | null;
  commission_cents: number | null;
  paid_at: string | null;
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function dateStr(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color ?? "text-slate-900"}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

const COMMISSION_TIERS = [
  { label: "Standard", rate: 20, range: "1–9 referrals/mo" },
  { label: "Silver", rate: 25, range: "10–24 referrals/mo" },
  { label: "Gold", rate: 30, range: "25+ referrals/mo" },
];

export function AffiliateDashboard({ code, referralUrl, stats, recent }: {
  code: string;
  referralUrl: string;
  stats: Stats;
  recent: Referral[];
}) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const conversionRate = stats.total_signups > 0
    ? Math.round((stats.total_conversions / stats.total_signups) * 100)
    : 0;

  const currentTierIdx =
    stats.this_month_conversions >= 25 ? 2 :
    stats.this_month_conversions >= 10 ? 1 : 0;

  return (
    <div className="space-y-6">
      {/* Referral link */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">Your referral link</h2>
        <p className="mt-0.5 text-xs text-slate-400">Share this link. When someone signs up and subscribes, you earn a commission on their first month.</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="flex-1 truncate font-mono text-sm text-slate-600">{referralUrl}</span>
          <button
            onClick={copyLink}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-blue-700"
          >
            {copied ? <><Check className="h-3 w-3" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Instagram caption", prompt: `Write 3 Instagram captions for sharing my DIY1T referral link. My link is ${referralUrl}. Make them feel authentic, not spammy — focus on the value of AI-generated DIY pet projects.` },
            { label: "Email to list", prompt: `Write a short email I can send to my newsletter subscribers introducing DIY1T with my referral link ${referralUrl}. Keep it personal and honest, about 150 words.` },
            { label: "Pinterest description", prompt: `Write a Pinterest pin description for a DIY pet project board, mentioning DIY1T and my referral link ${referralUrl}. Under 500 characters.` },
          ].map(({ label, prompt }) => (
            <button
              key={label}
              onClick={() => {
                const a = document.createElement("a");
                a.href = "#";
                // Use sendPrompt if available (inside Claude widget) or just copy
                if (typeof (window as unknown as { sendPrompt?: (s: string) => void }).sendPrompt === "function") {
                  (window as unknown as { sendPrompt: (s: string) => void }).sendPrompt(prompt);
                } else {
                  navigator.clipboard.writeText(prompt);
                  alert("Prompt copied — paste into Claude to generate the copy.");
                }
              }}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:border-brand-blue-300 hover:text-brand-blue-600 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total earned" value={fmt(stats.total_earned_cents)} sub="all time" />
        <StatCard label="This month" value={fmt(stats.this_month_cents)} color="text-emerald-600" sub={`${stats.this_month_conversions} conversions`} />
        <StatCard label="Pending payout" value={fmt(stats.pending_cents)} sub="processed Aug 1" />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} sub={`${stats.total_signups} signups → ${stats.total_conversions} paid`} />
      </div>

      {/* Funnel */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">Referral funnel</h2>
        {[
          { label: "Link clicks", icon: TrendingUp, val: stats.total_clicks, max: stats.total_clicks || 1 },
          { label: "Signups", icon: Users, val: stats.total_signups, max: stats.total_clicks || 1 },
          { label: "Paid conversions", icon: DollarSign, val: stats.total_conversions, max: stats.total_clicks || 1 },
        ].map(({ label, icon: Icon, val, max }) => (
          <div key={label} className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500"><Icon className="h-3.5 w-3.5" />{label}</span>
              <span className="font-semibold text-slate-700">{val}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-blue-500 transition-all"
                style={{ width: `${Math.round((val / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Commission tiers */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">Commission tiers</h2>
        <div className="grid grid-cols-3 gap-3">
          {COMMISSION_TIERS.map((tier, i) => (
            <div
              key={tier.label}
              className={`rounded-2xl border p-4 text-center ${
                i === currentTierIdx
                  ? "border-brand-blue-300 bg-brand-blue-50"
                  : "border-slate-100"
              }`}
            >
              {i === currentTierIdx && (
                <span className="mb-2 inline-block rounded-full bg-brand-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue-600">
                  Your tier
                </span>
              )}
              <p className={`text-xs font-semibold ${i === currentTierIdx ? "text-brand-blue-500" : "text-slate-400"}`}>
                {tier.label}
              </p>
              <p className={`mt-1 text-2xl font-bold ${i === currentTierIdx ? "text-brand-blue-700" : "text-slate-700"}`}>
                {tier.rate}%
              </p>
              <p className={`mt-0.5 text-[11px] ${i === currentTierIdx ? "text-brand-blue-400" : "text-slate-400"}`}>
                {tier.range}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Earn {COMMISSION_TIERS[currentTierIdx].rate}% of the first month&apos;s revenue for each subscriber you refer.
          Minimum payout $20 · processed monthly on the 1st · 30-day attribution cookie.
        </p>
      </Card>

      {/* Recent referrals table */}
      {recent.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 text-base font-bold text-slate-900">Recent referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="pb-2 font-medium">Clicked</th>
                  <th className="pb-2 font-medium">Signed up</th>
                  <th className="pb-2 font-medium">Converted</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium text-right">Commission</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent.map(r => (
                  <tr key={r.id}>
                    <td className="py-2.5 text-slate-500">{dateStr(r.clicked_at)}</td>
                    <td className="py-2.5 text-slate-500">{dateStr(r.signed_up_at)}</td>
                    <td className="py-2.5 text-slate-500">{dateStr(r.converted_at)}</td>
                    <td className="py-2.5 text-slate-600">{r.plan ?? "—"}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-700">
                      {r.commission_cents != null ? fmt(r.commission_cents) : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      {r.paid_at ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Paid</span>
                      ) : r.converted_at ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Pending</span>
                      ) : r.signed_up_at ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Signed up</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">Clicked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Commissions convert when referred users make their first payment. Payout is processed on the 1st of each month to PayPal.
          </div>
        </Card>
      )}

      {recent.length === 0 && (
        <Card className="p-8 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-slate-200" />
          <p className="mt-3 text-sm font-semibold text-slate-600">No referrals yet</p>
          <p className="mt-1 text-xs text-slate-400">Share your link above to start earning. Your first referral will appear here.</p>
        </Card>
      )}
    </div>
  );
}
