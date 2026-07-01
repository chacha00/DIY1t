"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const IMPROVEMENTS = [
  { id: "cheaper",       label: "💰 Cheaper Version",         desc: "Reduce material cost by 40%+" },
  { id: "beginner",      label: "🌱 Beginner Version",         desc: "Simpler steps, fewer tools" },
  { id: "eco_friendly",  label: "♻️ Eco-Friendly Version",     desc: "Sustainable & recycled materials" },
  { id: "premium",       label: "✨ Premium Version",           desc: "Luxury materials & finish" },
  { id: "durable",       label: "🔩 Extra Durable Version",    desc: "Built to last for years" },
  { id: "another_version", label: "🔀 Different Design",       desc: "Completely alternative approach" },
];

export function ImproveDesignModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleImprove(improvementType: string) {
    setLoading(improvementType);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/improve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ improvementType }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Generation failed");
        onClose();
        router.push(`/dashboard/projects/${json.projectId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(null);
      }
    });
  }

  const isBusy = isPending || loading !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative w-full max-w-md rounded-3xl p-6 shadow-soft-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Improve My Design</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          Choose how to improve this project. A new version will be generated (costs 1 credit).
        </p>

        <div className="space-y-2">
          {IMPROVEMENTS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleImprove(opt.id)}
              disabled={isBusy}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left transition-colors hover:border-brand-blue-200 hover:bg-brand-blue-50/40 disabled:opacity-50"
            >
              {loading === opt.id ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-blue-500" />
              ) : (
                <span className="text-lg">{opt.label.split(" ")[0]}</span>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {opt.label.split(" ").slice(1).join(" ")}
                </p>
                <p className="text-xs text-slate-400">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {isBusy && (
          <p className="mt-4 text-center text-xs text-slate-400">
            Generating… this takes about 20 seconds
          </p>
        )}
      </div>
    </div>
  );
}
