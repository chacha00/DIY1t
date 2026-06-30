import { Gauge, Clock, DollarSign, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { DiyScore } from "@/types/database";

function formatCents(cents?: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

function formatMinutes(minutes?: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}

export function DiyScoreCard({ score, retailPriceCents, moneySavedCents }: { score: Partial<DiyScore>; retailPriceCents?: number | null; moneySavedCents?: number | null }) {
  const savingsPct =
    retailPriceCents && moneySavedCents != null && retailPriceCents > 0
      ? Math.round((moneySavedCents / retailPriceCents) * 100)
      : null;

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <Gauge className="h-4.5 w-4.5 text-brand-orange-500" />
        DIY Score
      </h2>

      <div className="mt-5 flex items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue-500 via-brand-teal-500 to-brand-orange-500">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-extrabold text-slate-900">
              {score.overall_score ?? "—"}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Overall Score / 100</p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <Clock className="h-4 w-4 text-brand-blue-500" />
          <span className="text-slate-600">{formatMinutes(score.estimated_time_minutes)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <DollarSign className="h-4 w-4 text-brand-teal-500" />
          <span className="text-slate-600">{formatCents(score.estimated_cost_cents)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-brand-orange-500" />
          <span className="text-slate-600">Safety {score.safety_rating ?? "—"}/10</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <Gauge className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Difficulty {score.difficulty ?? "—"}/10</span>
        </div>
      </div>

      {savingsPct != null && (
        <div className="mt-5 rounded-2xl bg-brand-teal-50 px-4 py-3 text-center">
          <p className="text-lg font-extrabold text-brand-teal-600">{savingsPct}% saved</p>
          <p className="text-xs text-brand-teal-600/70">
            vs. {formatCents(retailPriceCents)} retail price
          </p>
        </div>
      )}

      {score.success_probability_beginner != null && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {Math.round(score.success_probability_beginner * 100)}% success probability for beginners
        </p>
      )}
    </Card>
  );
}
